import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';
import { EmptyView } from './EmptyView';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, Metrics, Fonts, Images, ApplicationStyles } from '../themes';
import { DEIBoldText, DEIRegularText, DEIMediumText } from './APIConstants';
import { Divider, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import CartActions from '../redux/CartRedux';
import DeiSelect from './DeiSelect';

const modifierTypes = {
  absolute: 'Absolute',
  percentage: 'Percentage'
};

const getVariantAddedPrice = (productPrice, variant) => {
  const modifierAmount = parseFloat(variant['modifier_amount']);
  const modifierType = variant['modifier_type'];

  if (modifierAmount > 0) {
    if (modifierType === modifierTypes.absolute) {
      return modifierAmount;
    } else if (modifierType === modifierType.percentage) {
      return productPrice * (modifierAmount / 100);
    }
  }

  return 0;
};

class StoreProduct extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedOptions: {} };
  }

  componentDidMount(): void {
    this.setSelectedOptions();
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (this.props.product) {
      if (!prevProps.product || (this.props.product.id !== prevProps.product.id)) {
        this.setSelectedOptions();
      }
    }
  }

  openImagePreview = url => {
    this.props.navigation.navigate('ProductPreview', {
      url
    });
  };

  getProductOptionsParam = () => {
    const productOptions = {};

    Object.keys(this.state.selectedOptions).forEach(optionId => {
      productOptions[optionId] = this.state.selectedOptions[optionId].id
    });

    return JSON.stringify(productOptions);
  };

  addProductToCart = () => {
    this.props.addProductToCart({
      'cart_id': this.props.cart.id,
      'product_id': this.props.product.id,
      'amount': 1,
      'product_options': this.getProductOptionsParam()
    });
  };

  getVariantAddedPrice = variant => getVariantAddedPrice(parseFloat(this.props.product.price), variant);

  getVariantLabel = variant => {
    let label = variant.name;
    const addedPrice = this.getVariantAddedPrice(variant);

    if (addedPrice > 0) {
      label += ` (+${addedPrice.toFixed(2)})`;
    }

    return label;
  };

  selectOptionVariant = (option, variantId) => {
    this.setState({
      selectedOptions: {
        ...this.state.selectedOptions,
        [option.id]: option.variants.find(({ id }) => id === variantId)
      }
    });
  };

  setSelectedOptions = () => {
    const options = this.props.product['product_options'];

    if (options) {
      const selectedOptions = {};

      options.forEach(option => { selectedOptions[option.id] = option.variants[0] });

      this.setState({ selectedOptions });
    }
  };

  getCartProduct = () => {
    return this.props.cart &&
    this.props.cart.products &&
    this.props.cart.products.find(({ id }) => id === this.props.product.id)
  };

  getFinalPrice = () => {
    const initialPrice = parseFloat(this.props.product.price);
    let price = initialPrice;

    Object.values(this.state.selectedOptions).forEach(variant => {
      price += getVariantAddedPrice(initialPrice, variant);
    });

    return price;
  };

  render() {
    const { product } = this.props;
    if (!product) return <EmptyView type={6} action={() => {}}/>;

    const {
      full_description,
      image_url,
      image_square_url,
      name,
      stock,
      code,
      merchant_name
    } = product;
    const regex = /(<([^>]+)>)/gi;
    var fullDescText = 'Available in 1Kg';
    if (full_description != null && full_description !== '') {
      fullDescText = full_description;
    }
    const fullDesc = `${fullDescText}`.replace(regex, '');

    const price = product['price'];
    const oldPrice = product['list_price'];

    const displayOldPrice = oldPrice !== '0.00' && oldPrice !== price;

    const productOptions = product['product_options'] || [];

    const imageUrl = image_url ? image_url : image_square_url;

    return (
      <View style={styles.wrapper}>
        <View style={{flex: 1}}>
          <ScrollView>
            <Touchable
              style={{backgroundColor: Colors.grey}}
              onPress={() => this.openImagePreview(imageUrl)}
            >
              <Image source={{uri: imageUrl}} style={styles.image}/>
            </Touchable>
            <View style={styles.nameContainer}>
              <DEIBoldText title={name} style={styles.name}/>
              <DEIRegularText title={fullDesc} style={styles.description}/>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <DEIMediumText
                  title={`S$${parseFloat(this.getFinalPrice()).toFixed(2)}`}
                  style={styles.price}
                />
                {
                  displayOldPrice && (
                    <DEIMediumText
                      title={`S$${parseFloat(oldPrice).toFixed(2)}`}
                      style={styles.oldPrice}
                    />
                  )
                }
              </View>
              <DEIRegularText title={merchant_name} style={styles.belowPrice}/>
              <DEIRegularText title={'Code: ' + code} style={styles.code}/>
              <Text style={styles.availability}>
                Availability:{' '}
                {
                  stock ? (
                    <Text style={styles.inStock}>IN STOCK</Text>
                  ) : (
                    <Text style={styles.outOfStock}>OUT OF STOCK</Text>
                  )
                }
              </Text>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.productDescContainer}>
              {
                productOptions.map(option => (
                  <DeiSelect
                    key={`product-option-${option.id}`}
                    label={option.option}
                    onSelectedOption={variant => this.selectOptionVariant(option, variant)}
                    options={
                      option.variants.map(variant => ({label: this.getVariantLabel(variant), value: variant.id}))
                    }
                  />
                ))
              }
              <View style={styles.variantSectionContainer}>
                <DEIRegularText title={'Quantity:'} style={styles.variantSectionTitle}/>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                  <Touchable style={{
                    height: 30,
                    borderWidth: 1,
                    borderColor: Colors.darkGrey,
                    alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    paddingHorizontal: 4
                  }}>
                    <Icon type='feather' name="minus" color={Colors.darkerGrey}/>
                  </Touchable>
                  <View style={{
                    height: 30,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    borderColor: Colors.darkGrey
                  }}><DEIRegularText title="1"/></View>
                  <Touchable style={{
                    height: 30,
                    borderWidth: 1,
                    borderColor: Colors.darkGrey,
                    alignItems: 'center',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    paddingHorizontal: 4
                  }}>
                    <Icon type='feather' name="plus" color={Colors.accent}/>
                  </Touchable>
                  <DEIRegularText title={`${stock || 0} pieces available`}
                                  style={{color: Colors.darkGrey, marginLeft: 10}}/>
                </View>
              </View>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.productDescContainer}>
              <DEIBoldText
                title={'Product Description'}
                style={{color: Colors.primary, fontSize: 20, marginBottom: 10}}
              />
              <DEIBoldText title={product['short_description']} style={{marginBottom: 10, lineHeight: 20}}/>
            </View>
            <Divider style={styles.divider}/>
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <Touchable style={styles.button} onPress={this.addProductToCart}>
            <React.Fragment>
              <Image source={Images.cart.icon} style={ApplicationStyles.navigation.actionImage}/>
              <Text style={styles.buttonTitle}>Add to Cart</Text>
            </React.Fragment>
          </Touchable>
        </View>
      </View>
    );
  }
}

