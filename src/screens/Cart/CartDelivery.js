import React, { Component } from 'react';
import { connect } from 'react-redux'
import Axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

import {
  DEIRegularText,
} from '../../components';
import API from '../../components/API';
import AppSessionManager from '../../components/AppSessionManager';
import CartActions from '../../redux/CartRedux';
import CustomerActions from '../../redux/CustomerRedux';
import { capitalize } from '../../services/Helpers';
import ImageIcons from '../../themes/Images';
import colors from '../../themes/Colors';

import CartTotalView from './CartTotalView';
import DeliveryAddressList from './DeliveryAddressList';

const convertServerDate = date => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

class CartDelivery extends Component {
  constructor(props) {
    super(props);

    var selectedAddr = {};
    var selectedDateDetails = {
      delivery_date: '',
      delivery_timeslot: ''
    };

    if (Object.keys(this.props.delivery).length > 0) {
      const deliveryInfo = this.props.delivery;
      if (Object.keys(deliveryInfo.address).length > 0) {
        selectedAddr = deliveryInfo.address;
      }
    }

    this.state = {
      AddAddressVisible: false,
      AddressListModalVisible: false,
      deliveryDateModalVisible: false,
      addressList: [],
      selectedAddress: selectedAddr,
      selectedDateDetails: selectedDateDetails,
      isLoading: false,
      deliveryDateList: [],
      selectedDate: '',
      selectedDateIndex: -1,
      deliveryTimeSlotList: [],
      selectedTimeSlot: '',
      selectedTimeSlotIndex: -1
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.props.getAddressList();
      this.props.getCartDeliveryDates();
    }, 300);
  };

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.addresses != this.props.addresses) {
      this.setState({
        addressList: this.props.addresses,
        selectedAddress: this.props.addresses[0],
      });
    }

    if (prevProps.deliveryDates != this.props.deliveryDates) {
      const { deliveryDates } = this.props;
      const dateList = deliveryDates.length > 0
        ? deliveryDates.map((date) => ({label: convertServerDate(date.date), value: date.date})) :
        ([]);
      const timeSlotList = deliveryDates[0].slots.map(slot => ({label: slot.display, value: slot.display, id: slot.id }));

      this.setState({
        deliveryDateList: dateList,
        selectedDate: dateList[0].value,
        deliveryTimeSlotList: timeSlotList,
        selectedTimeSlot: timeSlotList[0].value
      });
    }
  }

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.delivery != null &&
      Object.keys(nextProps.delivery).length > 0
    ) {

      const deliveryInfo = nextProps.delivery;
      var addressTempList = this.state.addressList;

      if (addressTempList.length == 0) {
        addressTempList.push(deliveryInfo.address);
      }

      this.setState({
        addressList: addressTempList,
        selectedAddress: deliveryInfo.address,
        selectedDateDetails: deliveryInfo.selectedDateDetails
      });
    }
  };

  toggleAddDeliveryAddress = () => {
    if (this.state.addressList.length > 0) {
      this.setState({
        AddressListModalVisible: !this.state.AddressListModalVisible
      });
    } else {
      this.setState({
        AddAddressVisible: !this.state.AddAddressVisible
      });
    }
  };

  saveDeliveryAddressClicked = details => {
    if (Object.keys(details).length > 0) {
      this.setState({ selectedAddress: details });
      var address = this.state.addressList;
      address.push(details);

      var headers = AppSessionManager.shared().getAuthorizationHeader();
      Axios.post(API.AddressAdd, details, headers)
        .then(res => {
          var addressDetails = {}; //res.data.Address;
          if (Object.keys(res.data.Address).length > 0) {
            addressDetails = res.data.Address;
            this.setState({
              addressList: address,
              selectedAddress: addressDetails,
              AddAddressVisible: false,
              isLoading: false
            });
          } else {
            this.setState({
              AddAddressVisible: false,
              isLoading: false
            });
          }
        })
        .catch(err => {
          this.setState({ isLoading: false });
          setTimeout(() => {
            alert('Unable to add address - please try again later');
          }, 200);
        });
    }
  };

  toggleDeliveryDate = () => {
    this.setState({
      deliveryDateModalVisible: !this.state.deliveryDateModalVisible
    });
  };

  deliveryDateSelected = details => {
    this.toggleDeliveryDate();
    this.setState({ selectedDateDetails: details });
  };

  toggleAddressList = () => {
    this.setState({
      AddressListModalVisible: !this.state.AddressListModalVisible
    });
  };

  saveAddressListClicked = details => {
    this.setState({
      selectedAddress: details,
      AddressListModalVisible: false
    });
  };

  renderAddressView = () => {
    const { selectedAddress } = this.state;

    if (Object.keys(selectedAddress).length > 0) {
      return (
        <SelectedAddressView
          addressInfo={selectedAddress}
          action={this.toggleAddressList}
        />
      );
    }
  };

  changeDate = (index) => {
    const { deliveryDates } = this.props;
    var list = index >= 1 ?
      deliveryDates[index - 1].slots.map(slot => ({label: slot.display, value: slot.display, id: slot.id })) :
      [];

    this.setState({
      selectedDateIndex: index - 1,
      deliveryTimeSlotList: list,
      selectedDate: index === 0 ? '' : this.state.deliveryDateList[index - 1].value,
      selectedTimeSlot: index === 0 ? '' : list[0].value,
    })
  };

  gotoPaymentClicked = () => {
    const {
      selectedAddress,
      selectedDateIndex,
      selectedTimeSlotIndex,
      deliveryDateList,
      deliveryTimeSlotList
    } = this.state;

    if (Object.keys(selectedAddress).length < 1) {
      alert('Please select Delivery Address');
      return;
    } else if (selectedDateIndex == -1) {
      alert('Please select Delivery Date');
      return;
    } else if (selectedTimeSlotIndex == -1) {
      alert('Please select Delivery Time');
      return;
    }

    const delivery = {
      address: selectedAddress,
      deliveryInfo: {
        delivery_date: deliveryDateList[selectedDateIndex].value,
        delivery_timeslot: deliveryTimeSlotList[selectedTimeSlotIndex].id
      }
    };

    this.props.action(delivery);
  };

  render() {
    const {
      AddressListModalVisible,
    } = this.state;

    const paddingHorizontal = 20;
    var checkoutInfo = AppSessionManager.shared().getCheckoutInfo();

    return (
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
        <Spinner visible={this.props.fetchingAddresses || this.props.fetchingCart} />
        <ScrollView>
          <View>
            {this.renderAddressView()}
            <View style={{ flex: 1, paddingHorizontal }}>
              <View style={{ height: 0.3, backgroundColor: '#707070', marginTop: 20 }} />
              <View style={styles.deliveryTitleStyle}>
                <Image
                  source={ImageIcons.tabs.homeSelected}
                  style={{ width: 25, height: 25, marginRight: 20, resizeMode: 'contain' }}
                />
                <DEIRegularText
                  title="DELIVERY TIME"
                  style={{ fontSize: 20, color: colors.purple }}
                />
              </View>
              <View >
                <View style={styles.deliveryTimeRowStyle}>
                  <View>
                    <DEIRegularText
                      title="Date"
                      style={{ color: 'black', fontSize: 16 }}
                    />
                  </View>
                  <View style={{width: '70%'}}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select a date',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={this.state.selectedDate}
                      items={this.state.deliveryDateList}
                      onValueChange={(value, index) => {
                        this.changeDate(index)
                      }}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          paddingVertical: 8,
                          paddingHorizontal: 20,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{ underlineColor: 'yellow' }}
                      Icon={() => {
                        return <FontAwesomeIcon name="calendar-o" size={20} color="gray" />;
                      }}
                    />
                  </View>
                </View>
                <View style={styles.deliveryTimeRowStyle}>
                  <View>
                    <DEIRegularText
                      title="Time"
                      style={{ color: 'black', fontSize: 16 }}
                    />
                  </View>
                  <View style={{width: '70%'}}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select a time slot',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={this.state.selectedTimeSlot}
                      items={this.state.deliveryTimeSlotList}
                      onValueChange={(value, index) => {
                        this.setState({
                          selectedTimeSlot: value
                        });
                        if (index >= 1) {
                          this.setState({ selectedTimeSlotIndex: index - 1})
                        }
                      }}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          paddingVertical: 8,
                          paddingHorizontal: 20,
                        },
                      }}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{ underlineColor: 'yellow' }}
                      Icon={() => {
                        return <FontistoIcon name="clock" size={20} color="gray" />;
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <CartTotalView
              action={this.gotoPaymentClicked}
              btnTitle={'Proceed To Payment'}
              checkoutInfo={checkoutInfo}
            />
          </View>

          <DeliveryAddressList
            action={this.saveAddressListClicked}
            address={this.state.addressList}
            closeModal={this.toggleAddressList}
            isVisible={AddressListModalVisible}
          />
        </ScrollView>
      </View>
    );
  }
}

