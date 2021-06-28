import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { set } from 'ramda';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  // Addresses
  getAddressListRequest: null,
  getAddressListSuccess: ['response'],
  getAddressListFailure: ['response'],
  getAddressesRequest: ['page', 'itemsPerPage'],
  getAddressesSuccess: ['response'],
  getAddressesFailure: ['response'],
  deleteAddressRequest: ['addressId'],
  deleteAddressSuccess: ['deletedAddressId'],
  deleteAddressFailure: ['response'],
  addAddressRequest: ['form'],
  addAddressSuccess: ['addedAddress'],
  addAddressFailure: ['response'],
  editAddressRequest: ['addressId', 'data'],
  editAddressSuccess: ['editedAddress'],
  editAddressFailure: ['response'],
  setDefaultAddressRequest: ['address'],
  setDefaultAddressSuccess: ['addressId'],
  setDefaultAddressFailure: null,

  // Cards
  getCardsRequest: null,
  getCardsSuccess: ['cards'],
  getCardsFailure: ['response'],
  addCardRequest: ['data'],
  addCardSuccess: ['card'],
  addCardFailure: ['response'],
  deleteCardRequest: ['cardId'],
  deleteCardSuccess: ['deletedCardId'],
  deleteCardFailure: ['response']
});

export const CustomerTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  error: null,
  posting: false,
  deleting: false,
  deletedAddressId: null,
  addedAddress: null,
  editedAddress: null,
  addresses: [],
  defaultAddressId: null,
  deletedCardId: null,
  cards: []
});

// Addresses
export const getAddressListSuccess = (state, { response }) => {
  return state.merge({
    fetching: false,
    addresses: response,
    defaultAddressId: Array.isArray(response) ? (response.find(address => address['is_default'] === 1) || {}).id : null
  });
};
export const getAddressesSuccess = (state, { response }) => state.merge({ fetching: false, addresses: response });
export const deleteAddressSuccess = (state, { deletedAddressId }) => state.merge({ deleting: false, deletedAddressId });
export const addAddressSuccess = (state, { addedAddress }) => state.merge({ posting: false, addedAddress });
export const editAddressSuccess = (state, { editedAddress }) => state.merge({
  posting: false,
  addresses: Array.isArray(state.addresses) ?
    state.addresses.map(address => address.id !== editedAddress.id ? address : editedAddress) : state.addresses,
  defaultAddressId: editedAddress['is_default'] ? editedAddress.id : state.defaultAddressId,
  editedAddress
});

// Cards
export const getCardsSuccess = (state, { cards }) => state.merge({ fetching: false, cards });
export const deleteCardSuccess = (state, { deletedCardId }) => state.merge({ deleting: false, deletedCardId });

export const deleteRequest = state => state.merge({ deleting: true, error: null });
export const deleteFailure = (state, { response }) => state.merge({ deleting: false, error: response });
export const postRequest = state => state.merge({ posting: true, error: null });
export const postSuccess = state => state.merge({ posting: false, error: null });
export const postFailure = (state, { response }) => state.merge({ posting: false, error: response });
//const success = state => state.merge({ fetching: false, error: null });
export const request = state => state.merge({ fetching: true, error: null});
export const failure = (state, { response }) => state.merge({ fetching: false, error: response });

export const setDefaultAddressSuccess = (state, { addressId }) => state.merge({
  defaultAddressId: addressId,
  addresses: Array.isArray(state.addresses) ?
    state.addresses.map(address => ({...address, is_default: addressId === address.id ? 1 : 0})) : state.addresses,
  posting: false
});

export const reducer = createReducer(INITIAL_STATE, {
  // Addresses
  [Types.GET_ADDRESS_LIST_REQUEST]: request,
  [Types.GET_ADDRESS_LIST_FAILURE]: failure,
  [Types.GET_ADDRESS_LIST_SUCCESS]: getAddressListSuccess,

  [Types.GET_ADDRESSES_REQUEST]: request,
  [Types.GET_ADDRESSES_FAILURE]: failure,
  [Types.GET_ADDRESSES_SUCCESS]: getAddressListSuccess,

  [Types.DELETE_ADDRESS_REQUEST]: deleteRequest,
  [Types.DELETE_ADDRESS_FAILURE]: deleteFailure,
  [Types.DELETE_ADDRESS_SUCCESS]: deleteAddressSuccess,

  [Types.ADD_ADDRESS_REQUEST]: postRequest,
  [Types.ADD_ADDRESS_FAILURE]: postFailure,
  [Types.ADD_ADDRESS_SUCCESS]: addAddressSuccess,

  [Types.EDIT_ADDRESS_REQUEST]: postRequest,
  [Types.EDIT_ADDRESS_FAILURE]: postFailure,
  [Types.EDIT_ADDRESS_SUCCESS]: editAddressSuccess,

  [Types.SET_DEFAULT_ADDRESS_REQUEST]: postRequest,
  [Types.SET_DEFAULT_ADDRESS_SUCCESS]: setDefaultAddressSuccess,
  [Types.SET_DEFAULT_ADDRESS_FAILURE]: postFailure,

  // Cards
  [Types.GET_CARDS_REQUEST]: request,
  [Types.GET_CARDS_FAILURE]: failure,
  [Types.GET_CARDS_SUCCESS]: getCardsSuccess,
  [Types.ADD_CARD_REQUEST]: postRequest,
  [Types.ADD_CARD_FAILURE]: postFailure,
  [Types.ADD_CARD_SUCCESS]: postSuccess,
  [Types.DELETE_CARD_REQUEST]: deleteRequest,
  [Types.DELETE_CARD_FAILURE]: deleteFailure,
  [Types.DELETE_CARD_SUCCESS]: deleteCardSuccess
});
