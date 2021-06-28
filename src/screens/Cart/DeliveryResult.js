import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet
} from 'react-native';

import {
  DEIRegularText,
  AXIOS_CONFIG
} from '../../components';

import { getNavigationOptions } from '../../services/Helpers';
import ImageIcons from '../../themes/Images';
import colors from '../../themes/Colors';
import { CartButton } from '../../components/CartButton';

class DeliveryResult extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => ({
    title: 'Checkout',
    headerBackTitle: 'Back'
  }));

  constructor(props) {
    super(props);
  };

  tryAgainAction = () => {
    this.props.navigation.goBack();
  };

  continueAction = () => {
    this.props.navigation.navigate('Home');
  };

  failed = () => {
    return (
      <View>
        <View style={styles.titleStyle}>
          <DEIRegularText
            title="Oops, there was an error"
            style={{ fontSize: 20, color: colors.purple }}
          />
        </View>
        <View style={styles.imageStyle}>
          <Image
            source={ImageIcons.cart.failedImage}
            style={{ width: 300, height: 300, resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.messageStyle}>
          <DEIRegularText
            title={this.props.navigation.getParam('errorMessage') || 'Unfortunately the payment was rejected'}
            style={{ fontSize: 20, color: '#707070', textAlign: 'center' }}
          />
        </View>
        <View style={styles.buttonStyle}>
          <CartButton
            title="Try Again"
            action={this.tryAgainAction}
            viewStyle={{ width: '80%', marginTop: 30 }}
          />
        </View>
      </View>
    );
  };

  success = () => {
    return (
      <View>
        <View style={styles.titleStyle}>
          <DEIRegularText
            title="Payment Success"
            style={{ fontSize: 20, color: colors.purple }}
          />
        </View>
        <View style={styles.imageStyle}>
          <Image
            source={ImageIcons.cart.successImage}
            style={{ width: 300, height: 300, resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.messageStyle}>
          <DEIRegularText
            title="Congratulation Payment was Success"
            style={{ fontSize: 20, color: '#707070' }}
          />
        </View>
        <View style={styles.buttonStyle}>
          <CartButton
            title="Done"
            action={this.continueAction}
            viewStyle={{ width: '80%', marginTop: 30 }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        {this.props.navigation.state.params.status === 'success' ? (
          this.success()
        ) : (
          this.failed()
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 20
  },
  titleStyle: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageStyle: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DeliveryResult;
