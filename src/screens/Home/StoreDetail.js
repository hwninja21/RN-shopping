import React, { Component } from 'react';
import { getNavigationOptions } from '../../services/Helpers';

import ProductListView from '../../components/ProductListView';

class StoreDetail extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    const store = navigation.getParam('Store');

    return {
      title: store.name
    };
  });

  getType = () => this.props.navigation.getParam('type');

  render() {
    console.info('navigation', this.props.navigation);

    return (
      <ProductListView
        type={this.getType()}
        id={this.props.navigation.state.params.Store.id}
        entity={this.props.navigation.state.params.Store}
        navigation={this.props.navigation}
      />
    );
  }
}

export default StoreDetail;
