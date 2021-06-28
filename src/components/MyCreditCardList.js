import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import CustomerRedux from '../redux/CustomerRedux';
import colors from '../themes/Colors';
import MyCreditCard from '../components/MyCreditCard';
import { MyAccountSeparator } from '../screens/Account/MyAccountComponents';
import { DEIRegularText } from '../components';
import { isNetworkConnected } from '../components/index';
import { connect } from 'react-redux';

class MyCreditCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: this.convertCards(this.props.cards),
      selectedIndex: -1,
      isLoading: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ refreshItem: this._refreshItem });
    this.getSavedCards();
  }

  convertCards = cards => {
    const cardList = [];
    cards.forEach(card => { cardList.push({...card, cardInfo: card})});

    cardList.reverse();

    return cardList;
  };

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.fetching && !this.props.fetching && this.props.cards) {
      this.setState({
        cardList: this.convertCards(this.props.cards),
        selectedIndex: 0
      });
    }

    if (prevProps.deleting && !this.props.deleting && this.props.deletedCardId) {
      this.setState({
        cardList: this.convertCards(this.props.cards.filter(({ id }) => id !== this.props.deletedCardId ))
      });
    }
  }

  getSavedCards = () => {
    this.props.getCards();
  };

  _refreshItem = () => {
    this.getSavedCards();
  };

  deleteCard = cardId => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.props.deleteCardRequest(cardId);
      }
    });
  };

  addCardAction = () => {
    this.props.navigation.navigate('AddNewCard', {
      refreshItem: item => this.props.navigation.getParam('refreshItem')(item)
    });
  };

  renderCard = ({ item: card }) => (
    <MyCreditCard
      card={card}
      onCardDelete={this.deleteCard}
      displayRemoveButton={this.props.displayRemoveButton}
      onPress={this.props.onCardPress}
    />
  );

  addNewCardOnPress = () => {
    this.props.navigation.navigate('AddNewCard', {
      refreshItem: item => _this._refreshItem(item)
    })
  };

  render() {
    const ListEmptyComponent = () => (
      <View style={{ flex: 1, marginTop: 20}}>
        {/* TODO: add the image from the designs here */}

        <DEIRegularText
          title="You don't have a saved card!"
          style={{ fontSize: 18, color: '#8a8a8a', textAlign: 'center' }}
        />

        <TouchableOpacity style={{ flex: 1, marginTop: 30, alignItems: 'center' }} onPress={this.addNewCardOnPress}>
          <DEIRegularText
            title="Add New Card"
            style={{ fontSize: 18, color: colors.orange }}
          />
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <Spinner visible={this.state.isLoading || this.props.fetching || this.props.deleting} />
        <FlatList
          data={this.state.cardList}
          renderItem={this.renderCard}
          ItemSeparatorComponent={MyAccountSeparator}
          ListEmptyComponent={!this.props.fetching && ListEmptyComponent}
        />
      </View>
    );
  }
}

MyCreditCardList.defaultProps = {
  displayRemoveButton: true
};

MyCreditCardList.propTypes = {
  navigation: PropTypes.object.isRequired,
  displayRemoveButton: MyCreditCard.propTypes.displayRemoveButton,
  onCardPress: MyCreditCard.propTypes.onPress
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MyCreditCardList);
