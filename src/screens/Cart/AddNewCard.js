import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { DEIMediumText } from '../../components';
import { CreditCardInput } from 'react-native-credit-card-input';
import { CartButton } from './../../components/CartButton';
import { isNetworkConnected, AXIOS_CONFIG } from './../../components/index';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';
import Omise from 'omise-react-native';
import Config from 'react-native-config';
import CustomerRedux from '../../redux/CustomerRedux';
import { getNavigationOptions } from '../../services/Helpers';

// const apiKey = 'pk_live_s2M66GtYE9vvOoFdxJvCHnRH00G8VuSW88'; //'pk_test_jK9FADjhQj5Qm4eKzTDlFbwE00VgXdrfcj'; //'pk_test_inGvk34bnNRnIdcVroel7Fbq';
// const client = new Stripe(apiKey);

class AddNewCard extends Component {
  static navigationOptions = getNavigationOptions({
    title: 'ADD NEW CARD'
  });

  constructor(props) {
    super(props);

    Omise.config(Config.OMISE_KEY);

    this.state = {
      cardData: {},
      isLoading: false,
      name: ''
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && !this.props.error) {
      this.props.navigation.goBack();
      this.props.navigation.state.params.refreshItem();
    }
  }

  _onChange = formData => {
    console.log(JSON.stringify(formData, null, ' '));
    this.setState({ cardData: formData });
  };
  _onFocus = field => console.log('focusing', field);

  async OmiseAddCard(formData) {
    console.log(formData);
    var values = formData.values;
    this.setState({ isLoading: true, name: values.name });
    var expiry = values.expiry;
    var array = expiry.split('/');

    const result = await Omise.createToken({
      card: {
        name: values.name,
        number: values.number,
        expiration_month: array[0],
        expiration_year: array[1],
        security_code: values.cvc
      }
    });
    console.log('omise token', result);

    if (result.card != null) {
      //var resDict = result;
      ///  resDict.card.exp_year = Number(array[1]);
      this.saveCardAPI(result);

      this.setState({ isLoading: false });
    } else {
      var message = 'Unable to add Card - please try again later';
      const error = result.error;
      if (error != null) {
        message = error.message;
      }

      this.setState({ isLoading: false });

      setTimeout(() => {
        alert(message);
      }, 300);
    }
  }

  saveClicked = async () => {
    var formData = this.state.cardData;

    console.info('form data', formData);

    if (Object.keys(formData).length === 0) {
      alert('enter card details');
    } else {
      if (formData.valid) {
        try {
          await this.OmiseAddCard(formData);
        } catch (e) {
          console.info('omise addd errr', e);
        }
      } else {
        alert('Card not valid. Please check the details and try again');
      }
    }
  };

  saveCardAPI = res => {
    isNetworkConnected().then(isConnected => {
      const card = res.card;
      if (isConnected) {
        this.props.addCard({
          card_token: card.id,
          brand: card.brand,
          country: card.country !== '' ? card.country : 'sg',
          description: this.state.name,
          exp_month: card.expiration_month,
          exp_year: card.expiration_year,
          last4: card.last_digits,
          customer_token: res.id
        });
      }
    });
  };
  render() {
    return (
      <View style={{ marginTop: 15 }}>
        <Spinner visible={this.state.isLoading || this.state.posting} />
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          onFocus={this._onFocus}
          onChange={this._onChange}
          cardImageFront={require('../../assets/Cart/ic_cardFront.png')}
          cardImageBack={require('../../assets/Cart/ic_cardBack.png')}
        />
        <View style={{ alignItems: 'center', margin: 20 }}>
          <CartButton title={'Save'} action={this.saveClicked} />
        </View>
      </View>
    );
  }
}

const CardInputView = ({ desc, title }) => {
  return (
    <View>
      <DEIMediumText title={title} style={{ color: '#fff', fontSize: 12 }} />
      <View>
        <TextInput
          placeholder={desc}
          placeholderTextColor={'#fff'}
          style={{ color: '#fff', fontSize: 16, marginTop: 5 }}
        />
        <View
          style={{
            height: 2,
            backgroundColor: '#fff',
            marginTop: 5
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = ({ customer }) => ({
  posting: customer.posting,
  error: customer.error
});

const mapDispatchToProps = dispatch => ({
  addCard: data => dispatch(CustomerRedux.addCardRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewCard);
