import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';
import RoundedImageWithTitle from './RoundedImageWithTitle';
import SectionTitle from './SectionTitle';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { STCartGridItem } from './STCartGridItem';
import { Colors, ApplicationStyles } from '../themes';

export class HomeSectionItem extends Component {
  productItemClicked = item => {
    this.props.homeNavigation.navigate('HomeProductDetail', {
      ProductId: item.product_id,
      count: item.quantity,
      product: item
    });
  };

  bannerClicked = item => {
    this.props.urlClicked(item);
  };

  renderTitleandViewAll(item) {
    return (
      <SectionTitle
        data={item}
        onPress={item => alert('view all pressed')}
        showAll={!(item.object_id == 0 && item.object_url == '')}
        title={item.name}
      />
    );
  }

  renderBannerImage(bannerUrl) {
    return (
      <View style={styles.bannerViewStyle}>
        <TouchableOpacity onPress={() => this.bannerClicked(this.props.item)} style={{ backgroundColor: 'red' }}>
          <ImageLoad
            style={{ height: 220, width: '100%' }}
            source={{ uri: bannerUrl }}
            placeholderSource={require('../assets/Home/ic_placeholder_banner.png')}
            isShowActivity={false}
            backgroundColor={'#fff'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    const { homeNavigation } = this.props;
    let image = '';
    if (item.logo_url)
      image = item.logo_url;
    else if (item.image_url)
      image = item.image_url;
    return (
      <RoundedImageWithTitle
        onPress={item =>
          homeNavigation.navigate('ProductListView', { Store: item, type: this.type })
        }
        data={item}
        title={item.name}
        imageUrl={image}
      />
    );
  };

  renderProductItem = ({item, index}) => {
      return(
        <View style={{margin:5,width:132}}>
          <STCartGridItem
            item={item}
            action={this.productItemClicked}
          />
        </View>
      );
  };

  render() {
    const { item, index } = this.props;
    let imageurl = '';
    if (item === null) return null;

    const { merchants, products, categories, brands } = item;

    if (item.mobile_banner_url != null) {
      imageurl = item.mobile_banner_url;
    }

    if (item.mobile_banner != null) {
      imageurl = item.mobile_banner;
    }

    let datas = [];

    switch (item.type) {
      case 'merchant':
        this.type = 'merchant';
        datas = merchants;
        break;
      case 'product':
        this.type = 'product';
        datas = products || [];
        break;
      case 'categories':
        this.type = 'category';
        datas = categories;
        break;
      case 'brands':
        this.type = 'brand';
        datas = brands;
        break;
    }

    return (
      <View>
        { imageurl.length < 1 ? this.renderTitleandViewAll(item) : this.renderBannerImage(imageurl) }

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 10
          }}
          data={datas}
          keyExtractor={(item, index) => `home_section_${item.id}-${index}`}
          renderItem={item.type === 'product' ? this.renderProductItem : this.renderItem}
        />
      </View>
    );
  }
}

const maxItemWidth = 80;
const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    marginLeft: 10,
    width: maxItemWidth
  },
  logoContainer: {
    ...ApplicationStyles.shadow.normal,
    borderRadius: 15,
    backgroundColor: Colors.white
  },
  logo: {
    width: maxItemWidth,
    height: maxItemWidth,
    resizeMode: 'contain',
    borderRadius: 15
  },
  merchantName: {
    color: '#000',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 12
  },
  bannerViewStyle: {
    marginHorizontal: 12,
    resizeMode: 'contain',
    borderRadius: 15,
    overflow: 'hidden'
  }
});

HomeSectionItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.any
};

HomeSectionItem.defaultProps = {
  index: 0,
  item: null
};

export default HomeSectionItem;
