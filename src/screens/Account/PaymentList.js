import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import CustomerRedux from '../../redux/CustomerRedux';
import MyCreditCardList from '../../components/MyCreditCardList';
import { getNavigationOptions } from '../../services/Helpers';
import { ApplicationStyles, Images } from '../../themes';
import { connect } from 'react-redux';

class PaymentList extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    const ref = navigation.getParam('refreshItem');

    return {
      title: 'My Saved Cards',
      headerRight: (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddNewCard', {
              refreshItem: ref,
            })
          }
        >
          <Image
            style={{...ApplicationStyles.navigation.actionImage, tintColor: '#797979'}}
            source={Images.cart.add}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      }
    };
  });

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <MyCreditCardList navigation={this.props.navigation}/>
      </View>
    );
  }
}

const mapStateToProps = ({ customer }) => ({
  fetching: customer.fetching,
  deleting: customer.deleting,
  deletedCardId: customer.deletedCardId,
  cards: customer.cards
});

const mapDispatchToProps = dispatch => ({
  deleteCardRequest: cardId => dispatch(CustomerRedux.deleteCardRequest(cardId)),
  getCards: () => dispatch(CustomerRedux.getCardsRequest())
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentList);
