import React, { Component } from 'react';
import {
  Image,
  View,
  StyleSheet,
  WebView
} from 'react-native';
import {
  DEIRegularText,
  DEIBoldText,
  getProductImage
} from '../../components';
import Micon from 'react-native-vector-icons/MaterialIcons';
import { Divider } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors, Metrics } from '../../themes';
import { getNavigationOptions } from '../../services/Helpers';

const getStoryHTML = description => `
  <html>
    <head>
      <!-- This is needed for the images to take up all the space and resize. Otherwise they will exceed the view -->
      <style> img { display: block; max-width: 100%; height: auto; }</style>
    </head>
    <body>
        ${ description }
    </body>
  </html>
`;

class StoreReadMore extends Component {
  static navigationOptions = getNavigationOptions(({ navigation }) => {
    const store = navigation.getParam('store');

    return { title: store && store.name ? store.name : '' }
  });

  render() {
    const store = this.props.navigation.getParam('store');

    return (
      <View style={{ flex: 1}}>
        <ScrollView>
          <TouchableOpacity
            style={{backgroundColor: Colors.grey}}
            onPress={() =>
              this.props.navigation.navigate('ProductPreview', {
                url: getProductImage(this.state.product)
              })
            }
          >
            <Image
              source={{uri: store['mobile_banner_url'] || store['banner_url']}}
              style={{ width: '100%', height: 230, resizeMode: 'cover', alignItems: 'center'}}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: 20, marginTop: 30}}>
            <DEIBoldText
              title={store.name}
              style={{fontSize: 20, color: Colors.primary}}
            />
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View>
                <Micon name="location-on" size={20} color={Colors.darkerGrey}/>
              </View>
              <View style={{flexDirection: 'column', marginLeft: 5}}>
                <DEIRegularText title={'# ' + store.address} style={Colors.darkerGrey}/>
                <DEIRegularText title={'Kitchener Complex'} style={Colors.darkerGrey}/>
                <DEIRegularText title={store.country + ' , ' + store.postal_code} style={Colors.darkerGrey}/>
                <DEIRegularText title={store.city} style={Colors.darkerGrey}/>
              </View>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.productDescContainer}>
              <DEIBoldText title={'Our Story'} style={{color: Colors.black, fontSize: 15, marginBottom: 10}}/>
              <View style={{ display: 'flex', height: 500 }}>
                <WebView source={{ html: getStoryHTML(store.description) }} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: Colors.white},
  image: {width: Metrics.screenWidth, height: 200, resizeMode: 'contain'},
  footer: {
    height: 100,
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  nameContainer: {
    marginHorizontal: 20,
    marginTop: 30
  },
  name: {fontSize: 20, color: Colors.primary},
  description: {color: Colors.darkerGrey, marginTop: 5},
  price: {fontSize: 25, color: Colors.accent, marginTop: 10, fontWeight: 'bold'},
  belowPrice: {color: Colors.green, marginTop: 10},
  divider: {marginTop: 50},
  productDescContainer: {marginTop: 20}
});

export default StoreReadMore;
