import React from 'react';
import PropTypes from 'prop-types';
import colors from '../themes/Colors';
import CustomerRedux from '../redux/CustomerRedux';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { DEIRegularText } from './APIConstants';
import { capitalize } from '../services/Helpers';
import { MyAccountSeparatorLine } from '../screens/Account/MyAccountComponents';
import { connect } from 'react-redux';


const MyAddress = props => {
  const { address, onPress, defaultAddressId } = props;

  const { floor, unit, street, state, country } = address;

  const lobbyName = address['lobby_name'] && address['lobby_name'].length && address['lobby_name'];

  const paddingHorizontal = 20;
  const paddingVertical = 15;

  const showDeleteAddressConfirmation = () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => { props.onDelete(address); }
        }
      ],
      { cancelable: true }
    );
  };

  // If the 'onPress' prop is set then use a touchable opacity to handle the presses
  const Wrapper = onPress ? TouchableOpacity : View;

  const isDefault = defaultAddressId ? defaultAddressId === address.id : address['is_default'];

  return (
    <Wrapper
      style={{
        flex: 1,
        paddingTop: paddingVertical,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e1e1'
      }}
      onPress={onPress ? () => onPress(address) : undefined}
    >
      <View style={{ flex: 1, paddingHorizontal }}>
        <DEIRegularText
          title={ capitalize(address['profile_name']) }
          style={{ color: '#592d58' }}
        />

        <DEIRegularText
          title={`#${floor}, blk ${unit}, ${street}`}
          style={{ marginTop: 15, color: 'black' }}
        />

        {
          lobbyName && (
            <DEIRegularText
              title={address['lobby_name']}
              style={{ color: 'black' }}
            />
          )
        }

        <DEIRegularText
          title={`${state} ${address['postal_code']}`}
          style={{ color: 'black' }}
        />

        <DEIRegularText
          title={country}
          style={{ color: 'black' }}
        />
      </View>

      <MyAccountSeparatorLine style={{ marginTop: 15 }} />

      <View style={{
        paddingHorizontal: paddingHorizontal,
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between'
      }}>
        <View>
          {
            isDefault ? (
              <Image
                source={require('../assets/MyAccount/ic_check_green.png')}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <TouchableOpacity onPress={() => props.setDefaultAddress(props.address)}>
                <DEIRegularText
                  title="Set as Default"
                  style={{ color: colors.orange }}
                />
              </TouchableOpacity>
            )
          }
        </View>
        {
          props.displayActions && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => props.onEditPress(address)}>
                <DEIRegularText
                  title="Edit"
                  style={{ color: colors.orange, marginRight: 20 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={showDeleteAddressConfirmation}>
                <DEIRegularText
                  title="Remove"
                  style={{ color: colors.orange }}
                />
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    </Wrapper>
  );
};

MyAddress.defaultProps = {
  displayActions: true
};

MyAddress.propTypes = {
  address: PropTypes.object.isRequired,
  onEditPress: PropTypes.func,
  onDelete: PropTypes.func,
  displayActions: PropTypes.bool,
  onPress: PropTypes.func
};

const mapStateToProps = state => ({
  defaultAddressId: state.customer.defaultAddressId
});

const mapDispatchToProps = dispatch => ({
  setDefaultAddress: addressId => dispatch(CustomerRedux.setDefaultAddressRequest(addressId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAddress);
