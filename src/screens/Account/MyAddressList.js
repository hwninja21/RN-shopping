import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import MyAddressList from '../../components/MyAddressList';
import { ApplicationStyles } from '../../themes';
import { getNavigationOptions } from '../../services/Helpers';


class MyAddressListScreen extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    return {
      title: 'My Address',
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
          <Image
            style={{...ApplicationStyles.navigation.actionImage, tintColor: '#797979'}}
            source={require('../../assets/Cart/ic_add.png')}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
      }
    };
  });

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <MyAddressList navigation={this.props.navigation} />
      </View>
    );
  }
}

export default MyAddressListScreen;
