import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import Modal from "react-native-modal";
import MyAddressList from '../../components/MyAddressList';
import { DEIRegularText } from '../../components';
import { Colors } from '../../themes';

const borderRadius = 20;

class DeliveryAddressList extends Component {
  closeModal = () => {
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
        <View onPress={() => null} style={styles.contentContainerStyle}>
          <DEIRegularText
            title={'Choose your address'}
            style={styles.title}
          />

          <MyAddressList displayActions={false} onAddressPress={this.props.action} />
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

export default DeliveryAddressList;
