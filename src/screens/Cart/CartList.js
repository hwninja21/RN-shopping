import {
  CartButton,
  DEIBoldText,
  DEIRegularText,
  QuickSandRegular,
  StoreCartItem
} from '../../components/index';
import {
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import React, { Component } from 'react';

import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import Axios from 'axios';
import CartActions from '../../redux/CartRedux'
import { EmptyView } from '../../components/EmptyView';
import { NavigationEvents } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'

const screenHeight = Dimensions.get('screen').height;

class CartList extends Component {
  static navigationOptions = {
    title: 'Cart'
  };

  constructor(props) {
    super(props);

    this.state = {
      deliveryFee: 0,
      grandTotal: 0,
      subTotal: 0,
      isLoading: false,
      card_id: '0',
      delivery_fee: {}
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchCart()
    })
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.user != this.props.user) {
      this.fetchCart();
    }
  }

  fetchCart = () => this.props.getCart()

  fetchItemsForCart = () => {
    const { cart } = this.props
    if (cart) {
      this.props.setCartDetail(cart.products);
    }

  };

  deleteProductItem = product => {
    this.props.removeProductFromCart({
      cart_id: this.props.cart.id,
      cart_product_id: product.cart_product_id
    })
  };

  clearCart = () => {
    this.props.emptyCart(this.props.cart.id)
  };

  checkoutCompleted = () => {
    this.setState({ card_id: '0' });
  };

  editCart = (form) => {
    const {cart} = this.props
    this.props.editCart({
      cart_id: cart.id,
      cart_product_id: form.cart_product_id,
      product_id: form.id,
      amount: form.quantity,
      product_options: form.product_options
    })
  }

  updateCartItemToAPI(item) {
    var cartId = this.state.card_id;

    var productOptions = '';
    if (
      item.product_option_param != null &&
      Object.keys(item.product_option_param).length > 0
    ) {
      productOptions = JSON.stringify(item.product_option_param);
    }
    const cartParams = {
      cart_id: cartId,
      product_id: item.product_id,
      amount: item.quantity,
      product_options: productOptions
    };


    return new Promise((resolve, reject) => {
      var headers = AppSessionManager.shared().getAuthorizationHeader();
      Axios.post(API.CartAdd, cartParams, headers)
        .then(result => {
          const cart = result.data.Cart;
          var delivery_fee = {};
          var cardIdValue = '0';
          if (cart.id != null) {
            cardIdValue = cart.id;
          }
          if (cart.delivery_fee != null) {
            delivery_fee = cart.delivery_fee;
          }

          this.setState({ card_id: cardIdValue, delivery_fee: delivery_fee });
          resolve(result);
        })
        .catch(err => {
          resolve(err.response);
        });
    });
  }

  async processCartItems() {
    var cartitems = AppSessionManager.shared().getOrders();
    let result;
    var responsearray = [];
    for (let i = 0; i < cartitems.length; i++) {
      result = await this.updateCartItemToAPI(cartitems[i]);
      responsearray[i] = result.data;
    }
    this.setState({ isLoading: false });
    return responsearray;
  }

  checkoutAction = () => {
    this.setState({ isLoading: true });
    const data = this.processCartItems();
    data.then(result => {
      const checkoutInfo = {
        cartId: this.state.card_id,
        delivery_fee: this.state.delivery_fee,
        itemTotal: this.state.subTotal
      };

      AppSessionManager.shared().saveCheckoutInfo(checkoutInfo);
      this.props.navigation.navigate('CheckoutMain', {
        cartId: this.state.card_id,
        delivery_fee: this.state.delivery_fee,
        itemTotal: this.state.subTotal,
        checkoutCompleted: this.checkoutCompleted
      });
    });
  };

  renderFooter = () => {
    const { cart } = this.props;

    if (cart && cart.products && cart.products.length < 1) {
      return <View />;
    }
    const {
      safeTextStyle,
      removeCartStyle,
      deleteCartIconStyle
    } = styles;
    return (
      <View style={{ marginHorizontal: 20 }}>
        <TouchableOpacity onPress={this.clearCart} style={removeCartStyle}>
          <Image
            style={deleteCartIconStyle}
            source={require('../../assets/Stores/ic_delete_cart.png')}
          />
          <DEIRegularText
            title={'Remove all items from cart'}
            style={{ color: '#FF8960' }}
          />
        </TouchableOpacity>

        <View>
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          <TotalView title={'Total'} amount={'$' + cart.total} />
          <View style={{ height: 0.3, backgroundColor: '#707070' }} />
          <View style={{ alignItems: 'center', margin: 10 }}>
            <CartButton title={'Checkout'} action={this.checkoutAction} />
          </View>
        </View>
        <View style={safeTextStyle}>
          <Image
            style={{ width: 24, height: 36 }}
            source={require('../../assets/Stores/ic_secure.png')}
          />
          <DEIRegularText
            title={'Safe and secure payments.100% Authentic products.'}
            style={{ marginHorizontal: 15 }}
          />
        </View>
      </View>
    );
  };

  // when Continue empty button pressed from empty cart view
  showHome = () => {
    this.props.navigation.navigate('Home');
  };

  renderHeader = () => {
    const { cart } = this.props
    if (cart && cart.products && cart.products.length > 0) {
      return (
        <DEIBoldText
          title={'Selected Items'}
          style={{ fontSize: 18, marginVertical: 10, marginLeft: 10 }}
        />
      );
    }
    return <View style={{ height: 1 }} />;
  };

  render() {
    const { cart, posting } = this.props
    const data = (cart && cart.products) ? cart.products : []
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.fetchItemsForCart();
          }}
        />
        <Spinner
          visible={posting}
          textContent={'Processing'}
        />
        <FlatList
          style={{ height: '100%' }}
          data={data}
          extraData={this.state}
          onRefresh={this.fetchCart}
          refreshing={false}
          ListHeaderComponent={this.renderHeader()}
          ListEmptyComponent={
            <View
              style={{
                height: screenHeight - 100,
                justifyContent: 'center'
              }}
            >
              <EmptyView type={1} action={this.showHome} />
            </View>
          }
          ListFooterComponent={this.renderFooter()}
          keyExtractor={(item, index) => `cart-item-${item.id}-index-${index}`}
          renderItem={({ item }) => (
            <StoreCartItem
              item={item}
              qstatus={true}
              quantityChanged={product => this.editCart(product)}
              deleteProduct={this.deleteProductItem}
              isfromCart={true}
              showDelete={true}
            />
          )}
        />
      </View>
    );
  }
}

