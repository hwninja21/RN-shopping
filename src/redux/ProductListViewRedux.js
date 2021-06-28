import { createActions, createReducer } from 'reduxsauce'

import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProductsRequest: ['form'],
  getProductsSuccess: ['response'],
  getProductsFailure: ['error']
});

export const ProductListViewTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  currentPage: null,
  error: null,
  products: [],
  header: null
});


const getProductsRequest = state => state.merge({ fetching: true, error: null });
const getProductsSuccess = (state, { response }) => {
  return state.merge({
    fetching: false,
    products: response.Products,
    header: response.Header && response.Header[0]
  });
};
const getProductsFailure = (state, { error }) => state.merge({ fetching: false, error });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PRODUCTS_REQUEST]: getProductsRequest,
  [Types.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [Types.GET_PRODUCTS_FAILURE]: getProductsFailure,
});
