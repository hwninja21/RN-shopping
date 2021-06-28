import React, { Component } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';

import UpdateProfileInput from '../../components/UpdateProfileInput';
import { MyAccountSeparatorLine } from './MyAccountComponents';

import { DEIRegularText } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeProvider, Button } from 'react-native-elements';
import { RNELoginTheme } from '../Signup/Login';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../themes/Colors';
import CustomerRedux from '../../redux/CustomerRedux';
import { getNavigationOptions } from '../../services/Helpers';
import { Text } from 'react-native-elements';

const profileNames = {
  home: 'home',
  work: 'work'
};

class AddAddress extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    const address = navigation.getParam('address');

    return {
      title: !address ? 'Add Address' : 'Edit Address',
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      }
    };
  });

  constructor(props) {
    super(props);

    const address = this.props.navigation.getParam('address');

    if (address) {
      this.state = {
        id: address.id,
        visible: this.props.visible || '',
        postal_code: address.postal_code || '',
        firstname: address.firstname || '',
        lastname: address.lastname || '',
        street: address.street || '',
        floor: address.floor || '',
        unit: address.unit || '',
        profile_name: address.profile_name || '',
        isPrimaryAddr: !!address.is_default,
        phone_number: address.contact
      };
    } else {
      this.state = {
        visible: true,
        postal_code: '',
        firstname: '',
        lastname: '',
        street: '',
        floor: '',
        unit: '',
        phone_number: '',
        profile_name: profileNames.home,
        isPrimaryAddr: false
      };
    }

    this.state.isEdit = Boolean(address);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.posting && !this.props.posting) {
      const address = this.state.isEdit ? this.props.editedAddress : this.props.addedAddress;

      if (address) {
        const onSuccess = () => {
          if (this.props.navigation.getParam('onSuccess')) {
            this.props.navigation.getParam('onSuccess')(address);
          }

          this.props.navigation.goBack();
        };

        Alert.alert(
          'Success',
          `Address ${this.state.isEdit ? 'edited' : 'added'}`,
          [{ text: 'OK', onPress: onSuccess(address) }],
          { cancelable: false }
        )
      }
    }
  }

  togglePrimaryAddress = () => {
    this.setState({
      isPrimaryAddr: !this.state.isPrimaryAddr
    });
  };

  saveClicked = () => {
    const {
      profile_name, firstname, lastname, phone_number, postal_code, street, floor, unit
    } = this.state;
    if (profile_name.length < 1) {
      alert('Please enter a nick name for this address');
      return;
    } else if (firstname.length < 1) {
      alert('Please enter your first name');
      return;
    } else if (lastname.length < 1) {
      alert('Please enter your last name');
      return;
    } else if (phone_number.length < 1) {
      alert('Please enter your phone number');
      return;
    } else if (postal_code.length < 1) {
      alert('Please enter your postal code');
      return;
    } else if (street.length < 1) {
      alert('Please enter the street address');
      return;
    }

    const data = {
      profile_name,
      firstname: firstname,
      lastname: lastname,
      contact: phone_number,
      postal_code: postal_code,
      street: street,
      floor: floor,
      unit: unit,
      city: 'Singapore',
      country: 'SG',
      state: 'Singapore',
      is_default: this.state.isPrimaryAddr ? 1 : 0,
      building_type: 'HDB' // For some reason this is a hardcoded value and the server rejects addresses without this
    };

    if (this.state.isEdit) {
      this.props.editAddress(this.state.id, data);
    } else {
      this.props.addAddress(data);
    }
  };

  renderProfileNameInput = () => {
    const profileName = this.state.profile_name;

    const profileNameStyle = {
      textAlign: 'right', fontSize: 16, paddingLeft: 10
    };

    const homeStyle = {...profileNameStyle, color: profileName === profileNames.home ? '#F08A46' : colors.darkerGrey};
    const workStyle = {...profileNameStyle, color: profileName === profileNames.work ? '#F08A46' : colors.darkerGrey};

    const isCustomName = profileName !== profileNames.home && profileName !== profileNames.work;

    return (
      <UpdateProfileInput
        label="Nickname"
        placeholder="Other"
        value={isCustomName ? profileName : ''}
        onChangeText={profile_name => this.setState({ profile_name })}
        before={() => (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10}}>
            <Text
              style={homeStyle}
              onPress={() => this.setState({ profile_name: profileNames.home })}
            >
              Home
            </Text>
            <Text
              style={workStyle}
              onPress={() => this.setState({ profile_name: profileNames.work })}
            >
              Work
            </Text>
          </View>
        )}
        style={{ flex: undefined, paddingTop: 12 }}
        required
      />
    )
  }

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <Spinner visible={this.props.posting} animation="fade" />
        <KeyboardAwareScrollView>
          <View style={{ justifyContent: 'center'}}>
            { this.renderProfileNameInput() }

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="First Name"
              placeholder="First Name"
              value={this.state.firstname}
              onChangeText={firstname => this.setState({ firstname })}
              required
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Last Name"
              placeholder="Last Name"
              value={this.state.lastname}
              onChangeText={lastname => this.setState({ lastname })}
              required
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Phone Number"
              placeholder="Phone Number"
              value={this.state.phone_number}
              onChangeText={phone_number => this.setState({ phone_number })}
              before={() => <Text style={{flex: 1, textAlign: 'right', fontSize: 16, }}>+65</Text>}
              style={{ flex: undefined, paddingTop: 12 }}
              keyboardType="number-pad"
              required
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Postal Code"
              placeholder="Postal Code"
              value={this.state.postal_code}
              onChangeText={postal_code => this.setState({ postal_code })}
              keyboardType="number-pad"
              required
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Street Address"
              placeholder="Street Address"
              value={this.state.street}
              onChangeText={street => this.setState({ street })}
              required
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Floor No."
              placeholder="Floor No."
              value={this.state.floor}
              onChangeText={floor => this.setState({ floor })}
              before={() => <Text style={{flex: 2, textAlign: 'right', fontSize: 16, }}>#</Text>}
              style={{ flex: undefined, paddingTop: 12 }}
            />

            <MyAccountSeparatorLine />

            <UpdateProfileInput
              label="Unit No."
              placeholder="Unit No."
              value={this.state.unit}
              onChangeText={unit => this.setState({ unit })}
              before={() => <Text style={{flex: 2, textAlign: 'right', fontSize: 16, }}>-</Text>}
              style={{ flex: undefined, paddingTop: 12 }}
            />

            <MyAccountSeparatorLine />
          </View>
          <View style={{ margin: 20 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}
              onPress={this.togglePrimaryAddress}
            >
              <View
                style={{
                  width: 15,
                  height: 15,
                  marginHorizontal: 10,
                  backgroundColor: this.state.isPrimaryAddr
                    ? colors.orange
                    : '#F4F4F4'
                }}
              />
              <DEIRegularText
                title={'Set as primary delivery address'}
                style={{ fontSize: 11 }}
              />
            </TouchableOpacity>
            <Button title="Save" onPress={() => this.saveClicked()} />
          </View>
        </KeyboardAwareScrollView>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = ({ customer }) => ({
  posting: customer.posting,
  addedAddress: customer.addedAddress,
  editedAddress: customer.editedAddress
});

const mapDispatchToProps = dispatch => ({
  addAddress: data => dispatch(CustomerRedux.addAddressRequest(data)),
  editAddress: (addressId, data) => dispatch(CustomerRedux.editAddressRequest(addressId, data))
});

export default connect (mapStateToProps, mapDispatchToProps)(AddAddress);
