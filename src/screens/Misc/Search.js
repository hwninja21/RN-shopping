import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import API from '../../services/Api';
import { TextInput, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getNavigationOptions } from '../../services/Helpers';
import { debounce } from 'lodash';
import { DEIMediumText, DEIRegularText } from '../../components';
import { Colors, Fonts } from '../../themes';
import { productListViewTypes } from '../../config';

const api = API.create();

const SectionItem = ({ item, imageKey, nameKey = 'name', placeholderSource, renderTitle, onPress }) => {
  const imageSource = item[imageKey] ? {uri: item[imageKey]} : placeholderSource;

  if (!renderTitle) {
    renderTitle = () => (
      <DEIRegularText title={item[nameKey]}/>
    );
  }

  return (
    <TouchableOpacity
      style={{display: 'flex', flexDirection: 'row', paddingVertical: 5, alignItems: 'center'}}
      onPress={() => onPress ? onPress(item) : null}
    >
      <View
        style={styles.sectionImageContainer}>
        <ImageLoad
          resizeMode='contain'
          style={{flex: 1, width: null, height: null}}
          source={imageSource}
          placeholderStyle={{flex: 1, width: null, height: null}}
          placeholderSource={placeholderSource}
        />
      </View>
      { renderTitle(item) }
    </TouchableOpacity>
  );
};

const Section = ({name, data, imageKey, nameKey, placeholderSource, keyExtractor, style, renderTitle, onPress}) => {
  if (!data || !data.length) {
    return null;
  }

  return (
    <View style={{width: '100%', ...style}}>
      <DEIMediumText title={name} style={styles.sectionTitle}/>
      {
        data.map(item => (
          <SectionItem
            item={item}
            imageKey={imageKey}
            nameKey={nameKey}
            placeholderSource={placeholderSource}
            keyExtractor={keyExtractor}
            renderTitle={renderTitle}
            onPress={onPress}
            key={keyExtractor(item)}
          />
        ))
      }
    </View>
  )
};

class Search extends React.Component {
  static navigationOptions = getNavigationOptions(({navigation}) => {
    const onTermChange = navigation.getParam('onTermChange');

    return {
      headerTitle: (
        <View style={{flex: 1}}>
          <TextInput
            placeholder="Search shop or product"
            autoFocus={true}
            onChangeText={onTermChange}
            returnKeyType="search"
            onSubmitEditing={navigation.getParam('onSubmitEditing')}
          />
        </View>
      ),
      headerRight: null,
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      }
    }
  });

  constructor(props) {
    super(props);

    this.state = {
      term: '',
      isLoading: null,
      result: null
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      // Delay the state being changed to 0.5s in order to avoid unnecessary api calls
      onTermChange: debounce(term => this.setState({term}), 500),
      onSubmitEditing: this.seeAllResults
    });
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevState.term !== this.state.term) {
      this.search();
    }
  }

  search = async () => {
    this.setState({isLoading: true});

    try {
      const result = await api.search({term: this.state.term});

      this.setState({result: result.data, isLoading: false});
    } catch (e) {
      this.setState({isLoading: false});
    }
  };

  seeAllResults = () => this.props.navigation.push(
    'ProductListView',
    { type: productListViewTypes.search, term: this.state.term }
  );

  render() {
    const {result} = this.state;

    if (!result) {
      return null;
    }

    console.info('result', result);

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{paddingHorizontal: 10}}>

          <Section
            name="Brands"
            data={this.state.result['Brands']}
            imageKey="logo_url"
            keyExtractor={brand => `brand-${brand.id}`}
            placeholderSource={require('../../assets/Home/ic_placeholder_banner.png')}
            onPress={
              brand => this.props.navigation.push(
                'ProductListView', { Store: brand, type: productListViewTypes.brand, id: brand.id }
              )
            }
          />

          <Section
            name="Merchants"
            style={{marginTop: 10}}
            data={this.state.result['Merchants']}
            imageKey="logo_url"
            keyExtractor={merchant => `merchant-${merchant.id}`}
            placeholderSource={require('../../assets/Home/ic_placeholder_banner.png')}
            onPress={
              merchant => this.props.navigation.push(
                'ProductListView', { Store: merchant, type: productListViewTypes.merchant, id: merchant.id }
              )
            }
          />

          <Section
            name="Categories"
            style={{marginTop: 10}}
            data={this.state.result['Categories']}
            imageKey="image_url"
            keyExtractor={category => `category-${category.id}`}
            placeholderSource={require('../../assets/Home/ic_placeholder_banner.png')}
            onPress={
              category => this.props.navigation.push(
                'ProductListView', { Store: category, type: productListViewTypes.category, id: category.id }
              )
            }
          />

          <Section
            name="Products"
            style={{marginTop: 10}}
            data={this.state.result['Products']}
            imageKey="image_square_url"
            keyExtractor={product => `category-${product.id}`}
            placeholderSource={require('../../assets/Home/ic_placeholder_banner.png')}
            renderTitle={
              product => (
                <View>
                  <DEIRegularText title={product.name} />
                  <DEIRegularText
                    title={`S$ ${parseFloat(product.price).toFixed(2)}`}
                    style={styles.priceStyle}
                  />
                </View>
              )
            }
            onPress={
              product => this.props.navigation.push('HomeProductDetail', {
                ProductId: product.id,
                count: product.quantity,
                product: product
              })
            }
          />

          {
            !this.state.isLoading && this.state.result['Products'] && (
              this.state.result['Products'].length ? (
                <TouchableOpacity onPress={this.seeAllResults}>
                  <DEIRegularText title="See all results" />
                </TouchableOpacity>
              ) : (
                <View style={{ marginVertical: 10, width: '100%' }}>
                  <DEIRegularText title="No products found" style={{ textAlign: 'center' }} />
                </View>
              )
            )
          }

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Fonts.size.regular,
    fontWeight: 'bold',
    color: 'black'
  },
  sectionImageContainer: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    marginHorizontal: 10
  },
  priceStyle: {
    fontSize: 18,
    color: Colors.accent,
    fontWeight: '600',
    fontFamily: Fonts.type.base
  }
});

export default Search;
