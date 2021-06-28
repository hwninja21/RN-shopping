import React, { Component } from 'react';
import { View, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { isNetworkConnected } from './../../components/index';
import { connect } from 'react-redux';
import UpdateProfileInput, { updateProfileInputStyles } from '../../components/UpdateProfileInput';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthActions from '../../redux/AuthRedux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getNavigationOptions } from '../../services/Helpers';

const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: '#ebebeb',
      width: '100%'
    }}
  />
);

export class ChangePassword extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => ({
    title: 'Change Password',
    headerStyle: {
      borderBottomColor: '#cccccc',
      borderBottomWidth: 1
    },
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam('submitAction')}>
        <Text style={{
          color: updateProfileInputStyles.updateProfileInputComponentRight.color,
          fontSize: updateProfileInputStyles.updateProfileInputComponentRight.fontSize,
          paddingRight: updateProfileInputStyles.updateProfileInputContainer.paddingHorizontal
        }}>
          Confirm
        </Text>
      </TouchableOpacity>
    )
  }));

  constructor(props) {
    super(props);
    this.state = {
      currentpassword: '',
      password: '',
      confirmpassword: '',
      isLoading: false
    };
  }

  componentDidMount(): void {
    this.props.navigation.setParams({ submitAction: this.submitAction });
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting && !this.props.error) {
      setTimeout(() => {
        Alert.alert(
          'Info',
          'Password changed successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.props.navigation.goBack();
              }
            }
          ],
          { cancelable: true }
        );
      }, 200);
    }
  }

  submitAction = () => {
    const { currentpassword, password, confirmpassword } = this.state;

    if (password.length < 1) {
      alert('Please enter your new password');
      return;
    } else if (confirmpassword.length < 1) {
      alert('Please confirm your new password');
      return;
    } else if (confirmpassword !== password) {
      alert('Confirm password does not match');
      return;
    } else if (currentpassword.length < 1) {
      alert('Please enter your current password');
      return;
    }

    this.setState({ isLoading: true });

    isNetworkConnected().then(status => {
      if (status) {
        this.props.changePasswordRequest({current_password: currentpassword, password: password})
      } else {
        this.setState({ isLoading: false });
        alert('No Internet connection found.Check your connection or try again.');
      }

      this.setState({ isLoading: false });
    });
  };

  render() {
    const { currentpassword, password, confirmpassword } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading || this.props.posting} />
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={{ flex: 1 }}>
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 30,
            }}>
              <Image
                source={require('../../assets/MyAccount/change_password_header.png')}
                style={{
                  width: 250,
                  height: 250
                }}
              />
            </View>

            <Separator />

            <UpdateProfileInput
              label="Old Password"
              value={currentpassword}
              placeholder={'Old Password'}
              onChangeText={currentpassword => this.setState({ currentpassword })}
              secureTextEntry
            />

            <Separator />

            <UpdateProfileInput
              label="New Password"
              placeholder="New Password"
              value={password}
              onChangeText={password => this.setState({ password })}
              secureTextEntry
            />

            <Separator />

            <UpdateProfileInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChangeText={confirmpassword => this.setState({ confirmpassword })}
              secureTextEntry
            />

            <Separator />

          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  posting: auth.posting,
  error: auth.error
});

const mapDispatchToProps = (dispatch) => ({
  changePasswordRequest: form => dispatch(AuthActions.changePasswordRequest(form))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