StoreProduct.propTypes = {
  product: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired
};

const mapStateToProps = ({cart}) => ({
  ...cart
});

const mapDispatchToProps = (dispatch) => ({
  addProductToCart: (form) => dispatch(CartActions.addProductToCart(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(StoreProduct);

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: Colors.white},
  image: {width: Metrics.screenWidth, height: 200, resizeMode: 'contain'},
  footer: {
    height: 100,
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  nameContainer: {
    marginHorizontal: 20,
    marginTop: 30
  },
  name: {fontSize: 20, color: Colors.primary},
  description: {color: Colors.darkerGrey, marginTop: 5},
  price: {fontSize: 25, color: Colors.accent, marginTop: 10, fontWeight: 'bold'},
  get oldPrice() {
    return {...this.price, textDecorationLine: 'line-through', color: Colors.darkGrey, marginLeft: 10}
  },
  belowPrice: {color: Colors.green, fontFamily: Fonts.type.bold, marginTop: 10},
  code: {marginTop: 10, color: Colors.darkerGrey},
  availability: {fontFamily: Fonts.type.base, marginTop: 10, color: Colors.darkerGrey},
  inStock: {color: Colors.green, fontWeight: 'bold'},
  outOfStock: {color: Colors.red, fontWeight: 'bold'},
  divider: {marginVertical: 10},
  productDescContainer: {marginHorizontal: 20},
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  buttonTitle: {fontFamily: Fonts.type.bold, color: Colors.white, fontSize: 20},
  returnContainer: {
    padding: 15, backgroundColor: Colors.white, borderRadius: 15, borderWidth: 1, borderColor: Colors.darkGrey
  },
  variantSectionContainer: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
  variantSectionTitle: {width: 100},
  optionContainer: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionArrow: {}
});
