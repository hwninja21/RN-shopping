import { call, put, select } from 'redux-saga/effects';

import CartActions from '../redux/CartRedux';
import { getErrorMessageFromResponse } from '../services/Helpers';

export function* getCart(api, action) {
  const response = yield call(api.cart);

  // success?
  if (response.ok) {
    yield put(CartActions.getCartSuccess(response.data));
    yield put(CartActions.setCartDetail(response.data.Cart.products))
  } else {
    yield put(CartActions.getCartFailure(response.data));
  }
}

export function* addProductToCart(api, { form }) {
  const response = yield call(api.addCartItem, form);

  // success?
  if (response.ok) {
    yield put(CartActions.addProductToCartSuccess(response.data));
    yield put(CartActions.setCartDetail(response.data.Cart.products))
  } else {
    yield put(CartActions.addProductToCartFailure(response.data));
  }
}

export function* removeProductFromCart(api, { form }) {
  const response = yield call(api.removeCartItem, form);

  // success?
  if (response.ok) {
    yield put(CartActions.removeProductFromCartSuccess(response.data));
    yield put(CartActions.setCartDetail(response.data.Cart.products))
  } else {
    yield put(CartActions.removeProductFromCartFailure(response.data));
  }
}

export function* emptyCart(api, { form }) {
  const response = yield call(api.emptyCart, form);

  // success?
  if (response.ok) {
    yield put(CartActions.emptyCartSuccess(response.data));
  } else {
    yield put(CartActions.emptyCartFailure(response.data));
  }
}

export function* editCart(api, { form }) {
  const response = yield call(api.editCart, form);

  // success?
  if (response.ok) {
    yield put(CartActions.editCartSuccess(response.data));
    yield put(CartActions.setCartDetail(response.data.Cart.products))
  } else {
    yield put(CartActions.emptyCartFailure(response.data));
  }
}

export function* applyPromoCode(api, { form }) {
  const response = yield call(api.applyPromoCode, form);
  if (response.ok && !response.data.error) {
    yield put(CartActions.getCart());
    yield put(CartActions.applyPromoCodeSuccess());
    alert('Promo code applied!');
  } else {
    alert((response.data && response.data.error) || 'Promo code not valid');
    yield put(CartActions.applyPromoCodeFailure());
  }
}

export function* checkout(api, { params }) {
  const response = yield call(api.checkout, params);
  if (response.ok) {
    yield put(CartActions.getCart());
    yield put(CartActions.checkoutSuccess(response));
  } else {
    alert(getErrorMessageFromResponse(response));
    yield put(CartActions.checkoutFailure(response));
  }
}

export function* checkCheckoutStatus(api, { cartId }) {
  const response = yield call(api.checkCheckoutStatus, cartId);

  console.info('checkout status response', response);

  if (response.ok && response.data && !response.data['Cart']) {
    yield put(CartActions.checkCheckoutStatusSuccess());
  } else {
    const { data } = response;

    yield put(CartActions.checkCheckoutStatusFailure(
      (data && data['Cart'] && data['Cart']['failure_message']) || 'Error, please try again later')
    );
  }
}

export function* setCartDetail(api, { products }) {
  let cartDetail = yield select(state => state.cart.cartDetail)
  var subTotalAmount = 0;

  for (let index = 0; index < products.length; index++) {
    const item = products[index];
    const amount = item.price;
    var totalItemAmount = Number(amount); // * item.quantity;
    let selectedOptions = item.options;
    if (Array.isArray(item.options) && item.options.length > 0) {
      totalItemAmount = item.finalPriceValue * item.quantity;
      subTotalAmount += totalItemAmount;
    } else {
      totalItemAmount = Number(amount) * item.quantity;
      subTotalAmount += totalItemAmount;
    }
  }

  var grandTotalAmount = (cartDetail.deliveryFee + subTotalAmount).toFixed(2);
  yield put(CartActions.setCartDetailSuccess({
    ...cartDetail,
    subTotal: subTotalAmount.toFixed(2),
    grandTotal: grandTotalAmount
  }))
}


export function* getCartDeliveryDates(api) {
  const response = yield call(api.getCartDeliveryDates);

  if (response.ok) {
    if (response.data && Array.isArray(response.data.Dates)) {
      yield put(CartActions.getCartDeliveryDatesSuccess({ dates: response.data.Dates}));
    } else {
      yield put(CartActions.getCartDeliveryDatesFailure(response.data));
    }
  } else {
    yield put(CartActions.getCartDeliveryDatesFailure(response.data));
  }
};
