import CustomerRedux from '../redux/CustomerRedux';
import { call, put } from 'redux-saga/effects'
import { getErrorMessageFromResponse } from '../services/Helpers';

export function* getAddressList(api) {
  const response = yield call(api.userAddresses);

  if (response.ok) {
    yield put(CustomerRedux.getAddressListSuccess(response.data.Addresses));
  } else {
    yield put(CustomerRedux.getAddressListFailure());
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* getAddresses(api, { page, itemsPerPage }) {
  const response = yield call(api.getAddresses, page, itemsPerPage);

  if (response.ok && response.data.Addresses) {
    yield put(CustomerRedux.getAddressesSuccess(response.data.Addresses));
  } else {
    yield put(CustomerRedux.getAddressesFailure());
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* deleteAddress(api, { addressId }) {
  const response = yield call(api.deleteAddress, addressId);

  if (response.ok) {
    yield put(CustomerRedux.deleteAddressSuccess(addressId));
  } else {
    yield put(CustomerRedux.deleteAddressFailure(response));
    setTimeout(() => alert(getErrorMessageFromResponse(response)), 200);
  }
}

export function* addAddress(api, { form }) {
  const response = yield call(api.addAddress, form);

  if (response.ok && response.data.Address) {
    yield put(CustomerRedux.addAddressSuccess(response.data.Address));
  } else {
    yield put(CustomerRedux.addAddressFailure(response));
    setTimeout(() => alert(getErrorMessageFromResponse(response)), 200);
  }
}


export function* editAddress(api, { addressId, data }) {
  const response = yield call(api.editAddress, addressId, data);

  if (response.ok && response.data.Address) {
    yield put(CustomerRedux.editAddressSuccess(response.data.Address));
  } else {
    yield put(CustomerRedux.editAddressFailure(response));
    setTimeout(() => alert(getErrorMessageFromResponse(response)), 200);
  }
}

export function* setDefaultAddress(api, { address }) {
  const response = yield call(api.editAddress, address.id, { ...address, 'is_default': 1 });

  if (response.ok && response.data.Address) {
    yield put(CustomerRedux.setDefaultAddressSuccess(address.id));
  } else {
    yield put(CustomerRedux.setDefaultAddressFailure(response));
    setTimeout(() => alert(getErrorMessageFromResponse(response)), 200);
  }
}

export function* getCards(api) {
  const response = yield call(api.getCards);

  if (response.ok && response.data.Cards) {
    yield put(CustomerRedux.getCardsSuccess(response.data.Cards));
  } else {
    yield put(CustomerRedux.getCardsFailure(response));
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* addCard(api, { data }) {
  const response = yield call(api.addCard, data);

  if (response.ok) {
    yield put(CustomerRedux.addCardSuccess());
  } else {
    yield put(CustomerRedux.addCardFailure(response));
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* deleteCard(api, { cardId }) {
  const response = yield call(api.deleteCard, cardId);

  if (response.ok) {
    yield put(CustomerRedux.deleteCardSuccess(cardId));
  } else {
    yield put(CustomerRedux.deleteCardFailure(response));
    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}
