import React from 'react';
import colors from '../../themes/Colors';
import Share from 'react-native-share';
import { View, Image, TouchableOpacity, Clipboard } from 'react-native';
import { DEIRegularText } from '../../components';
import { connect } from 'react-redux';
import { Button, ThemeProvider } from 'react-native-elements';
import { RNELoginTheme } from '../Signup/Login';
import { getNavigationOptions } from '../../services/Helpers';

const largeTextStyle = {
  color: 'black',
  fontSize: 20
};

const socialIconsMargin = 40;

class InviteAFriend extends React.Component {
  static navigationOptions = getNavigationOptions({
    title: 'Invite a Friend',
    headerStyle: {
      borderBottomColor: '#cccccc',
      borderBottomWidth: 1
    }
  });

  onCopyPress = () => {
    Clipboard.setString(this.props.inviteCode);
    setTimeout(() => alert('Code copied to clipboard'), 1);
  };

  openShareDialog = social => () => {
    // For iOS, check the 'info.plist file - the key `LSApplicationQueriesSchemes`. It contains
    // a list of social networks.
    // Check step 6: https://github.com/react-native-community/react-native-share/tree/v1.2.1#ios-install

    // TODO: change the title, message and url
    Share.shareSingle({
      social,
      title: 'Use this invite code to join Dei',
      message: 'Join now!',
      url: 'https://www.example.com'
    });
  };

  share = () => {
    Share.open({
      title: 'Use this invite code to join Dei',
      message: 'Join now!',
      url: 'https://www.example.com'
    });
  };

  render() {
    return (
      <ThemeProvider theme={RNELoginTheme}>
        <View style={{ flex: 1 }}>
          <View style={{ width: '100%', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 40 }}>
            <Image source={require('../../assets/MyAccount/handshake.png')} style={{ width: 200, height: 200 }}/>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
            <DEIRegularText
              title="Get"
              style={largeTextStyle}
            />
            <DEIRegularText
              title=" Special Discount "
              style={{fontSize: largeTextStyle.fontSize + 2, color: '#4d184e', fontWeight: 'bold'}}
            />
            <DEIRegularText title="when you" style={largeTextStyle}/>
          </View>
          <DEIRegularText title="refer a friend to try Dei." style={{...largeTextStyle, textAlign: 'center'}}/>

          <DEIRegularText
            title="Share your invite code"
            style={{fontSize: largeTextStyle.fontSize - 4, textAlign: 'center', paddingVertical: 20, color: '#d4d4d4'}}
          />

          <View
            style={{
              flex: 1,
              maxHeight: 50,
              marginHorizontal: 50,
              paddingHorizontal: 20,
              borderColor: '#a1a1a1',
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <DEIRegularText
              title={this.props.inviteCode}
              style={{ fontSize: 30, color: 'black', fontWeight: 'bold', width: 'auto' }}
            />

            <TouchableOpacity onPress={this.onCopyPress}>
              <DEIRegularText
                title="Copy"
                style={{ color: colors.orange, fontSize: 18, fontWeight: 'bold' }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              marginTop: 10,
              minHeight: 30,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Button title="SHARE" onPress={this.share} buttonStyle={{ width: '100%', minHeight: 30 }} />
          </View>
        </View>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ inviteCode: auth.user['invite_code'] });

export default connect(mapStateToProps)(InviteAFriend);