const SelectedAddressView = ({ addressInfo, action }) => {
  const { floor, unit, street, state, country } = addressInfo;
  const lobbyName = addressInfo['lobby_name'] && addressInfo['lobby_name'].length && addressInfo['lobby_name'];

  const paddingHorizontal = 20;
  return (
    <View style={{ flex: 1, paddingHorizontal }}>
      <View style={styles.addressTitleStyle}>
        <Image
          source={ImageIcons.tabs.homeSelected}
          style={{ width: 25, height: 25, marginRight: 20, resizeMode: 'contain' }}
        />
        <DEIRegularText
          title="ADDRESS"
          style={{ fontSize: 20, color: colors.purple }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <DEIRegularText
          title={ capitalize(addressInfo['profile_name']) }
          style={{ color: 'black', fontSize: 16, marginRight: 30 }}
        />
        <View style={styles.defaultButton} >
          <Text style={styles.defaultButtonText}>Default</Text>
        </View>
      </View>
      <DEIRegularText
        title={`#${floor}, blk ${unit}, ${street}`}
        style={{ marginTop: 15, color: 'black' }}
      />
      {
        lobbyName && (
          <DEIRegularText
            title={addressInfo['lobby_name']}
            style={{ color: 'black' }}
          />
        )
      }
      <DEIRegularText
        title={`${state} ${addressInfo['postal_code']}`}
        style={{ color: 'black' }}
      />
      <DEIRegularText
        title={country}
        style={{ color: 'black' }}
      />
      <View>
        <TouchableOpacity
          onPress={action}
        >
          <View style={styles.changeAddressButton}>
            <Text style={styles.changeAddressButtonText}>Change Address</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DeliveryButton = ({ title, action, details }) => {
  const rightImage =
    title == 'Add delivery address'
      ? require('../../assets/Cart/ic_cart_loc.png')
      : require('../../assets/Cart/ic_cart_time.png');

  const leftImage =
    title == 'Add delivery address'
      ? require('../../assets/Cart/ic_cart_add.png')
      : require('../../assets/Cart/ic_cart_dis.png');

  const { deliveryBtnViewStyle } = styles;
  var titleText = title;
  var borderStyle = { borderRadius: 20 };
  if (Object.keys(details).length > 0) {
    titleText = details.selectedDay.desc + ' | ' + details.slot.title;
    borderStyle = { borderRadius: 0 };
  }

  return (
    <ImageBackground
      style={{ width: '100%', height: 65 }}
      imageStyle={{ resizeMode: 'contain' }}
      source={require('../../assets/Cart/ic_cart_dlshadow.png')}
    >
      <TouchableOpacity
        onPress={action}
        style={[deliveryBtnViewStyle, borderStyle]}
      >
        <Image
          source={rightImage}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
            marginLeft: 20
          }}
        />
        <DEIRegularText
          title={titleText}
          style={{ color: '#B19CFD', textAlign: 'center' }}
        />
        <Image
          source={leftImage}
          style={{
            width: 12,
            height: 12,
            resizeMode: 'contain',
            marginRight: 20
          }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  addressTitleStyle: {
    flexDirection: 'row',
    marginBottom: 20
  },
  defaultButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#7ef19b'
  },
  defaultButtonText: {
    color: '#3ec760',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 5
  },
  changeAddressButton: {
    marginTop: 20,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 20,
  },
  changeAddressButtonText: {
    fontSize: 16,
    color: colors.orange
  },
  deliveryTitleStyle: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  },
  deliveryTimeRowStyle: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  dateStyle: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: '#707070',
    borderRadius: 20
  },
  deliveryBtnViewStyle: {
    backgroundColor: '#F4F4F4',
    height: 40,
    marginHorizontal: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 0,
    borderColor: '#fff',
    flexDirection: 'row'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 20,
    color: '#F08A46',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 30,
    color: '#F08A46',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const mapDispatchToProps = (dispatch) => ({
  getCartDeliveryDates: () => dispatch(CartActions.getCartDeliveryDates()),
  getAddressList: () => dispatch(CustomerActions.getAddressListRequest())
});

const mapStateToProps = ({cart, customer}) => ({
  deliveryDates: cart.deliveryDates,
  fetchingCart: cart.fetching,
  addresses: customer.addresses,
  fetchingAddresses: customer.fetching
});

export default connect(mapStateToProps, mapDispatchToProps)(CartDelivery);
