import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
  // Picker,
  // DatePickerIOS,
  // DatePickerAndroid
} from 'react-native';
import {
  SgProfilePic,
  DEIRegularText,
  isNetworkConnected,
} from './../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ThemeProvider,
  Input,
  Button,
  CheckBox
} from 'react-native-elements';
import { RNELoginTheme } from './Login';
import { ApplicationStyles, Colors, Images, Fonts } from '../../themes';

import Spinner from 'react-native-loading-spinner-overlay';

import API from '../../components/API';
import { loginWithFacebook } from './LoginFB';
import { connect } from 'react-redux';
import AuthActions from '../../redux/AuthRedux';
// import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class Register extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title_name')
    };
  };

  constructor(props) {
    super(props);
    let isEditProfile = false;
    if (this.props.navigation.state.params.isEditProfile === true) {
      isEditProfile = true;
    }
    let firstname = '';
    let lastname = '';
    let email = '';
    let birthDay = null;
    let gender = '';
    let referralCode = '';
    let photo_url = null;

    if (this.props.user != null) {
      const user = this.props.user;

      console.info('user', user);

      if (user['first_name']) {
        firstname = user['first_name'];
      }
      if (user['last_name']) {
        lastname = user['last_name'];
      }
      if (user['email']) {
        email = user['email'];
      }
      if (user['birthday']) {
        birthDay = moment(user['birthday'], dateFormat).toDate();
      }
      if (user['gender']) {
        gender = user['gender'];
      }

      if (user['photo_url'] && user['photo_url'].length > 0) {
        photo_url = user['photo_url'];
      }
    }

    this.state = {
      firstname,
      lastname,
      email,
      birthDay,
      gender,
      referralCode,
      password: '',
      fbId: '',
      fbAccessToken: '',
      fbPicUrl: '',
      isLoading: false,
      photo: '',
      isEditProfile: isEditProfile,
      photo_url: photo_url,
      isAccept: false,
      displayBirthdayComponent: Platform.OS === 'ios'
    };

    this.textChanged = this.textChanged.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && this.state.isEditProfile && !this.props.error) {
      setTimeout(() => {
        Alert.alert('Info', 'Profile Updated Successfully', [
          {
            text: 'Ok',
            onPress: () => {
              this.props.navigation.goBack();
            }
          }
        ]);
      }, 200);
      return;
    }

    // const prevUser = prevProps.user;
    // const user = this.props.user;

    // const userChanged = () => {
    //   if ((user && !prevUser) || (prevUser && !user)) {
    //     return true;
    //   }

    //   return (
    //     prevUser['first_name'] !== user['first_name'] ||
    //     prevUser['last_name'] !== user['last_name'] ||
    //     prevUser['email'] !== user['email'] ||
    //     prevUser['birth_day'] !== user['birth_day'] ||
    //     prevUser['gender'] !== user['gender']
    //   );
    // };

    // if (!userChanged()) {
    //   return;
    // }

    // if (this.state.isEditProfile) {
    //   if (this.props.user) {
    //     this.setState({
    //       firstname: user['first_name'],
    //       lastname: user['last_name'],
    //       email: user['email'],
    //       birthDay: user['birth_day'],
    //       gender: user['gender']
    //     });
    //   }
    // }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.posting && !this.state.isEditProfile && !nextProps.posting && !nextProps.error) {
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

  openAndroidDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        maxDate: new Date(),
        date: this.state.birthDay || new Date(),
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ birthDay: new Date(year, month, day) })
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  fbClicked = () => {
    console.log('fbClicked');
    loginWithFacebook()
      .then(fbInfo => {
        console.log('success');
        console.log(fbInfo);
        this.props.loginRequest(fbInfo);
      })
      .catch(err => {
        console.log('err    -     >', err);
        this.setState({ isLoading: false });
      });
  };

  textChanged = (text, placeholder) => {
    switch (placeholder) {
      case 'First Name':
        this.setState({ firstname: text });
        break;
      case 'Last Name':
        this.setState({ lastname: text });
        break;
      case 'Email Address':
        this.setState({ email: text });
        break;
      case 'Referral Code':
        this.setState({ referralCode: text });
        break;
      case 'Password':
        this.setState({ password: text });
        break;
      default:
        break;
    }
  };

  signinAction = () => {
    const {
      firstname,
      lastname,
      referralCode,
      password,
      email,
      photo,
      isEditProfile,
      isAccept
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (lastname.length < 1) {
      alert('Please enter your Last Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter a valid Email');
      return;
    } else if (referralCode.length !== 0 && referralCode.length !== 8) {
      alert('Referral code must be 8 characters');
      return;
    } else if (password.length < 1) {
      alert('Please enter your Password');
      return;
    }

    if (!isEditProfile && !isAccept) {
      alert('You have to accept all Terms and Conditions');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      this.setState({ isLoading: false });

      if (status) {
        console.log(API.Register);
        var params = {
          first_name: firstname,
          last_name: lastname,
          email: email,
          referral_code: referralCode,
          password: password
        };

        this.props.registerRequest(params);
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }
    });
  };

  updateProfileAction = () => {
    const {
      firstname,
      lastname,
      email,
      photo,
      birthDay,
      gender
    } = this.state;

    if (firstname.length < 1) {
      alert('Please enter your First Name');
      return;
    } else if (email.length < 1) {
      alert('Please enter valid Email Id');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        const params = {
          first_name: firstname,
          last_name: lastname,
          photo_url: photo,
          gender
        };

        if (birthDay) {
          params['birthday'] = moment(birthDay).format(dateFormat);
        }

        console.info('new user profile data', params);

        this.props.updateUserProfileRequest(params);
      } else {
        alert(
          'No Internet connection found.Check your connection or try again.'
        );
      }

      this.setState({ isLoading: false });
    });
  };

  photoCaptured = source => {
    if (source.uri.length > 0) {
      console.info('Setting photo in state');
      this.setState({ photo: source.uri });
    }
  };

  renderSignupFooter() {
    return (
      <View
        style={{
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <DEIRegularText
          title={'Or login with your social profile'}
          style={{ color: Colors.white, fontSize: 17 }}
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <SocialButton type={'FB'} action={this.fbClicked} />
        </View>
      </View>
    );
  }

  renderEditProfileFooter() {
    return (
      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Terms')}
        >
          <DEIRegularText
            title={'Terms and Conditions'}
            style={{
              color: '#9393A7',
              fontSize: 17,
              textDecorationLine: 'underline'
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { isEditProfile } = this.state;
    const isAndroid = Platform.OS !== 'ios';

    return (
      <ThemeProvider theme={RNELoginTheme}>
        {/* <View style={styles.wrapper}>
         */}
         <ImageBackground
        source={Images.loginBackground}
        resizeMode={'cover'}
        style={styles.imageBackground}
        >
          <Spinner visible={this.state.isLoading || this.state.posting} />
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{ justifyContent: 'center' }}>
              <View style={styles.formContainer}>
                {/* <View>
                  <SgProfilePic
                    action={this.photoCaptured}
                    sourceURL={this.state.photo_url}
                  />
                </View> */}
                {/* <View style={{ height: 50 }} /> */}
                <Text style={styles.title}>Register Now!</Text>
                <View style={styles.name}>
                  <View style={styles.fName}>
                    <Text style={styles.subtitle}>First Name *</Text>
                    <Input
                      onChangeText={firstname => this.setState({ firstname })}
                      value={this.state.firstname}
                    />
                  </View>
                  <View style={styles.lName}>
                    <Text style={styles.subtitle}>Last Name *</Text>
                    <Input
                      onChangeText={lastname => this.setState({ lastname })}
                      value={this.state.lastname}
                    />
                  </View>
                </View>
                <Text style={styles.subtitle}>Email *</Text>
                <Input
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  keyboardType="email-address"
                />

                {/* <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="calendar"
                  maximumDate={new Date()}
                  onChange={(e, birthDay) => this.setState({ birthDay })}
                />

                {
                  isEditProfile && (
                    <Picker
                      selectedValue={this.state.gender}
                      onValueChange={gender => this.setState({ gender })}
                    >
                      <Picker.Item label="Select your gender" value="" />
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                    </Picker>
                  )
                }

                {
                  isEditProfile && isAndroid && (
                    <Button
                      title="Change birthday"
                      onPress={this.openAndroidDatePicker}
                    />
                  )
                }

                {
                  isEditProfile && !isAndroid && (
                    <View>
                      <Text>Your birthday</Text>
                      <DatePickerIOS
                        date={this.state.birthDay || new Date()}
                        onDateChange={birthDay => this.setState({ birthDay })}
                      />
                    </View>
                  )
                } */}

                {!isEditProfile && (
                  <View>
                    <Text style={styles.subtitle}>Password *</Text>
                    <Input
                      secureTextEntry
                      onChangeText={password => this.setState({ password })}
                      value={this.state.password}
                      returnKeyType={'done'}
                    />
                  </View>
                )}
                {!isEditProfile && (
                  <View>
                    <Text style={styles.subtitle}>Referral Code</Text>
                    <Input
                      onChangeText={referralCode => this.setState({ referralCode })}
                      value={this.state.referralCode}
                    />
                  </View>
                )}
                {!isEditProfile && (
                  <CheckBox
                    title="I accept all Terms and Conditions"
                    checked={this.state.isAccept}
                    onPress={() =>
                      this.setState({ isAccept: !this.state.isAccept })
                    }
                  />
                )}
                <Text style={styles.subtitle}>By creating an account, you agree to the Dei</Text>
                <Text style={styles.tocTitile}>Terms and Conditions of Use <Text style={styles.subtitle}>and</Text> Privacy Policy</Text>
                <Button
                  title={isEditProfile ? 'UPDATE' : 'REGISTER'}
                  onPress={() => {
                    isEditProfile
                      ? this.updateProfileAction()
                      : this.signinAction();
                  }}
                />

                <View style={{ alignItems: 'center' }}>
                  {!this.state.isEditProfile && this.renderSignupFooter()}
                  {this.state.isEditProfile && this.renderEditProfileFooter()}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </ThemeProvider>
    );
  }
}

export const SocialButton = ({ type, action }) => {
  const icon = type === 'FB' ? Images.social.facebook : Images.social.google;
  return (
    <TouchableOpacity onPress={action} style={{ marginHorizontal: 10 }}>
      <Image source={icon} style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );
};

const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error,
  user: auth.user,
  token: auth.token
})

const mapDispatchToProps = (dispatch) => ({
  updateUserProfileRequest: form => dispatch(AuthActions.updateUserProfileRequest(form)),
  registerRequest: form => dispatch(AuthActions.registerRequest(form)),
  loginRequest: form => dispatch(AuthActions.loginRequest(form))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);

// export function loginFB() {
//   return new Promise((resolve, reject) => {
//     LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
//       function(result) {
//         console.log(result);
//         if (result.isCancelled) {
//           reject({ reason: 'Cancelled' });
//         } else {
//           AccessToken.getCurrentAccessToken().then(data => {
//             console.log(data);
//             const token = data.accessToken.toString();
//             const fbInfo = {
//               email: '',
//               password: '',
//               social_type: 'Facebook',
//               social_id: data.userID,
//               social_token: data.accessToken.toString()
//             };
//             debugger;
//             console.log(fbInfo);
//             //   resolve(fbInfo);

//             fetch(
//               'https://graph.facebook.com/v3.0/me?fields=name,first_name,last_name,gender,email,verified,link&access_token=' +
//                 token
//             )
//               .then(response => response.json())
//               .then(user => {
//                 console.log(user);
//                 resolve(fbInfo);
//               })
//               .catch(err => {
//                 reject({ reason: 'Error' });
//               });
//           });
//         }
//       },
//       function(error) {
//         debugger;
//         console.log(error);
//         reject({ reason: 'Error' });
//       }
//     );
//   });
// }
const logoWidth = 150;
const styles = StyleSheet.create({
  wrapper: {
    ...ApplicationStyles.screen.wrapper
  },
  name: {
    flex: 1,
    flexDirection: 'row'
  },
  fName: {
    paddingRight: 5,
    flex: 1
  },
  lName: {
    paddingLeft: 5,
    flex: 1
  },
  logo: {
    width: logoWidth,
    height: logoWidth,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  imageBackground: {
    width: screenWidth,
    height: screenHeight,
    marginBottom: 10,
    zIndex: 0
  },
  formContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 90,
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
    fontSize: Fonts.size.small,
    color: Colors.white,
    marginBottom: 10
  },
  tocTitile: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.small,
    color: Colors.accent,
    marginBottom: 10
  },
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
});
