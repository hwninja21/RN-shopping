import OrdersActions from '../redux/OrderRedux';
import { call, put } from 'redux-saga/effects'
import { getErrorMessageFromResponse } from '../services/Helpers';

export function* getOrders(api, { page, itemsPerPage }) {
  console.info('get orders page per page', page, itemsPerPage);

  const response = yield call(api.getOrders, page, itemsPerPage);

  console.info('get orders response', response);

  if (response.ok && response.data.Orders) {
    yield put(OrdersActions.getOrdersSuccess(response.data.Orders));
  } else {
    yield put(OrdersActions.getOrdersFailure());
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}
