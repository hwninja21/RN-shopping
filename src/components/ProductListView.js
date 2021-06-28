import React from 'react';
import PropTypes from 'prop-types';
import EasyGrid from './EasyGrid';
import ProductTypes from '../redux/ProductRedux';
import SectionTitle from './SectionTitle';
import FeatherIcon from 'react-native-vector-icons/Feather';
import _ from 'lodash';
import RoundedImageWithTitle from './RoundedImageWithTitle';
import HomeSectionItem from './HomeSectionItem';
import ProductListViewRedux from '../redux/ProductListViewRedux';
import { connect } from 'react-redux';
import { productListViewTypes } from '../config';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../themes';
import { DEIMediumText } from './APIConstants';
import { FlatList } from "react-navigation";
import { STCartGridItem } from './STCartGridItem';
import API from '../services/Api';

const api = API.create();

class ProductListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      hasMore: true,
      products: [],
      fetching: true,
      header: null,
      itemsPerPage: this.props.itemsPerPage,
      categories: null
    };
  }

  componentDidMount() {
    if (this.type !== productListViewTypes.search) {
      this.props.getMerchantDetail({ id: this.props.id, type: this.props.type });
    }

    if (this.props.type === productListViewTypes.category) {
      const categories = this.props.navigation.getParam('categories') || this.props.categories;

      const category = this.findNestedCategory(this.props.id, categories);

      if (category && category.category) {
        this.setState({ categories: category.category })
      }
    }

    this.getNextProductsPage();
  }

  findNestedCategory = (categoryId, categories) => {
    if (categories && Array.isArray(categories)) {
      let foundCategory = categories.find(({ id }) => id === categoryId);

      if (!foundCategory) {
        for (const category of categories) {
          foundCategory = this.findNestedCategory(categoryId, category.category);

          if (foundCategory) {
            return foundCategory;
          }
        }
      }

      return foundCategory;
    }
  };

  onEndReached = () => {
    if (this.state.fetching || !this.state.hasMore) {
      return;
    }

    this.getNextProductsPage();
  };

  getNextProductsPage = async () => {
    this.setState({ fetching: true });

    const nextPage = this.state.currentPage + 1;
    let hasMore = false;
    let products = [];
    let header;

    try {
      const queryData = {
        type: this.props.parentEntity ? this.props.parentEntity.type : this.props.type,
        id: this.props.parentEntity ? this.props.parentEntity.id : this.props.id,
        itemsPerPage: this.state.itemsPerPage,
        page: nextPage
      };

      if (this.props.parentEntity && (this.props.type === productListViewTypes.category)) {
        queryData.categoryIds = this.props.id;
      }

      if (this.props.type === productListViewTypes.search) {
        queryData.search = this.props.navigation.getParam('term');
      }

      const result = await api.getProductListViewProducts(queryData);

      if (result.data) {
        products = result.data.Products;
        header = result.data.Header && result.data.Header[0];
        hasMore = products.length >= this.state.itemsPerPage;
      }
    } catch (e) {
      console.info('gpe', e);
    }

    this.setState({
      currentPage: nextPage,
      products: [ ...this.state.products, ...products],
      header,
      hasMore,
      fetching: false
    });
  };

  getCategories = () => {
    if (!this.state.header || !this.state.header['category_ids']) {
      return [];
    }

    // Split the category ids and convert them to int
    let categoryIds = this.state.header['category_ids'].split(',').map(id => parseInt(id));

    // If this is a category then remove it from the list of category ids
    if (this.props.type === productListViewTypes.category) {
      categoryIds = categoryIds.filter(id => id !== this.props.id);
    }

    const categories = this.state.categories || this.props.categories;

    return _.filter(categories, category => categoryIds.indexOf(category.id) > -1);
  };

  showProductDetail = item => {
    this.props.navigation.navigate('HomeProductDetail', {
      ProductId: item['product_id'],
      count: item.quantity,
      product: item
    });
  };

  renderBanner = () => {
    // Do not render the banner for searches
    if (!this.props.entity || this.props.type === productListViewTypes.search) {
      return null;
    }

    return <Image
      source={{ uri: this.props.entity['mobile_banner_url'] || this.props.entity['mobile_banner'] }}
      style={styles.banner}
    />;
  };

  renderReadMore = () => {
    // Render this section only for merchants
    if (this.props.type !== productListViewTypes.merchant) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.timeWrapper}
        onPress={() => this.props.navigation.navigate('StoreReadMore', { store: this.props.entity })}
      >
        <Text style={styles.readMore}>Read More</Text>
      </TouchableOpacity>
    );
  };

  renderSearchBar = () => (
    <View style={styles.searchWrapper}>
      <TouchableOpacity style={styles.roundedSearch} onPress={() => this.props.navigation.navigate('Search')}>
        <React.Fragment>
          <FeatherIcon name="search" color={'#B7B7B7'} size={20} />
          <DEIMediumText
            title="SEARCH SHOP OR PRODUCT"
            style={{ color: '#B7B7B7', marginLeft: 20 }}
          />
        </React.Fragment>
      </TouchableOpacity>
    </View>
  );

  renderProductsCount = () => {
    const productsCount = (this.state.header && this.state.header.total) || 0;

    return (
      <Text style={{margin:10,fontSize:12}}>
        Showing {productsCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} products
      </Text>
    )
  };

  onCategoryPress = category => {
    this.props.navigation.push('ProductListView', {
      type: productListViewTypes.category,
      Store: category,
      id: category.id,
      parentStore: this.props.parentEntity || { ...this.props.entity, type: this.props.type },
      categories: this.state.categories
    });
  };

  renderCategory = ({ item: category }) => {
    return (
      <RoundedImageWithTitle
        onPress={category => this.onCategoryPress(category)}
        data={category}
        title={category.name}
        imageUrl={category['image_url']}
      />
    );
  };

  renderCategories = () => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginTop: 10}}
        data={this.getCategories()}
        renderItem={this.renderCategory}
        keyExtractor={category => `category-${category.id}`}
      />
    );
  };

  renderSections = () => {
    if (
      !this.props.merchantDetail ||
      !this.props.merchantDetail.Sections ||
      !this.props.merchantDetail.Merchant ||
      this.props.type === productListViewTypes.search
    ) {
      return null;
    }

    let sections = this.props.merchantDetail.Sections;

    if (this.props.type !== productListViewTypes.merchant) {
      // Hide the 'suggested products section for anything that's not a merchant
      sections = sections.filter(section => section.name !== 'Suggested Products');
    }

    // TODO: add the 'urlClicked' prop
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{marginTop: 10}}
        data={sections}
        keyExtractor={(item, index) => `section_${item.id}-${index}`}
        renderItem={({ item, index }) => (
          <HomeSectionItem
            item={item}
            index={index}
            urlClicked={() => null}
            homeNavigation={this.props.navigation}
          />
        )}
      />
    )
  };

  renderHeader = () => (
    <View>
      { this.renderBanner() }
      { this.renderReadMore() }
      { this.renderSearchBar() }
      { this.renderProductsCount() }

      <SectionTitle title="CATEGORIES" showAll />
      { this.renderCategories() }

      { this.renderSections() }

      <SectionTitle title="PRODUCTS" showAll={false} />
    </View>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <EasyGrid
          numColumns={3}
          data={this.state.products}
          renderItem={store => (<STCartGridItem item={store.item} action={this.showProductDetail} />)}
          keyExtractor={product => `product-${product.id}`}
          marginExternal={10}
          marginInternal={10}
          loadingMore={this.state.fetching}
          onEndReached={this.onEndReached}
          ListHeaderComponent={this.renderHeader()}
        />
      </View>
    );
  }
}

ProductListView.defaultProps = {
  itemsPerPage: 12
};

ProductListView.propTypes = {
  type: PropTypes.oneOf(Object.values(productListViewTypes)).isRequired,
  id: PropTypes.number,
  entity: PropTypes.object,
  itemsPerPage: PropTypes.number
};

const styles = StyleSheet.create({
  banner: { width: '100%', height: 230, resizeMode: 'cover', alignItems: 'center'},
  timeWrapper: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  clockContainer: { flexDirection: 'row', alignItems: 'center' },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.darkGrey
  },
  roundedSearch: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  readMore: {
    ...Fonts.style.normal,
    color: Colors.white
  }
});

const mapStateToProps = ({ products, configuration }) => ({
  merchantDetail: products.merchantDetail,
  categories: configuration.home.categories,
});

const mapDispatchToProps = (dispatch) => ({
  getMerchantDetail: (form) => dispatch(ProductTypes.getMerchantDetail(form)),
  getProducts: data => dispatch(ProductListViewRedux.getProductsRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView);
