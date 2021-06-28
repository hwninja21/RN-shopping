import React, { Component } from 'react';
import { View, Image, ScrollView, InteractionManager } from 'react-native';
import {
  DEIMediumText,
  DEIRegularText
} from '../../components';

import { AccountItemView } from './MyAccountComponents';
import { NavigationEvents } from 'react-navigation';
import {connect} from 'react-redux'
import AuthActions from '../../redux/AuthRedux'
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { getNavigationOptions } from '../../services/Helpers';

class MyAccount extends Component {
  static navigationOptions = getNavigationOptions(
    () => ({
      title: 'My Account',
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      }
    })
  );

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      picture: '',
      email: '',
      address: '',
      payment: '',
      isLoading: false,
      user: {}
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getUserInfo()
    })
  }

  itemClicked = title => {
    let routeName;
    let navigationParams = {};

    switch (title) {
      case 'Update Profile':
        routeName = 'UpdateProfile';
        break;
      case 'Settings':
        routeName = 'MySetting';
        break;
      case 'Order List':
        routeName = 'MyOrders';
        break;
      case 'My Saved Cards':
        routeName = 'SavedCards';
        break;
      case 'Change password':
        routeName = 'ChangePassword';
        break;
      case 'My Address':
        routeName = 'MyAddressList';
        break;
      case 'Terms & Conditions':
        routeName = 'Terms';
        break;
      case 'Invite a Friend':
        routeName = 'InviteAFriend';
        break;
      case 'Logout':
        this.logoutAction();
        break;
      default:
        break;
    }

    if (routeName) {
      this.props.navigation.navigate(routeName, navigationParams);
    }
  };

  logoutAction = () => {
    this.props.logout();
    this.props.navigation.navigate('Auth');
  };

  renderProfilePic = () => {
    const { user } = this.props;
    let picSource = require('../../assets/Signup/ic_emptyprofile.png');
    if (user.photo_url != null && user.photo_url.length > 0) {
      picSource = { uri: user.photo_url };
    }

    return (
      <Image
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          borderWidth: 0.3,
          borderColor: 'transparent'
        }}
        source={picSource}
      />
    );
  };

  renderProfileInformation = () => {
    const { user } = this.props;

    let birthday;

    if (user.birthday) {
      try {
        birthday = moment(user.birthday, 'YYYY-MM-DD').format('D MMMM YYYY')
      } catch (e) {

        // Do nothing
      }
    }

    return (
      <View style={{ paddingBottom: 10 }}>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            margin: 20
          }}
        >
          {this.renderProfilePic()}
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <DEIMediumText
              title={`Hi ${user['first_name']} ${user['last_name']}`}
              style={{ color: '#794a78', fontSize: 24, textAlign: 'center' }}
            />
            <DEIRegularText
              title={user.email}
              style={{
                color: '#7b7b7b',
                fontSize: 12,
                marginTop: 5,
                textAlign: 'center'
              }}
            />
            {
              birthday && (
                <DEIRegularText
                  title={`Date of Birth: ${ birthday }`}
                  style={{
                    color: '#303030',
                    fontSize: 14,
                    marginTop: 5,
                    textAlign: 'center'
                  }}
                />
              )
            }
          </View>
        </View>
      </View>
    );
  };

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#ebebeb',
          width: '100%'
        }}
      />
    );
  }

  renderAccountInfo = () => {
    return (
      <View>
        <View style={{ backgroundColor: '#fff' }}>
          { this.renderSeparator() }

          <AccountItemView
            title={'Update Profile'}
            iconSrc={require('../../assets/MyAccount/ic_update_profile.png')}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

          <AccountItemView
            title={'Change password'}
            iconSrc={require('../../assets/MyAccount/ic_change_password.png')}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

          <AccountItemView
            title={'My Address'}
            iconSrc={require('../../assets/MyAccount/ic_my_address.png')}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

          <AccountItemView
            title={'My Saved Cards'}
            iconSrc={require('../../assets/MyAccount/ic_my_saved_cards.png')}
            iconWidth={20}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

          <AccountItemView
            title={'Order List'}
            iconSrc={require('../../assets/MyAccount/ic_order_list.png')}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

          <AccountItemView
            title={'Invite a Friend'}
            iconSrc={require('../../assets/MyAccount/ic_invite_a_friend.png')}
            iconWidth={19}
            iconHeight={12}
            isDisclosure={true}
            action={this.itemClicked}
          />

          { this.renderSeparator() }

        </View>

        <View style={{ backgroundColor: '#f5f5f5', height: 20 }} />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.getUserInfo();
          }}
        />
        <Spinner visible={this.state.isLoading} animation={'fade'} />

        <ScrollView>
          {this.renderProfileInformation()}
          {this.renderAccountInfo()}

          <View style={{ backgroundColor: '#fff' }}>
            { this.renderSeparator() }

            <AccountItemView
              title={'Logout'}
              iconSrc={require('../../assets/MyAccount/ic_logout.png')}
              iconWidth={15}
              iconHeight={12}
              isDisclosure={true}
              titleStyle={{ color: '#e73a3a' }}
              chevronSrc={require('../../assets/MyAccount/ic_chevron_right_red.png')}
              action={this.itemClicked}
            />

            { this.renderSeparator() }

            <View style={{ backgroundColor: '#f5f5f5', height: 40 }} />
          </View>

        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  user: auth.user || {}
});

const mapDispatchToProps = (dispatch) => ({
  getUserInfo: () => dispatch(AuthActions.getUserInfo()),
  logout: () => dispatch(AuthActions.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
