import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert
} from 'react-native';

import Modal from 'react-native-modal';
import Swipeout from 'react-native-swipeout';
import MyCreditCardList from '../../components/MyCreditCardList';
import { DEIRegularText } from '../../components';
import { SelectedCardView } from './CardItemView';
import { Colors } from '../../themes';

const borderRadius = 20;

class DeliveryCardList extends Component {
  constructor(props) {
    super(props);
    var cardList = [];
    if (Array.isArray(this.props.cards)) {
      cardList = this.props.cards;
    }
    this.state = {
      cards: cardList,
      isLoading: false
    };
  }

  closeModal = () => {
    this.setState({ visible: false });
    this.props.closeModal();
  };

  render() {
    return (
      <Modal
        hasBackDrop={false}
        animationType="none"
        transparent={true}
        isVisible={this.props.isVisible}
        onDismiss={this.closeModal}
        onBackButtonPress={this.closeModal}
        onBackdropPress={this.closeModal}
        style={styles.modalContainerStyle}
      >
        <View style={styles.contentContainerStyle}>
          <DEIRegularText
            title={'Choose your card'}
            style={styles.title}
          />

          <MyCreditCardList
            navigation={this.props.navigation}
            displayRemoveButton={false}
            onCardPress={this.props.action}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainerStyle: {
    flex: 1,
    paddingTop: '10%',
    paddingBottom: '20%',
    paddingHorizontal: '5%',
    margin: 0,
    backgroundColor: 'rgba(121, 74, 120, 0.9)',
  },
  contentContainerStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius,
    paddingBottom: borderRadius
  },
  title: {
    textAlign: 'center',
    color: Colors.purple,
    paddingVertical: 20,
    fontWeight: 'bold',
    backgroundColor: Colors.grey,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  }
});

export default DeliveryCardList;
