import React, { Component } from 'react';
import { ApplicationStyles, Colors, Fonts } from '../themes';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CartActions from '../redux/CartRedux'
import { DEIRegularText } from './APIConstants';
import { STQuantityView } from '../components/STQuantityView';
import { connect } from 'react-redux'

class STCartGridItem extends Component {
  getCartProduct = () => {
    return this.props.cart && this.props.cart.products && this.props.item && this.props.cart.products.find(
      product => product.id === this.props.item.id
    );
  };

  getCartProductOrProduct = () => {
    return this.getCartProduct() || this.props.item;
  };

  quantityChanged = (product) => {
    const cartProduct = this.getCartProduct();

    if (cartProduct) {
      this.editCart(product)
    } else {
      if (product.quantity === 0) {
        // delete
        this.deleteProductItem(product)
      } else {
        // add new product
        this.addProductToCart(product)
      }
    }
  };

  deleteProductItem = product => {
    this.props.removeProductFromCart({
      cart_id: this.props.cart.id,
      cart_product_id: product.cart_product_id
    })
  };

  addProductToCart = (form) => {
    const {cart} = this.props
    this.props.addProductToCart({
      cart_id: cart.id,
      product_id: form.id,
      amount: form.quantity,
      product_options: ''//form.product_options
    })
  }

  editCart = (form) => {
    const {cart} = this.props
    this.props.editCart({
      cart_id: cart.id,
      cart_product_id: form.cart_product_id,
      product_id: form.id,
      amount: form.quantity,
      product_options: ''//form.product_options
    })
  }

  detailAction = () => {
    this.props.action(this.getCartProductOrProduct());
  };

  render() {
    const item = this.props.item;
    const { product, price, grams, name, image_square_url, image_url } = item;

    const oldPrice =
      item['list_price'] &&
      item['list_price'] !== '0.00' &&
      `S$${parseFloat(item['list_price']).toFixed(2)}`;
    const priceValue = 'S$' + parseFloat(price).toFixed(2);

    const imageSource = image_square_url ? { uri: image_square_url } : require('../assets/Home/ic_placeholderproduct_box.png');

    return (
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'center',
          borderRadius: 20,
          height: 270,
          ...ApplicationStyles.shadow.normal
        }}
      >
        <View style={{ margin: 10 }}>
          <TouchableOpacity onPress={this.detailAction}>
            <Image
              source={imageSource}
              style={{ width: '90%', height: 80, resizeMode: 'contain' }}
            />
            <Text
              style={{
                color: Colors.black,
                fontSize: 12,
                marginTop: 5,
                textAlign: 'center',
                fontFamily: Fonts.type.medium,
                height: 50
              }}
              numberOfLines={3}
            >
              {name}
            </Text>
            <DEIRegularText
              title={item['merchant_name']}
              numberOfLines={1}
              style={{
                color: Colors.darkerGrey,
                textAlign: 'center',
                fontFamily: Fonts.type.base,
                fontSize: 10,
                minHeight: 30,
                marginTop: 10
              }}
            />
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <DEIRegularText
                title={oldPrice && oldPrice !== priceValue ? oldPrice : ''}
                style={styles.oldPriceStyle}
              />
              <DEIRegularText title={priceValue} style={styles.currentPriceStyle} />
            </View>
          </TouchableOpacity>
          <STQuantityView
            item={this.getCartProductOrProduct()}
            quantityChanged={this.quantityChanged}
            isDetail={false}
            action={this.detailAction}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 11
  },
  gramsStyle: {
    fontSize: 10,
    color: '#424242',
    marginTop: 4,
    textAlign: 'left'
  },
  currentPriceStyle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.type.base
  },
  get oldPriceStyle() {
    return {
      ...this.currentPriceStyle,
      textDecorationLine: 'line-through',
      marginBottom: 0,
      color: Colors.darkerGrey,
      fontWeight: 'bold',
      marginRight: 2
    }
  }
});

const mapDispatchToProps = (dispatch) => ({
  getCart: () => dispatch(CartActions.getCart()),
  addProductToCart: (form) => dispatch(CartActions.addProductToCart(form)),
  editCart: (form) => dispatch(CartActions.editCart(form)),
  removeProductFromCart: (form) => dispatch(CartActions.removeProductFromCart(form)),
})

const mapStateToProps = ({ cart }) => ({
  ...cart
})

STCartGridItem = connect(mapStateToProps, mapDispatchToProps)(STCartGridItem)


export { STCartGridItem };
