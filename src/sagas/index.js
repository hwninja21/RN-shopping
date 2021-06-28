import API from '../services/Api';

import {
  addProductToCart,
  editCart,
  emptyCart,
  getCart,
  removeProductFromCart,
  setCartDetail,
  getCartDeliveryDates,
  applyPromoCode,
  checkout,
  checkCheckoutStatus
} from './CartSagas';

import {
  searchProduct,
  getMerchantDetail,
  getProduct
} from './ProductSagas';

import { all, takeLatest } from 'redux-saga/effects';
import {
  changePassword,
  forgotPassword,
  forgotVerifyPassword,
  getUserAddress,
  getLaunchData,
  getUserInfo,
  login,
  logout,
  register, updateUserProfile
} from './AuthSagas';

import {
  addAddress,
  addCard,
  deleteAddress,
  deleteCard,
  editAddress,
  setDefaultAddress,
  getAddresses,
  getCards,
  getAddressList
} from './CustomerSagas';

import { getOrders } from './OrdersSagas';

import { OrderTypes } from '../redux/OrderRedux';
import { AuthTypes } from '../redux/AuthRedux';
import { CartTypes } from '../redux/CartRedux';
import { ProductTypes } from '../redux/ProductRedux';
import { StartupTypes } from '../redux/StartupRedux';
import { CustomerTypes } from '../redux/CustomerRedux';
import { startup } from './StartupSagas';
import { getProductsListViewProducts } from './ProductListViewSagas';
import { ProductListViewTypes } from '../redux/ProductListViewRedux';

/* ------------- Types ------------- */


/* ------------- Sagas ------------- */


/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
export const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP_REQUEST, startup, api),

    // auth
    takeLatest(AuthTypes.LOGIN_REQUEST, login, api),
    takeLatest(AuthTypes.REGISTER_REQUEST, register, api),
    takeLatest(AuthTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api),
    takeLatest(AuthTypes.FORGOT_VERIFY_PASSWORD_REQUEST, forgotVerifyPassword, api),
    takeLatest(AuthTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),
    takeLatest(AuthTypes.UPDATE_USER_PROFILE_REQUEST, updateUserProfile, api),
    takeLatest(AuthTypes.GET_USER_INFO, getUserInfo, api),
    takeLatest(AuthTypes.LOGOUT, logout, api),
    takeLatest(AuthTypes.LOGOUT, startup, api),
    takeLatest(AuthTypes.GET_USER_ADDRESS, getUserAddress, api),
    takeLatest(AuthTypes.GET_LAUNCH_DATA_REQUEST, getLaunchData, api),
    // cart
    takeLatest(CartTypes.GET_CART, getCart, api),
    takeLatest(CartTypes.EMPTY_CART, emptyCart, api),
    takeLatest(CartTypes.ADD_PRODUCT_TO_CART, addProductToCart, api),
    takeLatest(CartTypes.REMOVE_PRODUCT_FROM_CART, removeProductFromCart, api),
    takeLatest(CartTypes.SET_CART_DETAIL, setCartDetail, api),
    takeLatest(CartTypes.EDIT_CART, editCart, api),
    takeLatest(CartTypes.APPLY_PROMO_CODE_REQUEST, applyPromoCode, api),
    takeLatest(CartTypes.CHECKOUT_REQUEST, checkout, api),
    takeLatest(CartTypes.CHECK_CHECKOUT_STATUS_REQUEST, checkCheckoutStatus, api),
    takeLatest(CartTypes.GET_CART_DELIVERY_DATES, getCartDeliveryDates, api),

    //product
    takeLatest(ProductTypes.SEARCH, searchProduct, api),
    takeLatest(ProductTypes.GET_MERCHANT_DETAIL, getMerchantDetail, api),
    takeLatest(ProductTypes.GET_PRODUCT, getProduct, api),

    // Product list view
    takeLatest(ProductListViewTypes.GET_PRODUCTS_REQUEST, getProductsListViewProducts, api),

    // order
    takeLatest(OrderTypes.GET_ORDERS_REQUEST, getOrders, api),

    // customer
    takeLatest(CustomerTypes.GET_ADDRESS_LIST_REQUEST, getAddressList, api),
    takeLatest(CustomerTypes.GET_ADDRESSES_REQUEST, getAddresses, api),
    takeLatest(CustomerTypes.DELETE_ADDRESS_REQUEST, deleteAddress, api),
    takeLatest(CustomerTypes.ADD_ADDRESS_REQUEST, addAddress, api),
    takeLatest(CustomerTypes.EDIT_ADDRESS_REQUEST, editAddress, api),
    takeLatest(CustomerTypes.SET_DEFAULT_ADDRESS_REQUEST, setDefaultAddress, api),
    takeLatest(CustomerTypes.GET_CARDS_REQUEST, getCards, api),
    takeLatest(CustomerTypes.ADD_CARD_REQUEST, addCard, api),
    takeLatest(CustomerTypes.DELETE_CARD_REQUEST, deleteCard, api)
  ]);
}
