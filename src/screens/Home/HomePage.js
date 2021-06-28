import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  StoreBanner,
  DEIMediumText
} from './../../components/index';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../../components/AppSessionManager';
import { NavigationEvents } from 'react-navigation';
import AuthActions from '../../redux/AuthRedux';

import HomeSectionItem from '../../components/HomeSectionItem';
import HomeCategoryItems from '../../components/HomeCategoryItems';
import { Colors, ApplicationStyles, Images } from '../../themes';
import HomeExploreInfo from '../../components/HomeExploreInfo';
import { getNavigationOptions } from '../../services/Helpers';
import { productListViewTypes } from '../../config';

const scrWidth = Dimensions.get('screen').width;

const objectTypes = {
  url: 'url',
  brand: 'brand',
  category: 'category',
  merchant: 'merchant',
  product: 'product'
};

export class HomePage extends Component {
  static navigationOptions = getNavigationOptions({});

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      home: {},
      activeSlide: 0,
      banners: [],
      sections: [],
      categories: [],
    };
  }

  // componentDidMount() {
  //   this.updateDisplay()
  // }

  // componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
  //   if (prevProps.home !== this.props.home) {
  //     this.updateDisplay();
  //   }
  // }

  // updateDisplay = () => {
  //   home = this.props.home;

  //   if (home != null) {
  //     var bannerList = [];
  //     if (Array.isArray(home.banner)) {
  //       bannerList = home.banner;
  //     }

  //     var sectionList = [];
  //     if (Array.isArray(home.sections)) {
  //       sectionList = home.sections;
  //     }

  //     var categoryList = [];
  //     if (Array.isArray(home.categories)) {
  //       categoryList = home.categories;
  //       // TODO: remove this later
  //       AppSessionManager.shared().updateCategoriesList(categoryList);
  //     }
  //     this.setState({
  //       isLoading: false,
  //       home,
  //       banners: bannerList,
  //       sections: sectionList,
  //       categories: categoryList
  //     });
  //   }
  // };

  storeBannerItemClicked = item => {
    const objectType = item['object_type'];
    const objectId = item['object_id'];

    if (objectType === objectTypes.url && item['object_url']) {
      this.props.navigation.navigate('WebView', { source: { uri: item['object_url'] } });
    } else if (objectId !== 0) {
      this.props.navigation.navigate('ProductListView', {
        Store: item,
        type: objectType,
        id: objectId
      });
    }
  };

  renderBanners = () => {
    const { activeSlide } = this.state;
    const { banner } = this.props.home;
    if (banner && banner.length > 0) {
      return (
        <View
          style={{
            width: '100%',
            height: 'auto',
            alignItems: 'center'
          }}
        >
          <Carousel
            layout={'default'}
            removeClippedSubviews={false}
            ref={c => {
              this._carousel = c;
            }}
            data={banner}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.storeBannerItemClicked(item)}
                style={{ alignItems: 'center' }}
              >
                <StoreBanner item={item} mWidth={scrWidth} mHeight={220} />
              </TouchableOpacity>
            )}
            sliderWidth={scrWidth}
            itemWidth={scrWidth}
            onSnapToItem={index => this.setState({ activeSlide: index })}
            loop={true}
            autoplay={true}
            autoplayInterval={7000}
            lockScrollWhileSnapping={true}
            enableMomentum={false}
          />
          <View style={{ position: 'absolute', bottom: -20 }}>
            <Pagination
              dotsLength={banner.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                height: 20,
                width: 20
              }}
              dotStyle={{
                width: 7,
                height: 7,
                borderRadius: 5,
                marginHorizontal: 4,
                borderWidth: StyleSheet.hairlineWidth,
                backgroundColor: Colors.white
              }}
              inactiveDotStyle={{
                backgroundColor: Colors.darkGrey
              }}
              inactiveDotOpacity={1.0}
              inactiveDotScale={1.0}
            />
          </View>
        </View>
      );
    }
  };

  categoryClicked = item => {
    this.props.navigation.navigate('HomeStoreCategories', {
      selectedCategory: item
    });
  };

  renderCategories = () => {
    const { categories } = this.props.home;

    if (!categories || categories.length < 1)
      return;

    // TODO: remove this later
    AppSessionManager.shared().updateCategoriesList(categories);
    return (
      <View style={{ marginHorizontal: 10, marginTop: 20, margin: 'auto' }}>
        <HomeCategoryItems
          items={categories}
          onClick={this.categoryClicked}
        />
      </View>
    );
  };

  bannerUrlClicked = item => {
    console.info('item clicked', item);
    if (item != null && Object.keys(item).length > 0) {``
      if (item.object_type == 'url') {
        this.props.navigation.navigate('HomeBannerUrlPage', {
          url: item.object_url,
          title_name: ''
        });
      } else if (item.object_type == 'category') {
        this.props.navigation.navigate('HomeBannerCategoryList', {
          categoryId: item.object_id,
          categoryName: item.name
        });
      }
    }
  };

  resetSectionProductQuantityCount = sections => {
    console.log(sections);
  };

  refreshCartProduct = () => {
    const { sections } = this.props.home;

    if (!sections || sections.length < 1) {
      return;
    }
    //  debugger;
    if (
      AppSessionManager.shared().isHomeChanged == true ||
      AppSessionManager.shared().isCartChanged == true
    ) {
      AppSessionManager.shared().isHomeChanged = false;
      AppSessionManager.shared().isCartChanged == false;
      var cartitems = AppSessionManager.shared().getOrders();
      if (cartitems.length < 1) {
        this.resetSectionProductQuantityCount(sections);
      } else {
        var updatedSections = [];
        for (const sectionInfo of sections) {
          var updateSectionItem = sectionInfo;
          const products = sectionInfo['products'];
          var productsList = [];
          if (Array.isArray(products)) {
            for (const item of products) {
              var productItem = item;
              productItem.quantity = 0;
              for (const cartitem of cartitems) {
                if (cartitem.product_id == productItem.product_id) {
                  productItem.quantity = cartitem.quantity;
                  console.log('match found');
                  break;
                }
              }
              productsList.push(productItem);
            }
            updateSectionItem['products'] = productsList;
          }
          updatedSections.push(updateSectionItem);
        }
        this.setState({ sections: updatedSections });
      }
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.grey}
          barStyle="light-content"
        />
        <NavigationEvents
          onWillFocus={payload => {
            this.refreshCartProduct();
          }}
        />
        <Spinner visible={isLoading} />
        <ScrollView>
          <View>
            <HomeExploreInfo
              navigation={this.props.navigation}
            />
            {this.renderBanners()}
            <View style={styles.searchWrapper}>
              <TouchableOpacity
                style={styles.searchBarViewStyle}
                onPress={() =>
                  this.props.navigation.navigate('Search')
                }
              >
                <FeatherIcon name="search" color={'#B7B7B7'} size={20} />
                <DEIMediumText
                  title="SEARCH SHOP OR PRODUCT"
                  style={{ color: '#B7B7B7', flex: 1, marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: 10
              }}
              data={this.props.home.sections}
              extraDat={this.state}
              keyExtractor={(item, index) => `section_${index}`}
              renderItem={({ item, index }) => (
                <HomeSectionItem
                  item={item}
                  index={index}
                  urlClicked={this.storeBannerItemClicked}
                  homeNavigation={this.props.navigation}
                />
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchWrapper: { backgroundColor: Colors.darkPrimary, padding: 10 },
  searchBarViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#fff',
    borderColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    ...ApplicationStyles.shadow.normal
  }
});

const mapStateToProps = ({ configuration, auth }) => ({
  home: configuration.home,
  user: auth.user || {},
  launchData: auth.launchData || {}
})
export default connect(mapStateToProps)(HomePage);
