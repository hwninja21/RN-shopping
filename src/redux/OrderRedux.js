import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getOrdersRequest: ['page', 'itemsPerPage'],
  getOrdersSuccess: ['response'],
  getOrdersFailure: ['response']
});

export const OrderTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  error: null,
  posting: false,
  orders: []
});

const getOrdersSuccess = (state, { response }) => state.merge({ fetching: false, orders: response });

// const postRequest = state => state.merge({ posting: true, error: null });
// const postSuccess = state => state.merge({ posting: false, error: null });
// const postFailure = (state, { response }) => state.merge({ posting: false, error: response });
//const success = state => state.merge({ fetching: false, error: null });
const request = state => state.merge({ fetching: true, error: null});
const failure = (state, { response }) => state.merge({ fetching: false, error: response });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ORDERS_REQUEST]: request,
  [Types.GET_ORDERS_FAILURE]: failure,
  [Types.GET_ORDERS_SUCCESS]: getOrdersSuccess
});
