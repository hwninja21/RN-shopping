import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  DEIRegularText,
  ShowAlert
} from '../../components';
import ImageIcons from '../../themes/Images';
import colors from '../../themes/Colors';
import CartTotalView from './CartTotalView';
import DeliveryCardList from './DeliveryCardList';
import CartActions from '../../redux/CartRedux';
import CustomerRedux from '../../redux/CustomerRedux';
import { connect } from 'react-redux';
import { Platform } from 'react-native';

class CartPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCard: false,
      isLoading: false,
      activeRowKey: null,
      selectedCard: this.props.cards && this.props.cards[0],
      CardListModalVisible: false,
      promoCode: this.props.cart && this.props.cart.promocode
    };
  }

  componentDidMount() {
    this.props.getCards();
  }

  componentDidUpdate() {
    this.setSelectedCard();
  }

  setSelectedCard = () => {
    if (this.props.cards && !this.state.selectedCard) {
      this.setState({ selectedCard: this.props.cards[0] });
    }
  };

  applyPromoCode = () => {
    if (!this.state.promoCode || this.state.promoCode === '') {
      alert('Please enter the promo code');
    } else {
      this.props.applyPromoCode({
        'cart_id': this.props.cart.id,
        'promocode': this.state.promoCode
      });
    }
  };

  promoCodeArea = () => {
    const paddingHorizontal = 20;
    return (
      <View style={{paddingHorizontal}}>
        <View style={styles.promoTitleStyle}>
          <Image
            source={ImageIcons.cart.savedCard}
            style={{ width: 25, height: 25, marginRight: 20, resizeMode: 'contain' }}
          />
          <DEIRegularText
            title="PROMO CODE"
            style={{ fontSize: 20, color: colors.purple }}
          />
        </View>
        <View style={styles.propmoCodeTextInputStyle}>
          <TextInput
            value={this.state.promoCode || ''}
            onChangeText={promoCode => this.setState({ promoCode })}
            placeholder="Enter promo code here"
          />
        </View>
        <View style={{marginBottom: 20}}>
          <TouchableOpacity
            onPress={this.applyPromoCode}
          >
            <View style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  proceedToPaymentClicked = () => {
    const { cards, selectedCard } = this.state;
    if (selectedCard) {
      this.props.action(selectedCard);
    } else {
      ShowAlert('Please add a card to proceed payment');
    }
    //this.props.action()
  };

  renderFooter = () => {
    return (
      <CartTotalView
        action={this.proceedToPaymentClicked}
        btnTitle={'Proceed to pay'}
      />
    );
  };

  toggleCardList = () => {
    this.setState({
      CardListModalVisible: !this.state.CardListModalVisible
    });
  };

  closeCardListModal = () => {
    this.setState({ CardListModalVisible: false })
  };

  saveCardListClicked = selectedCard => {
    this.setState({
      selectedCard,
      CardListModalVisible: false
    });
  };

  render() {
    const { CardListModalVisible } = this.state;
    const { action } = this.props;

    return (
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
        <Spinner visible={this.state.isLoading || this.props.isApplyingPromoCode} />
        <ScrollView>
          <CardArea
            selectedCard={this.state.selectedCard}
            action={this.toggleCardList}
          />

          <View style={{ height: 0.3, backgroundColor: '#707070', marginBottom: 20, marginTop: 20 }} />

          {this.promoCodeArea(action)}

          {this.renderFooter()}

          <DeliveryCardList
            action={this.saveCardListClicked}
            closeModal={this.closeCardListModal}
            navigation={this.props.navigation}
            isVisible={CardListModalVisible}
          />
        </ScrollView>
      </View>
    );
  }
}

const getcardImage = name => {
  if (name == 'Visa') {
    return require('../../assets/Stores/ic_visa.png');
  } else if (name == 'MasterCard') {
    return require('../../assets/Cart/ic_mastercard.png');
  } else if (name == 'American Express') {
    return require('../../assets/Cart/ic_amex.png');
  } else if (name == 'Discover') {
    return require('../../assets/Cart/ic_discover.png');
  } else if (name == 'Diners Club') {
    return require('../../assets/Cart/ic_diners.png');
  } else if (name == 'JCB') {
    return require('../../assets/Cart/ic_jcb.png');
  } else if (name == 'UnionPay') {
    return require('../../assets/Cart/ic_mastercard.png');
  }
  return require('../../assets/Cart/ic_nocard.png');
};

const CardArea = ({ action, selectedCard }) => {
  const paddingHorizontal = 20;
  const fontSizeNormal = 16;
  const fontSizeSmall = fontSizeNormal - 2;

  return (
    <View style={{paddingHorizontal}}>
      <View style={styles.cardTitleStyle}>
        <Image
          source={ImageIcons.cart.savedCard}
          style={{ width: 25, height: 25, marginRight: 20, resizeMode: 'contain' }}
        />
        <DEIRegularText
          title="SAVED CARDS"
          style={{ fontSize: 20, color: colors.purple }}
        />
      </View>
      {
        selectedCard && (
          <View style={styles.cardviewStyle}>
            <View>
              <Image
                source={getcardImage(selectedCard.brand)}
                style={{
                  width: 52,
                  height: 34,
                  resizeMode: 'contain'
                }}
              />
            </View>
            <View style={{justifyContent: 'flex-start'}}>
              <DEIRegularText
                title={selectedCard.description}
                style={{ color: 'black', fontSize: fontSizeNormal }}
              />
              <DEIRegularText
                title={`**** **** **** ${selectedCard.last4}`}
                style={{ color: 'black', fontSize: fontSizeSmall, marginTop: 5}}
              />
              <DEIRegularText
                title={`${selectedCard['exp_month']} / ${selectedCard['exp_year']}`}
                style={{ color: 'black', fontSize: fontSizeSmall, marginTop: 5}}
              />
            </View>
          </View>
        )
      }
      <View>
        <TouchableOpacity
          onPress={action}
        >
          <View style={styles.changeAddressButton}>
            <Text style={styles.changeAddressButtonText}>Change Card</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  savedCardTextStyle: {
    color: '#000',
    marginLeft: 20,
    fontSize: 11
  },
  cardTitleStyle: {
    flexDirection: 'row',
    marginBottom: 20
  },
  promoTitleStyle: {
    flexDirection: 'row',
    marginBottom: 20
  },
  propmoCodeTextInputStyle: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#707070',
    borderRadius: 20,
    paddingHorizontal: 10,
    // Add  padding on iOS because for some reason there's no padding on iOS
    paddingVertical: Platform.OS === 'ios' ? 5 : 0
  },
  changeAddressButton: {
    marginTop: 20,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 20,
  },
  changeAddressButtonText: {
    fontSize: 16,
    color: colors.orange
  },
  applyButton: {
    marginTop: 20,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.orange,
    borderRadius: 20,
  },
  applyButtonText: {
    fontSize: 16,
    color: colors.white
  },
  cardviewStyle: {
    height: 78,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  }
});

const mapStateToProps = state => ({
  isApplyingPromoCode: state.cart.isApplyingPromoCode,
  cart: state.cart.cart,
  cards: state.customer.cards
});

const mapDispatchToProps = dispatch => ({
  applyPromoCode: form => dispatch(CartActions.applyPromoCodeRequest(form)),
  getCards: () => dispatch(CustomerRedux.getCardsRequest())
});

export default connect(mapStateToProps, mapDispatchToProps)(CartPayment);
