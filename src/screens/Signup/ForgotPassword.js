import React, { Component } from 'react';
import { Dimensions, View, Platform, StyleSheet, ScrollView, Image,ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { ThemeProvider, Input, Button, Text } from 'react-native-elements';

import { RNELoginTheme } from './Login';
import { ShowAlert, isNetworkConnected } from '../../components';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';
import { connect } from 'react-redux';
import AuthActions from '../../redux/AuthRedux';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export class ForgotPassword extends Component {
  static navigationOptions = {
    title: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoading: false
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && !this.props.error) {
      this.props.navigation.navigate('VerifyForgotPassword', {
        email: this.state.email,
        code: this.props.forgotPasswordCode || ''
      });
    }
  }

  submitClicked = () => {
    if (this.state.email.length < 1) {
      ShowAlert('Please enter your email');
      return;
    }

    this.setState({ isLoading: true });

    isNetworkConnected().then(status => {
      this.setState({ isLoading: false });

      if (status === true) {
        this.props.forgotPasswordRequest({ email: this.state.email });
      } else {
        NoInternetAlert();
      }
    });
  };

  verifyCodeClicked = () => {
    this.props.navigation.navigate('VerifyForgotPassword', {
      email: this.state.email,
      code: ''
    });
  };

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <ImageBackground 
        source={Images.loginBackground}
        resizeMode={'cover'}
        style={styles.imageBackground}
        >
          <Spinner visible={this.state.isLoading || this.props.posting} />
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Forgot Your Password?</Text>
              <Text style={styles.subtitle}>
                Enter the email address associated with your account
              </Text>
              <Text style={styles.message}>
                We will email you a link to reset your password
              </Text>
              <Text></Text>
              <Text style={styles.subtitle}>Email *</Text>
              <Input
                keyboardType={'email-address'}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                returnKeyType="done"
              />

              <Button title="SEND EMAIL" onPress={this.submitClicked} />
            </View>
          </ScrollView>
        </ImageBackground>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error,
  forgotPasswordCode: auth.forgotPasswordCode
});

const mapDispatchToProps = (dispatch) => ({
  forgotPasswordRequest: form => dispatch(AuthActions.forgotPasswordRequest(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const logoWidth = 150;
const styles = StyleSheet.create({
  bannerTitle: {
    alignSelf: 'center',
    fontFamily: Fonts.type.base,
    fontSize: 20,
    color: Colors.black
  },
  subBannerTitle: {
    fontFamily: Fonts.type.bold,
    fontSize: 20,
    color: Colors.black
  },
  imageBackground: {
    width: screenWidth,
    height: screenHeight,
    marginBottom: 10,
    zIndex: 0,
    alignItems: 'center'
  },
  wrapper: {
    ...ApplicationStyles.screen.wrapper
  },
  logo: {
    width: logoWidth,
    height: logoWidth,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  formContainer: {
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 15,
    marginRight: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h4,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular,
    color: Colors.white,
    marginBottom: 10
  },
  message: {
    fontFamily: Fonts.type.base,
    color: Colors.white,
    marginBottom: 10
  }
});
