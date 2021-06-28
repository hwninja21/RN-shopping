import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SgProfilePic, isNetworkConnected } from './../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeProvider } from 'react-native-elements';
import { RNELoginTheme } from './Login';
import { ModalSelectList } from 'react-native-modal-select-list';
import { connect } from 'react-redux';
import UpdateProfileInput, { updateProfileInputStyles } from '../../components/UpdateProfileInput';
import DatePicker from 'react-native-datepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthActions from '../../redux/AuthRedux';
import moment from 'moment';
import { getNavigationOptions } from '../../services/Helpers';

const dateFormat = 'YYYY-MM-DD';

const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: '#ebebeb',
      width: '100%'
    }}
  />
);

const UpdateProfileItem = ({ label, value, onPress, renderRightComponent }) => (
  <View style={updateProfileInputStyles.updateProfileInputContainer}>
    <Text style={updateProfileInputStyles.subtitle}>{ label }</Text>

    {
      renderRightComponent ? renderRightComponent() : (
        <Text onPress={ onPress } style={updateProfileInputStyles.updateProfileInputComponentRight}>{ value }</Text>
      )
    }
  </View>
);

class UpdateProfile extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    return {
      title: 'Update Profile',
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      },
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('updateProfileAction')}>
          <Text style={{
            color: updateProfileInputStyles.updateProfileInputComponentRight.color,
            fontSize: updateProfileInputStyles.updateProfileInputComponentRight.fontSize,
            paddingRight: updateProfileInputStyles.updateProfileInputContainer.paddingHorizontal
          }}>
            Confirm
          </Text>
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%'
      }
    };
  });

  constructor(props) {
    super(props);

    const user = this.props.user || {};

    let {
      email,
      birthDay,
      gender,
      referralCode,
      photo_url
    } = {
      email: '',
      gender: 'Please select your gender',
      referralCode: '',
      ...this.props.user
    };

    if (this.props.user != null) {
      const user = this.props.user;

      if (user['birthday']) {
        birthDay = moment(user['birthday'], dateFormat).toDate();
      }

      if (user['photo_url'] && user['photo_url'].length > 0) {
        photo_url = user['photo_url'];
      }
    }

    this.genderModalRef = null;

    this.state = {
      firstname: user['first_name'] || '',
      lastname: user['last_name'] || '',
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
      photo_url: photo_url,
      isAccept: false,
      displayBirthdayComponent: false
    };

    this.textChanged = this.textChanged.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && !this.props.error) {
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

    const prevUser = prevProps.user;
    const user = this.props.user;

    const userChanged = () => {
      if ((user && !prevUser) || (prevUser && !user)) {
        return true;
      }

      return (
        prevUser['first_name'] !== user['first_name'] ||
        prevUser['last_name'] !== user['last_name'] ||
        prevUser['email'] !== user['email'] ||
        prevUser['birth_day'] !== user['birth_day'] ||
        prevUser['gender'] !== user['gender']
      );
    };

    if (!userChanged()) {
      return;
    }

    if (this.props.user) {
      this.setState({
        firstname: user['first_name'],
        lastname: user['last_name'],
        email: user['email'],
        birthDay: user['birth_day'],
        gender: user['gender']
      });
    }
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

  componentDidMount(): void {
    this.props.navigation.setParams({ updateProfileAction: this.updateProfileAction });
  }

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
      alert('Please enter your first name');
      return;
    } else if (email.length < 1) {
      alert('Please enter your email');
      return;
    }

    this.setState({ isLoading: true });
    isNetworkConnected().then(status => {
      if (status) {
        const params = {
          first_name: firstname,
          last_name: lastname,
          gender
        };

        if (photo !== '') {
          // TODO: when the info is available - check how to change the photo and make all the changes here.
          // Now the photo is not being updated
          params.photo = photo;
        }

        if (birthDay) {
          params['birthday'] = moment(birthDay).format(dateFormat);
        }

        console.info('update user profile params', params);

        this.props.updateUserProfileRequest(params);
      } else {
        alert('No Internet connection found.Check your connection or try again.');
      }

      this.setState({ isLoading: false });
    });
  };

  photoCaptured = source => {
    if (source.uri.length > 0) {
      this.setState({ photo: source.uri });
    }
  };

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <View style={styles.wrapper}>
          <Spinner visible={this.state.isLoading || this.state.posting} />
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={{ justifyContent: 'center' }}>
              <View style={styles.formContainer}>
                {/*<View style={{ paddingTop: 10, paddingBottom: 30 }}>*/}
                {/*  <SgProfilePic*/}
                {/*    action={this.photoCaptured}*/}
                {/*    sourceURL={this.state.photo_url}*/}
                {/*  />*/}
                {/*</View>*/}
                {/*<View style={{ height: 50 }} />*/}

                {/*<Separator />*/}

                <UpdateProfileInput
                  label="First Name"
                  value={this.state.firstname}
                  onChangeText={firstname => this.setState({ firstname })}
                />

                <Separator />

                <UpdateProfileInput
                  label="Last Name"
                  value={this.state.lastname}
                  onChangeText={lastname => this.setState({ lastname })}
                />

                <Separator />

                <UpdateProfileInput
                  label="Email"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                />

                <Separator />

                <UpdateProfileItem
                  label="Date of Birth"
                  renderRightComponent={() => (
                    <DatePicker
                      showIcon={false}
                      customStyles={{
                        dateText: {
                          textAlign: 'right',
                          color: '#F08A46',
                          fontSize: 12
                        },
                        dateInput: {
                          border: 'none',
                          borderWidth: 0,
                          padding: 0,
                          margin: 0,
                          alignItems: 'flex-end',
                          justifyContent: 'center'
                        },
                        dateTouchBody: {
                          height: undefined
                        }
                      }}
                      date={this.state.birthDay}
                      mode="date"
                      placeholder="Select Date"
                      format="D MMMM YYYY"
                      maxDate={new Date()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      onDateChange={birthDay => this.setState({ birthDay })}
                      style={{
                        flex: 1
                      }}
                    />
                  )}
                />

                <Separator />

                <UpdateProfileItem
                  label="Gender"
                  renderRightComponent={() => (
                    <Text
                      style={updateProfileInputStyles.updateProfileInputComponentRight}
                      onPress={() => this.genderModalRef.show()}
                    >
                      { this.state.gender.charAt(0).toUpperCase() + this.state.gender.substring(1) }
                    </Text>
                  )}
                />

                <ModalSelectList
                  ref={ref => this.genderModalRef = ref}
                  options={[
                    {value: 'male', label: 'Male'},
                    {value: 'female', label: 'Female'}
                  ]}
                  closeButtonText="Close"
                  onSelectedOption={gender => this.setState({ gender })}
                  disableTextSearch={true}
                  buttonTextColor={updateProfileInputStyles.updateProfileInputComponentRight.color}
                />

                <Separator />

              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error,
  user: auth.user
});

const mapDispatchToProps = (dispatch) => ({
  updateUserProfileRequest: form => dispatch(AuthActions.updateUserProfileRequest(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  formContainer: {
    // marginTop: 15,
    marginBottom: 20,
    borderRadius: 20,
    flex: 1
  }
});