const PromoCodeShadowView = props => {
  return (
    <View style={[styles.promocodeViewStyle, props.style]}>
      {props.children}
    </View>
  );
};

const TotalView = ({ title, amount }) => {
  const fontSizeAmount = title == 'Total' ? 22 : 16;
  return (
    <View style={styles.totalViewStyle}>
      <DEIRegularText title={title} style={{ fontSize: 14 }} />
      <DEIRegularText title={amount} style={{ fontSize: fontSizeAmount }} />
    </View>
  );
};

const styles = StyleSheet.create({
  totalViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  deleteCartIconStyle: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginHorizontal: 10
  },
  removeCartStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row'
  },
  safeTextStyle: {
    backgroundColor: '#F8F8FF',
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10
  },
  promocodeViewStyle: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff'
  },
});

const mapDispatchToProps = (dispatch) => ({
  getCart: () => dispatch(CartActions.getCart()),
  removeProductFromCart: (form) => dispatch(CartActions.removeProductFromCart(form)),
  emptyCart: (cart_id) => dispatch(CartActions.emptyCart(cart_id)),
  editCart: (form) => dispatch(CartActions.editCart(form)),
  setCartDetail: (products) => dispatch(CartActions.setCartDetail(products))
})

const mapStateToProps = ({ cart, auth }) => ({
  ...cart,
  user: auth.user || {},
})
export default connect(mapStateToProps, mapDispatchToProps)(CartList);
