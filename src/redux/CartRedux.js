import { createActions, createReducer } from 'reduxsauce'

import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCart: null,
  getCartSuccess: ['response'],
  getCartFailure: ['response'],
  addProductToCart: ['form'],
  addProductToCartSuccess: ['response'],
  addProductToCartFailure: ['response'],
  removeProductFromCart: ['form'],
  removeProductFromCartSuccess: ['response'],
  removeProductFromCartFailure: ['response'],
  emptyCart: ['form'],
  emptyCartSuccess: ['response'],
  emptyCartFailure: ['response'],
  applyPromoCodeRequest: ['form'],
  applyPromoCodeSuccess: ['response'],
  applyPromoCodeFailure: ['error'],
  checkoutRequest: ['params'],
  checkoutSuccess: ['response'],
  checkoutFailure: ['error'],
  checkCheckoutStatusRequest: ['cartId'],
  checkCheckoutStatusSuccess: ['response'],
  checkCheckoutStatusFailure: ['error'],
  editCart: ['form'],
  editCartSuccess: ['response'],
  editCartFailure: ['response'],
  setCartDetail: ['products'],
  setCartDetailSuccess: ['cartDetail'],
  resetCartDetail: null,
  getCartDeliveryDates: null,
  getCartDeliveryDatesSuccess: ['response'],
  getCartDeliveryDatesFailure: ['response'],
  logout: null
});

export const CartTypes = Types;
export default Creators

const cartDetailInitialState = {
  deliveryFee: 0,
  grandTotal: 0,
  subTotal: 0,
  card_id: '0',
  delivery_fee: {}
};

export const INITIAL_STATE = Immutable({
  fetching: false,
  posting: false,
  cart: null,
  error: null,
  cartDetail: cartDetailInitialState,
  deliveryDates: [],
  isApplyingPromoCode: false,
  isCheckingOut: false,
  checkoutResponse: null,
  checkoutError: null,
  isCheckingCheckoutStatus: false,
  checkoutStatus: {}
});

export const getCartSuccess = (state, { response }) => state.merge({ fetching: false, error: null, cart: response.Cart })

export const addProductToCartSuccess = (state, { response }) => state.merge({ posting: false, error: null, cart: response.Cart })
export const setCartDetail = (state, { cartDetail }) => state.merge({ cartDetail })
export const resetCartDetail = (state) => state.merge({ cartDetail: cartDetailInitialState })
export const setCartDeliveryDates = (state, { response }) => state.merge({ fetching: false, deliveryDates: response.dates })


export const postRequest = (state) => state.merge({ posting: true, error: null })
export const postSuccess = (state) => state.merge({ posting: false, error: null})
export const postFailure = (state, { response }) => state.merge({posting: false, error: response})
export const request = (state) => state.merge({ fetching: true, error: null })
export const success = (state) => state.merge({ fetching: false, error: null})
export const failure = (state, { response }) => state.merge({fetching: false, error: response})
export const logout = () => INITIAL_STATE

export const doNothing = state => state


const applyPromoCodeRequest = state => state.merge({ isApplyingPromoCode: true });
const applyPromoCodeSuccess = state => state.merge({ isApplyingPromoCode: false });
const applyPromoCodeFailure = state => state.merge({ isApplyingPromoCode: false });

const checkoutRequest = state => state.merge({ isCheckingOut: true, checkoutResponse: null, checkoutError: null });
const checkoutSuccess = (state, { response }) => state.merge({ isCheckingOut: false, checkoutResponse: response });
const checkoutFailure = (state, { error }) => state.merge({ isCheckingOut: false, checkoutError: error });

const checkCheckoutStatusRequest = state => state.merge({ isCheckingCheckoutStatus: true, checkoutStatus: {} });
const checkCheckoutStatusSuccess = state => state.merge({
  isCheckingCheckoutStatus: false,
  checkoutStatus: {
    isSuccess: true
  }
});
const checkCheckoutStatusFailure = (state, { errorMessage }) => state.merge({
  isCheckingCheckoutStatus: false,
  checkoutStatus: {
    isSuccess: false,
    isError: true,
    errorMessage
  }
});


export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CART]: request,
  [Types.GET_CART_SUCCESS]: getCartSuccess,
  [Types.GET_CART_FAILURE]: failure,
  [Types.ADD_PRODUCT_TO_CART]: postRequest,
  [Types.ADD_PRODUCT_TO_CART_SUCCESS]: addProductToCartSuccess,
  [Types.ADD_PRODUCT_TO_CART_FAILURE]: postFailure,
  [Types.REMOVE_PRODUCT_FROM_CART]: postRequest,
  [Types.REMOVE_PRODUCT_FROM_CART_SUCCESS]: addProductToCartSuccess,
  [Types.REMOVE_PRODUCT_FROM_CART_FAILURE]: postFailure,
  [Types.EMPTY_CART]: postRequest,
  [Types.EMPTY_CART_SUCCESS]: addProductToCartSuccess,
  [Types.EMPTY_CART_FAILURE]: postFailure,
  [Types.EDIT_CART]: postRequest,
  [Types.EDIT_CART_SUCCESS]: addProductToCartSuccess,
  [Types.EDIT_CART_FAILURE]: postFailure,
  [Types.APPLY_PROMO_CODE_REQUEST]: applyPromoCodeRequest,
  [Types.APPLY_PROMO_CODE_SUCCESS]: applyPromoCodeSuccess,
  [Types.APPLY_PROMO_CODE_FAILURE]: applyPromoCodeFailure,
  [Types.CHECKOUT_REQUEST]: checkoutRequest,
  [Types.CHECKOUT_SUCCESS]: checkoutSuccess,
  [Types.CHECKOUT_FAILURE]: checkoutFailure,
  [Types.CHECK_CHECKOUT_STATUS_REQUEST]: checkCheckoutStatusRequest,
  [Types.CHECK_CHECKOUT_STATUS_SUCCESS]: checkCheckoutStatusSuccess,
  [Types.CHECK_CHECKOUT_STATUS_FAILURE]: checkCheckoutStatusFailure,
  [Types.SET_CART_DETAIL]: doNothing,
  [Types.SET_CART_DETAIL_SUCCESS]: setCartDetail,
  [Types.RESET_CART_DETAIL]: resetCartDetail,
  [Types.GET_CART_DELIVERY_DATES]: request,
  [Types.GET_CART_DELIVERY_DATES_SUCCESS]: setCartDeliveryDates,
  [Types.GET_CART_DELIVERY_DATES_FAILURE]: postFailure,
  [Types.LOGOUT]: logout
})
