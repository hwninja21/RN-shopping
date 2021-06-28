import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { DEIRegularText } from '../../components';

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import OrderRedux from '../../redux/OrderRedux';
import moment from 'moment';
import { MyAccountSeparator } from './MyAccountComponents';
import { getNavigationOptions } from '../../services/Helpers';

const itemsPerPage = 6;

class MyOrders extends Component {
  static navigationOptions = getNavigationOptions({
    title: 'Order List',
    headerStyle: {
      borderBottomColor: '#cccccc',
      borderBottomWidth: 1
    }
  });

  constructor(props) {
    super(props);
    this.state = { orders: [], currentPage: 1, hasMore: true };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    this.props.getOrders(this.state.currentPage, itemsPerPage);
  };

  onEndReached = () => {
    if (this.state.hasNext) {
      const nextPage = this.state.currentPage + 1;

      this.props.getOrders(nextPage, itemsPerPage);

      this.setState({ currentPage: nextPage });
    }
  };

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.fetching && !this.props.fetching && this.props.orders) {
      const ordersTemp = [];

      for (let index = 0; index < this.props.orders.length; index++) {
        const orderDetails = this.props.orders[index];

        ordersTemp.push({
          ...orderDetails,
          data: orderDetails.products
        });
      }

      this.setState({ orders: this.state.orders.concat(ordersTemp), hasNext: this.props.orders.length > 0 });
    }
  }

  renderSectionHeader = section => {
    console.log(section.order);
    //  debugger;
    var orderId = '';
    if (section) {
      var sectionInfo = section;
      if (sectionInfo.order != null) {
        orderId = sectionInfo.order.order_id;
      }
    }
    return (
      <DEIRegularText
        title={`OrderNo: ${orderId}`}
        style={{
          color: '#262628',
          padding: 10
        }}
      />
    );
  };

  renderOrder(data) {
    const order = data.item;

    const paddingHorizontal = 20;

    const normalFontSize = 16;
    const smallFontSize = normalFontSize - 3;

    let orderDate = 'N/A';
    const rawOrderDate = order['order_date'];

    const accentTextColor = '#ef802e';

    if (rawOrderDate) {
      try {
        orderDate = moment(rawOrderDate, 'YYYY-MM-DD HH:mm:ss').format('dddd D MMMM YYYY / HH:mm')
      } catch (e) {
        //
      }
    }

    return (
      <View style={{
        flex: 1,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e1e1'
      }}>
        <View style={{ flex: 1, paddingHorizontal }}>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <DEIRegularText
              title={`Order ${order.id}`}
              style={{color: '#592d58', fontSize: normalFontSize }}
            />
            <DEIRegularText
              title={order['order_status']}
              style={{ fontSize: smallFontSize }}
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <DEIRegularText
              title="Order Date:"
              style={{ fontSize: normalFontSize, color: 'black' }}
            />
            <DEIRegularText
              title={orderDate}
              style={{ fontSize: smallFontSize, color: 'black' }}
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <DEIRegularText
              title="Delivery Date / Time:"
              style={{ fontSize: normalFontSize, color: 'black' }}
            />
            <DEIRegularText
              title={order['estimated_delivery']}
              style={{ fontSize: smallFontSize, color: accentTextColor }}
            />
          </View>
        </View>

        <View style={{
          paddingHorizontal: paddingHorizontal,
          paddingTop: 15,
          borderTopColor: '#e1e1e1',
          borderTopWidth: 1,
          flex: 1,
          flexDirection: 'row',
          marginTop: 20
        }}>
          <DEIRegularText
            title="Total: "
            style={{ fontSize: normalFontSize, color: 'black' }}
          />
          <DEIRegularText
            title={`S$ ${order['total']}`}
            style={{ fontSize: normalFontSize, color: accentTextColor }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Spinner visible={this.props.fetching} />
        <FlatList
          data={this.state.orders}
          renderItem={this.renderOrder}
          ItemSeparatorComponent={MyAccountSeparator}
          onEndReachedThreshold={0.25}
          onEndReached={this.onEndReached}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ orders }) => ({
  fetching: orders.fetching,
  orders: orders.orders
});

const mapDispatchToProps = dispatch => ({
  getOrders: (page, itemsPerPage) => dispatch(OrderRedux.getOrdersRequest(page, itemsPerPage))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);

const styles = StyleSheet.create({
  headerViewStyle: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: 50,
    marginHorizontal: 10
  }
});
