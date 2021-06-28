import React, { Component } from 'react';
import ProductListView from '../../components/ProductListView';
import { getNavigationOptions } from '../../services/Helpers';
import { productListViewTypes } from '../../config';

class ProductListViewScreen extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    const store = navigation.getParam('Store');
    const type = navigation.getParam('type');

    return { title: type === productListViewTypes.search ? 'Search' : store.name };
  });

  getType = () => this.props.navigation.getParam('type');

  getId = () => {
    const navigation = this.props.navigation;

    const paramsId = navigation.getParam('id');

    if (paramsId) {
      return paramsId;
    }

    const store = navigation.getParam('Store');

    if (store && store.id) {
      return store.id;
    }
  };

  render() {
    return (
      <ProductListView
        type={this.getType()}
        id={this.getId()}
        entity={this.props.navigation.state.params.Store}
        parentEntity={this.props.navigation.getParam('parentStore')}
        navigation={this.props.navigation}
      />
    );
  }
}

export default ProductListViewScreen;
