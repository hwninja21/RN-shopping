import {
  DEIRegularText
} from './../../components/index';
import { Alert, Image, Platform, StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Images } from '../../themes';
import { Button, Input, Text, ThemeProvider } from 'react-native-elements';
import React, { Component } from 'react';

import AuthActions from '../../redux/AuthRedux'
import { ScrollView } from 'react-native-gesture-handler';
import { SocialButton } from './Register';
import Spinner from 'react-native-loading-spinner-overlay';
import Touchable from 'react-native-platform-touchable';
import { connect } from 'react-redux'
import { loginWithFacebook } from './LoginFB';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const RNELoginTheme = {
  Input: {
    containerStyle: {
      borderRadius: 8,
      borderColor: Colors.darkGrey,
      marginBottom: 20,
      backgroundColor: Colors.white,
    },
    inputContainerStyle: {
      borderBottomWidth: 0
    },
    inputStyle: {
      fontFamily: Fonts.type.base,
      fontSize: Fonts.size.input,
      marginHorizontal: 15,
      color: Colors.black
    },
    placeholderTextColor: Colors.darkGrey,
    underlineColorAndroid: 'transparent'
  },
  Button: {
    buttonStyle: {
      backgroundColor: Colors.accent,
      borderRadius: 10,
      paddingHorizontal: 30,
      paddingVertical: 10,
      marginTop: 20
    },
    titleStyle: { fontFamily: Fonts.type.base, fontSize: 14 }
  },
  CheckBox: {
    checkedColor: Colors.accent,
    containerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      margin: 0,
      marginVertical: 10,
      marginTop: 25
    },
    titleProps: {
      style: {
        fontFamily: Fonts.type.base,
        color: Colors.darkerGrey,
        marginLeft: 8
      }
    }
  }
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.posting && !nextProps.posting && !nextProps.error) {

      if (nextProps.user != null && nextProps.token != null) {
        if (
          nextProps.user.experience_id == null ||
          nextProps.user.experience_id === 0
        ) {
          this.props.navigation.navigate('Explore');
        } else {
          this.props.navigation.navigate('Home');
        }
      }

    }
  }

  forgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  ShowAlert = msg => {
    Alert.alert(
      '',
      msg,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );
  };

  signinAction = () => {
    const { username, password } = this.state;
    if (username.length < 1) {
      this.ShowAlert('Please enter valid Email Id');
      return;
    } else if (password.length < 1) {
      this.ShowAlert('Please enter valid Password');
      return;
    }

    const params = {
      email: username,
      password: password
    };

    this.props.loginRequest(params);
  };

  signupAction = () => {
    this.props.navigation.navigate('Register', {
      isEditProfile: false,
      title_name: 'Create Account'
    });
  };

  loginFBAction = () => {
    loginWithFacebook()
      .then(params => {
        this.props.loginRequest(params);
      })
      .catch(err => {
        debugger;
        console.log(err);
        if (err.reason == 'Cancelled') {
          return;
        }
        alert('Unable to Login - Please try later');
      });
  };
  loginGLAction = () => {

  }
  render() {
    const { posting } = this.props
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <ImageBackground
        source={Images.loginBackground}
        resizeMode={'cover'}
        style={styles.imageBackground}
        >
          <Spinner visible={posting} />
          <ScrollView>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.formContainer}>
              <Text style={styles.title}>Log in to your account</Text>
              <Text></Text>
              <Text style={styles.title}>Email *</Text>
              <Input
                keyboardType={'email-address'}
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
              />
              <Text style={styles.title}>Password *</Text>
              <Input
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                returnKeyType={'done'}
              />
              <Touchable style={styles.forgot} onPress={this.forgotPassword}>
                <Text style={styles.forgotText}>Forgot your Password?</Text>
              </Touchable>

              <Button title="LOGIN" onPress={this.signinAction} />

              <Touchable style={styles.footer} onPress={this.signupAction}>
                <Text style={styles.forgotText}>
                  Don't have an account?{' '}
                  <Text style={{ color: Colors.accent }}>Create</Text>
                </Text>
              </Touchable>
              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <DEIRegularText
                  title={'Or login using social profile'}
                  style={{ color: Colors.white, fontSize: 17 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                  <SocialButton
                    type={'FB'}
                    action={() => this.loginFBAction()}
                  />
                </View>
              </View>
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
  user: auth.user,
  token: auth.token
})

const mapDispatchToProps = (dispatch) => ({
  loginRequest: form => dispatch(AuthActions.loginRequest(form))
})
export default connect(mapStateToProps, mapDispatchToProps)(Login);


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

  title: {
    fontFamily: Fonts.type.base,
    fontSize: 20,
    color: Colors.white
  },
  imageBackground: {
    width: screenWidth,
    height: screenHeight,
    marginBottom: 10,
    // borderRadius: borderRadius,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
    zIndex: 0
  },
  // wrapper: {
  //   ...ApplicationStyles.loginScreen.wrapper,
  //   paddingTop: Platform.select({
  //     ios: 40
  //   })
  // },
  logo: {
    width: logoWidth,
    height: logoWidth,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40
  },
  formContainer: {
    marginTop: 50,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 50,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.primary
  },
  forgot: {
    alignSelf: 'flex-start',
    marginVertical: 10
  },
  forgotText: {
    fontFamily: Fonts.type.bold,
    color: Colors.darkGrey
  },
  footer: {
    alignSelf: 'center',
    marginVertical: 20,
    marginBottom: 0
  }
});
