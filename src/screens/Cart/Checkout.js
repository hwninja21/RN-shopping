import React, { Component } from 'react';
import { View, StyleSheet, WebView } from 'react-native';

import CartPaymentView from './CartPayment';
import CartDelivery from './CartDelivery';
import CartConfirmation from './CartConfirmation';
import AppSessionManager from '../../components/AppSessionManager';
import API from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'
import CartActions from '../../redux/CartRedux'
import { getNavigationOptions } from '../../services/Helpers';

class Checkout extends Component {
  static navigationOptions = getNavigationOptions(() => ({
    title: 'Checkout',
    headerBackTitle: 'Back',
    headerStyle: {
      borderBottomColor: '#cccccc',
      borderBottomWidth: 1
    }
  }));

  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: 1,
      deliveryInfo: {},
      isCardRefresh: false,
      completedTabStatus: 1,
      isLoading: false,
      chargeInfo: {},
      paymentStatusDone: false,
      authorizeRedirect: null,
      checkoutParams: null
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    const response = this.props.checkoutResponse;

    if (
      prevProps.isCheckingOut &&
      !this.state.authorizeRedirect &&
      response &&
      response.data &&
      response.data.Charge &&
      response.data.Charge.order &&
      response.data.Charge.order['authorize_redirect']
    ) {
      this.setState({ authorizeRedirect: response.data.Charge.order['authorize_redirect'] })
    }

    if (
      prevProps.isCheckingCheckoutStatus &&
      !this.props.isCheckingCheckoutStatus &&
      this.props.checkoutStatus
    ) {
      if (this.props.checkoutStatus.isSuccess) {
        // Refresh the cart and navigate to the delivery result
        this.props.getCart();
      }

      this.props.navigation.navigate('DeliveryResult',
        {
          status: this.props.checkoutStatus.isSuccess ? 'success' : 'failed',
          errorMessage: this.props.checkoutStatus.errorMessage
        }
      );
    }
  };

  menuOptionChanged = title => {
    this.setState({ selectedMenu: title });
  };

  changeTabStatus = status => {
    this.setState({ completedTabStatus: status });
  };

  addCard = () => {
    this.props.navigation.navigate('AddNewCard', {
      refreshItem: item => this.refreshItem(item)
    });
  };

  refreshItem(item) {
    this.setState({ isCardRefresh: true });
  }

  gotoHomeTab = () => {
    AppSessionManager.shared().resetCart();
    this.props.emptyCart(this.props.cart.id)
    this.props.navigation.goBack();
    this.props.navigation.state.params.checkoutCompleted();
  };

  deliveryCompleted = details => {
    this.setState({ deliveryInfo: details, selectedMenu: 2 });
  };

  proceedToPay = cardInfo => {

    console.log('cardInfo', cardInfo)
    if (cardInfo.id == null) {
      alert('Unable to process payment - please try again later');
      return;
    }

    const { address, deliveryInfo } = this.state.deliveryInfo;
    console.log('address, deliveryInfo', address, deliveryInfo)
    if (address.id == null) {
      alert('Unable to process payment - please try again later');
      return;
    }

    if (
      deliveryInfo.delivery_date == null ||
      deliveryInfo.delivery_timeslot == null
    ) {
      alert('Unable to process payment - please try again later');
      return;
    }

    var headers = AppSessionManager.shared().getAuthorizationHeader();
    const { cart } = this.props;
    console.log('proceedToPay - cart', cart)
    var url =
      API.Checkout +
      `?cart_id=${cart.id}&card_id=${cardInfo.id}&address_id=${
        address.id
      }&delivery_date=${deliveryInfo.delivery_date}&delivery_timeslot=${
        deliveryInfo.delivery_timeslot
      }`;

    const data = {
      'cart_id': cart.id,
      'card_id': cardInfo.id,
      'address_id': address.id,
      'delivery_date': deliveryInfo['delivery_date'],
      'delivery_timeslot': deliveryInfo['delivery_timeslot'],
      'payment_mode': 'card' // TODO: change this value when the feature of changing the payment method is ready
    };

    this.props.checkout(data);

    const that = this;

    this.setState({ checkoutParams: data }, () => {that.props.checkout(data);});
  };

  authorizeWebViewOnNavigationStateChange = data => {
    const url = data && data.url;

    // Make sure that the url domain is either shop.dei.com.sg or dei.com.sg
    const reg = RegExp('^https?:\\/\\/(www)?.?(shop)?.?dei.com.sg\\/');

    if (url && reg.test(url) && url.indexOf('/checkout') > -1) {
      this.props.checkCheckoutStatus(this.state.checkoutParams['cart_id']);
      this.setState({ authorizeRedirect: null });
    }
  };

  renderAuthorizeView = () => {
    return (
      <WebView
        source={{ uri: this.state.authorizeRedirect }}
        onNavigationStateChange={this.authorizeWebViewOnNavigationStateChange}
      />
    )
  };

  renderTabContentView = () => {
    const {
      selectedMenu,
      deliveryInfo,
      isCardRefresh,
      chargeInfo
    } = this.state;

    switch (selectedMenu) {
      case 2:
        return (
          <CartPaymentView
            action={this.proceedToPay}
            addCardAction={() => this.addCard()}
            refreshCard={isCardRefresh}
            deliveryInfo={deliveryInfo}
            navigation={this.props.navigation}
          />
        );
      case 3:
        return (
          <CartConfirmation
            action={() => this.gotoHomeTab()}
            charge={chargeInfo}
          />
        );
      default:
        return (
          <CartDelivery
            action={this.deliveryCompleted.bind(this)}
            changeTabStatus={this.changeTabStatus}
            delivery={deliveryInfo}
          />
        );
    }
  };

  render() {
    const { tabContentViewStyle } = styles;

    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading || this.props.isCheckingOut || this.props.isCheckingCheckoutStatus} />

        {
          !this.state.authorizeRedirect ? (
            <View style={tabContentViewStyle}>{this.renderTabContentView()}</View>
          ) : this.renderAuthorizeView()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabContentViewStyle: {
    backgroundColor: '#f5f5f5',
    height: '94%',
    marginTop: 30
  }
});

const mapStateToProps = ({ cart, auth }) => ({
  cart: cart.cart,
  isCheckingOut: cart.isCheckingOut,
  checkoutError: cart.checkoutError,
  checkoutResponse: cart.checkoutResponse,
  address: auth.address,
  isCheckingCheckoutStatus: cart.isCheckingCheckoutStatus,
  checkoutStatus: cart.checkoutStatus
});

const mapDispatchToProps = (dispatch) => ({
  getCart: () => dispatch(CartActions.getCart()),
  emptyCart: (form) => dispatch(CartActions.emptyCart(form)),
  checkout: params => dispatch(CartActions.checkoutRequest(params)),
  checkCheckoutStatus: cartId => dispatch(CartActions.checkCheckoutStatusRequest(cartId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
