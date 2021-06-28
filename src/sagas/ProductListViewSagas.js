import { call, put, select } from 'redux-saga/effects';

import ProductListViewRedux from '../redux/ProductListViewRedux';

export function* getProductsListViewProducts(api, { form }) {
  const response = yield call(api.getProductListViewProducts, form);

  // success?
  if (response.ok) {
    yield put(ProductListViewRedux.getProductsSuccess(response.data))
  } else {
    yield put(ProductListViewRedux.getProductsFailure(response.data));
  }
}
