import { call, put, select } from 'redux-saga/effects';

import CartActions from '../redux/CartRedux';
import ProductActions from '../redux/ProductRedux';
import { is } from 'ramda';

export function* searchProduct(api, { form }) {
  const response = yield call(api.searchProduct,form);

  // success?
  if (response.ok) {
    yield put(ProductActions.setProductList(response.data))
  } else {
    yield put(ProductActions.getProductFailure(response.data));
  }
}

export function* getMerchantDetail(api, { form }) {
  const response = yield call(api.getMerchantDetail, form);

  // success?
  if (response.ok) {
    yield put(ProductActions.setMerchantDetail(response.data))
  } else {
    yield put(ProductActions.getProductFailure(response.data));
  }
}

export function* getProduct(api, {form}) {
  const response = yield call(api.getProduct, form);

  // success?
  if (response && response.ok) {
    yield put(ProductActions.setProduct(response.data, form.page))
  } else {
    yield put(ProductActions.getProductFailure(response.data));
  }
}
