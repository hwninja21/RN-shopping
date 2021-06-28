import { createActions, createReducer } from 'reduxsauce'

import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  search: ['form'],
  setProductList:['response'],
  getProductFailure: ['response'],
  clearSearch:null,
  getMerchantDetail: ['form'],
  setMerchantDetail:['response'],
  getProduct:['form'],
  setProduct:['response', 'currentPage']
})

export const ProductTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
    fetching: false,
    posting: false,
    error: null,
    products: null,
    merchantDetail: null,
    detailProducts: null,
    productHeader: null,
    currentPage: 0
});


export const request = (state) => state.merge({ fetching: true, error: null })

export const setProductList = (state, { response }) => state.merge({ fetching: false, error: null, products: response.Products})

export const getProductFailure = (state, { response }) => state.merge({ fetching: false, error: null, products: []})

export const clearSearch = (state) => state.merge({ fetching: false, error: null, products: []})

export const getMerchantDetail = (state) => state.merge({ fetching: true, error: null})

export const setMerchantDetail = (state, { response }) => state.merge({ fetching: false, error: null, merchantDetail: response})

export const getProduct = (state) => state.merge({ fetching: true, error: null, productHeader: null })

export const setProduct  = (state, { response, currentPage }) => state.merge({
  currentPage,
  fetching: false,
  error: null,
  detailProducts: response.Products,
  productHeader: response.Header[0]
});




export const reducer = createReducer(INITIAL_STATE, {
    [Types.SEARCH]: request,
    [Types.SET_PRODUCT_LIST]: setProductList,
    [Types.GET_PRODUCT_FAILURE]: getProductFailure,
    [Types.CLEAR_SEARCH]: clearSearch,
    [Types.GET_MERCHANT_DETAIL]: getMerchantDetail,
    [Types.SET_MERCHANT_DETAIL]: setMerchantDetail,
    [Types.GET_PRODUCT]: getProduct,
    [Types.SET_PRODUCT]: setProduct
})
