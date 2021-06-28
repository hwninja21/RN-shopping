import React from 'react';
import { AsyncStorage, Image, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts, Images } from '../themes';
import CartBadge from '../components/CartBadge';

export const getErrorMessageFromResponse = (response, defaultMessage = 'Error, please try again') =>
  response.data && response.data.alert && response.data.alert.message || defaultMessage;

/**
 * Capitalize a string
 * @param s
 * @return {string|*}
 */
export const capitalize = s => {
  if (!s) return s;

  return `${s.charAt(0).toUpperCase()}${s.substring(1)}`;
};

export const printAllStorageData = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getAllKeys().then(
      keys => {
        console.info('keys', keys);

        const data = {};

        Promise.all(
          keys.map(key => AsyncStorage.getItem(key).then(
              value => {
                data[key] = value;
              }
            ).catch(e => reject(e))
          )
        ).then(
          () => {
            console.info('Data', data);
            resolve(data);
          }
        ).catch(
          e => reject(e)
        )
      }
    ).catch(e => reject(e));
  })
};

/**
 * Get navigation options for navigation
 * This function is working exactly as react navigation `navigationOptions` works.
 * You can pass to it either an object with navigation options or a function that will return the navigation options
 * You should wrap all the navigation options in this functions because it provides default navigation options,
 * centers the title, etc.
 * @param options
 * @return {function(*=): {headerBackTitle: string, headerRight: *, headerTitleStyle: {alignSelf: string, fontFamily: string, textAlign: string, flex: number, justifyContent: string}, headerTintColor: string, headerLayoutPreset: string, headerStyle: {elevation: number, backgroundColor: string, borderBottomWidth: number}}}
 */
export const getNavigationOptions = (options = {}) => {
  return navigationParams => {
    const { navigation } = navigationParams;
    const parent = navigation.dangerouslyGetParent();

    let opts = options;

    if (typeof options === 'function') {
      opts = options(navigationParams);
    }

    const hasBackButton = Boolean(opts.headerLeft) || (parent && parent.state && parent.state.index > 0);

    // If there is no back button then add an empty view. It's a hack to keep the title centered
    if (!hasBackButton) {
      opts.headerLeft = (<View />);
    }

    if (!opts.title && !opts.headerTitle) {
      opts.headerTitle = (
        <View style={{ flex: 1, alignItems: 'center'}}>
          <Image
            source={Images.logo}
            style={{
              height: 40,
              width: 40,
              resizeMode: 'contain'
            }}
          />
        </View>
      );
    }

    return {
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: Colors.primaynavigation,
        elevation: 0,
        borderBottomWidth: 0
      },
      headerLayoutPreset: 'center',
      headerTintColor: Colors.black,
      headerTitleStyle: {
        fontFamily: Fonts.type.base,
        alignSelf: 'center',
        textAlign: "center",
        justifyContent: 'center',
        flex: 1,
      },
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={{ flex: 1, alignItems: 'center', marginRight: 20 }}
        >
          <Image
            source={require('../assets/Cart/ic_shopping_cart.png')}
            style={{
              height: 30,
              width: 30,
              resizeMode: 'contain'
            }}
          />
          <CartBadge />
        </TouchableOpacity>
      ),
      ...opts
    };
  };
};
