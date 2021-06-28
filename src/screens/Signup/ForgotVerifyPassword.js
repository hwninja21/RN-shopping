import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { ThemeProvider, Input, Button, Text } from 'react-native-elements';
import {
  isNetworkConnected,
} from '../../components';

import { NoInternetAlert } from '../../components/API';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNELoginTheme } from './Login';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';
import AuthActions from '../../redux/AuthRedux';
import { connect } from 'react-redux';

export class ForgotVerifyPassword extends Component {
  static navigationOptions = {
    title: ''
  };

  constructor(props) {
    super(props);
    var email = this.props.navigation.getParam('email', '');
    var code = this.props.navigation.getParam('code', '');
    this.state = {
      email: email,
      verificationcode: code,
      password: '',
      isLoading: false
    };
  }

  successAlert(msg) {
    setTimeout(() => {
      Alert.alert(
        'Forgot Password',
        msg,
        [{ text: 'OK', onPress: () => this.props.navigation.navigate('Login') }],
        { cancelable: false }
      );
    })
  }

  submitClicked = () => {
    const { email, verificationcode, password } = this.state;

    if (email.length < 1) {
      alert('Please enter email');
      return;
    } else if (verificationcode.length < 1) {
      alert('Please enter verification code');
      return;
    } else if (password.length < 1) {
      alert('Please enter password');
      return;
    }

    this.setState({ isLoading: true });

    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.props.forgotVerifyPasswordRequest({
          email: email,
          code: verificationcode,
          password: password
        })
      } else {
        NoInternetAlert();
      }

      this.setState({ isLoading: false });
    });
  };

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && !this.props.error) {
      this.successAlert(this.props.forgotVerifyPasswordMessage || 'Your password was reset successfully')
    }
  }

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <Spinner visible={this.state.isLoading || this.props.posting} />
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              Enter verification code received on {this.state.email} and reset
              your password
            </Text>
            <Input
              placeholder="VERIFICATION CODE"
              keyboardType={'email-address'}
              onChangeText={verificationcode =>
                this.setState({ verificationcode })
              }
              value={this.state.verificationcode}
            />
            <Input
              placeholder="PASSWORD"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              returnKeyType={'done'}
            />

            <Button title="RESET PASSWORD" onPress={this.submitClicked} />
          </View>
        </ScrollView>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error,
  forgotVerifyPasswordMessage: auth.forgotVerifyPasswordMessage
});

const mapDispatchToProps = (dispatch) => ({
  forgotVerifyPasswordRequest: form => dispatch(AuthActions.forgotVerifyPasswordRequest(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotVerifyPassword)

const logoWidth = 200;
const styles = StyleSheet.create({
  wrapper: {
    ...ApplicationStyles.screen.wrapper
  },
  logo: {
    width: logoWidth,
    height: logoWidth,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 15
  },
  formContainer: {
    margin: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h4,
    textAlign: 'center'
  },
  subtitle: {
    color: Colors.white,
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.regular,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  message: {
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    color: Colors.darkGrey
  }
});
