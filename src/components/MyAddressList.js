import React, { Component } from 'react';
import {
  View,
  Dimensions,
  FlatList
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import AppSessionManager from '../components/AppSessionManager';
import Axios from 'axios';
import API from '../components/API';
import AddDeliveryAddress from '../screens/Cart/AddDeliveryAddress';
import CustomerRedux from '../redux/CustomerRedux';
import MyAddress from '../components/MyAddress';
import PropTypes from 'prop-types';
import { isNetworkConnected } from '../components/index';
import { EmptyView } from '../components/EmptyView';
import { connect } from 'react-redux';
import { MyAccountSeparator } from '../screens/Account/MyAccountComponents';


const screenHeight = Dimensions.get('screen').height;

const perPage = 6;

class MyAddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      hasMore: true,
      selectedIndex: 0,
      isLoading: false,
      addressList: [],
      hasMoreAddresses: true,
      selectedAddress: {},
      editAddress: {},
      AddAddressVisible: false
    };
  }

  componentDidMount() {
    this.getAddresses();
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.fetching && !this.props.fetching && this.props.addresses) {
      this.setState({
        addressList: this.state.addressList.concat(this.props.addresses),
        hasMoreAddresses: this.props.addresses.length >= perPage
      });
    }

    if (prevProps.deleting && !this.props.deleting && this.props.deletedAddressId) {
      this.setState({
        addressList: this.state.addressList.filter(({ id }) => id !== this.props.deletedAddressId)
      });
    }

    if (prevProps.posting && !this.props.posting && this.props.addedAddress) {
      this.setState({ addressList: [this.props.addedAddress, ...this.state.addressList] });
    }
  }

  getAddresses = () => {
    this.props.getAddresses(this.state.currentPage);
  };

  onEndReached = () => {
    if (this.state.hasMoreAddresses && !this.props.fetching) {
      this.props.getAddresses(this.state.currentPage + 1);
      this.setState({ currentPage: this.state.currentPage + 1 });
    }
  };

  deleteAddress = address => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.props.deleteAddress(address.id)
      }
    });
  };

  saveDeliveryAddressClicked = details => {
    let params = {
      profile_name: details.profile_name,
      firstname: details.firstname,
      lastname: details.lastname,
      contact: details.contact,
      building_type: 'HDB',
      building_name: details.building_name,
      lobby_name: details.lobby_name,
      street: details.street,
      floor: details.floor,
      unit: details.unit,
      'address-2': details['address-2'],
      city: details.city,
      state: details.state,
      country: details.country,
      postal_code: details.postal_code,
      is_default: '0'
    };
    if (Object.keys(details).length > 0) {
      if (Object.keys(this.state.editAddress).length > 0) {
        this.setState({ selectedAddress: params });
        var apiURL = API.AddressUpdate + this.state.editAddress.id;
        var headers = AppSessionManager.shared().getAuthorizationHeader();
        Axios.put(apiURL, params, headers)
          .then(res => {
            this.setState({
              AddAddressVisible: false,
              isLoading: false
            });
            setTimeout(() => {
              this.getAddresses();
            }, 300);
          })
          .catch(err => {
            console.log(err.response);
            this.setState({ isLoading: false });
            setTimeout(() => {
              alert('Unable to update address - please try again later');
            }, 200);
          });
      }
    }
  };

  togglePopupView = () => {
    this.setState({
      AddAddressVisible: !this.state.AddAddressVisible
    });
  };

  onEditAddressPress = address => {
    const onSuccess = newAddress => {
      this.setState({
        addressList: this.state.addressList.map(address => address.id !== newAddress.id ? address : newAddress)
      });
    };

    this.props.navigation.navigate('AddAddress', { address, onSuccess });
  };

  renderUpdateRow = data => (
    <MyAddress
      address={data.item}
      displayActions={this.props.displayActions}
      onDelete={this.deleteAddress}
      onEditPress={this.onEditAddressPress}
      onPress={this.props.onAddressPress}
    />
  );

  render() {
    const { AddAddressVisible, editAddress } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <Spinner visible={this.props.fetching || this.props.posting || this.props.deleting} animation={'fade'} />
        <FlatList
          data={this.state.addressList}
          extraData={this.state}
          keyExtractor={item => `address-${item.id}`}
          ItemSeparatorComponent={MyAccountSeparator}
          ListEmptyComponent={
            this.props.fetching ? null : (
              <View
                style={{
                  height: screenHeight - 100,
                  justifyContent: 'center'
                }}
              >
                <EmptyView type={5} />
              </View>
            )
          }
          renderItem={this.renderUpdateRow}
          onEndReachedThreshold={0.25}
          onEndReached={this.onEndReached}
        />
        {
          AddAddressVisible && (
            <AddDeliveryAddress
              action={this.saveDeliveryAddressClicked}
              address={editAddress}
              closeModal={this.togglePopupView}
            />
          )
        }
      </View>
    );
  }
}

const mapStateToProps = ({ customer }) => ({
  fetching: customer.fetching,
  deleting: customer.deleting,
  posting: customer.posting,
  deletedAddressId: customer.deletedAddressId,
  addedAddress: customer.addedAddress,
  addresses: customer.addresses
});

const mapDispatchToProps = dispatch => ({
  getAddresses: page => dispatch(CustomerRedux.getAddressesRequest(page, perPage)),
  deleteAddress: addressId => dispatch(CustomerRedux.deleteAddressRequest(addressId))
});

MyAddressList.defaultProps = {
  displayActions: true
};

MyAddressList.propTypes = {
  displayActions: PropTypes.bool,
  onPress: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAddressList);
