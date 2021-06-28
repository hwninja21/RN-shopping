import React from 'react';
import {NetInfo} from 'react-native';
import Config from 'react-native-config';

const BASEURL = Config.API_BASE_URL;

// Load More :  https://medium.com/@pateldhara248/flatlist-with-loadmore-and-pull-to-refresh-582d48eca60b
// https://github.com/morishin/react-native-infinite-scroll-grid

export default {
  Login: `${BASEURL}/customer/login`,
  Register: `${BASEURL}/customer/register`,
  ChangePassword: `${BASEURL}/customer/password`,
  ForgotPassword: `${BASEURL}/forgot`,
  VerifyForgotPassword: `${BASEURL}/forgot/verify`,
  launch: `${BASEURL}/launch`,
  Stores: `${BASEURL}/store`,
  StoreDetail: id => `${BASEURL}/merchant/${id}/detail`,
  StoreProducts: id => `${BASEURL}/merchant/${id}/products`,
  Product: `${BASEURL}/product/`,
  SearchProduct: `${BASEURL}/products`,
  CategoryList: `${BASEURL}/product/categories`,
  CategoryProductList: id => `${BASEURL}/category/${id}/products/`,
  AddressAdd: `${BASEURL}/address/add`,
  AddressUpdate: `${BASEURL}/address/`,
  AddressList: `${BASEURL}/address`,
  AddressDelete: `${BASEURL}/address/delete/`,
  AddCard: `${BASEURL}/card/add`,
  Cards: `${BASEURL}/card`,
  RemoveCard: `${BASEURL}/card/delete/`,
  CustomerDetail: `${BASEURL}/customer/detail`,
  ProfileUpdate: `${BASEURL}/customer/update`,
  CartAdd: `${BASEURL}/cart/add`,
  CartDates: `${BASEURL}/cart/dates`,
  Checkout: `${BASEURL}/checkout`,
  MyOrders: `${BASEURL}/customer/orders`,
  Config: `${BASEURL}/customer/config`
};

export const isNetworkConnected = () =>
  new Promise(resolve => {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      resolve(isConnected);
    });
  });

export function NoInternetAlert() {
  return alert(
    'No Internet connection found.Check your connection or try again.'
  );
}
