import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import CartActions from '../../redux/CartRedux'
import { connect } from 'react-redux'

import {
  CartButton,
  DEIBoldText,
  DEIRegularText,
} from '../../components/index';
import colors from '../../themes/Colors';

class CartTotalView extends Component {
  constructor(props) {
    super(props);
    if (this.props.checkoutInfo != null) {
      checkoutInfo = this.props.checkoutInfo;
    }

    this.state = {
      checkoutInfo: checkoutInfo,
      subTotal: '',
      deliveryfee: '',
      grandTotal: ''
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.fetchCart();
    }, 300);
  };

  fetchCart = () => this.props.getCart();

  renderTotalView = () => {
    const { cart } = this.props;

    var deliveryFee = '';
    delivery_fee = this.props.cart.delivery_fee;
    if (delivery_fee != null && Object.keys(delivery_fee).length > 0) {
      const display = delivery_fee.display;
      if (display != null) {
        deliveryFee = display;
      }
      if (delivery_fee.value != null) {
        deliveryFeeVal = delivery_fee.value;
      }
    }

    let subTotal = '';
    if (cart['total_price']) {
      subTotal = `$${parseFloat(cart['total_price']).toFixed(2)}`;
    }


    var conciergeFee = cart.concierge_fee.display;
    var grandTotal = cart.total;
    const promoCode = cart['promocode'];

    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={{ height: 0.3, backgroundColor: '#707070', marginBottom: 20 }} />
        <View style={{ marginHorizontal: 20 }}>
          <TotalView title={'Sub Total'} amount={subTotal} />
          <TotalView title={'Delivery Fee'} amount={deliveryFee} />
          <TotalView title={'Concierge Fee'} amount={conciergeFee} />

          {
            promoCode && promoCode !== '' && (
              <TotalView title={`Promo code( ${promoCode} ): `} amount={`-$${cart['promo_total']}`} />
            )
          }

          <View style={{ height: 0.3, backgroundColor: '#707070', marginTop: 20, marginBottom: 20 }} />
          <TotalView title={'Total'} amount={'$' + grandTotal} />

          <View style={{ alignItems: 'center', margin: 10 }}>
            <CartButton
              title={this.props.btnTitle}
              action={() => this.props.action()}
              viewStyle={{color: colors.orange}}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return <View>{this.renderTotalView()}</View>;
  }
}

const TotalView = ({ title, amount }) => {
  return (
    <View style={styles.totalViewStyle}>
      {title == 'Total' ? (
        <DEIBoldText title={title} style={{ fontSize: 20, color: colors.orange }} />
      ) : (
        <DEIRegularText title={title} style={{ fontSize: 16 }} />
      )}
      {title == 'Total' ? (
        <DEIBoldText title={amount} style={{ fontSize: 20, color: colors.orange }} />
      ) : (
        <DEIRegularText title={amount} style={{ fontSize: 16 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  totalViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
});

const mapDispatchToProps = (dispatch) => ({
  getCart: () => dispatch(CartActions.getCart())
})

const mapStateToProps = ({ cart }) => ({
  ...cart
})

export default connect(mapStateToProps,mapDispatchToProps)(CartTotalView);
