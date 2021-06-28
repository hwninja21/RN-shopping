import { call, put } from 'redux-saga/effects'

import AuthActions from '../redux/AuthRedux'
import CartActions from '../redux/CartRedux'
import AppSessionManager from '../components/AppSessionManager';
import OneSignal from 'react-native-onesignal';
import { Alert } from 'react-native';
import { getUserToken, saveUserTokenInfo, resetUserInfo } from '../components';
import { getErrorMessageFromResponse } from '../services/Helpers';
import { configureSentryUser } from '../config';

export function * login (api, {form}) {
  const response = yield call(api.login, form);

  // success?
  if (response.ok) {

    try {
      const { User, Token } = response.data;

      // Set the user in onesignal
      OneSignal.sendTags({
        'user_id': User.id,
        'user_email': User.email,
        'experience_id': User['experience_id']
      });

      // Set the user in sentry
      configureSentryUser(User);

      yield AppSessionManager.shared().updateSessionToken(Token);
      yield saveUserTokenInfo({ token: Token, User });

      yield put(AuthActions.loginSuccess(response.data));
      api.setHeader('Authorization', `Bearer ${Token}`);
      yield put(CartActions.getCart())
    } catch (e) {
      yield put(AuthActions.loginFailure(e));
      setTimeout(() => {
        Alert.alert('Error', 'There was an error while logging you in. Please try again');
      }, 300)
    }

  } else {
    yield put(AuthActions.loginFailure(response));
    setTimeout(() => {
      Alert.alert('Error', 'Login Failed - Please try again with valid credentials')
    }, 300)

  }
}

export function* logout() {
  OneSignal.deleteTag('user_id');
  OneSignal.deleteTag('user_email');
  OneSignal.deleteTag('experience_id');
  yield resetUserInfo();
}


export function* register(api, { form }) {
  const response = yield call(api.register, form)

  if (response.ok) {
    yield put(AuthActions.registerSuccess(response.data))
    yield put(AuthActions.loginRequest(form))
  } else {
    yield put(AuthActions.registerFailure())

    setTimeout(() => {
      alert(response.data && response.data.alert && response.data.alert.message || 'Error - please try again later');
    }, 200)
  }
}

export function* forgotPassword(api, { form }) {
  const response = yield call(api.forgotPassword, form)

  if (response.ok) {
    yield put(AuthActions.forgotPasswordSuccess(response.data))
  } else {
    yield put(AuthActions.forgotPasswordFailure())

    setTimeout(() => {
      alert(getErrorMessageFromResponse(response, 'Invalid email address'));
    }, 200)
  }
}

export function* forgotVerifyPassword(api, { form }) {
  const response = yield call(api.forgotVerifyPassword, form)

  if (response.ok) {
    const data = response.data;

    if (data.status === 'success') {
      yield put(AuthActions.forgotVerifyPasswordSuccess({
        message: response.data.message || 'Your password was reset successfully'
      }))
    } else {
      yield put(AuthActions.forgotPasswordFailure(response));

      setTimeout(() => {
        alert(getErrorMessageFromResponse(response));
      }, 200)
    }
  } else {
    yield put(AuthActions.forgotPasswordFailure(response));

    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* changePassword(api, { form }) {
  const response = yield call(api.changePassword, form);

  if (response.ok) {
    if (response.data.User) {
      yield put(AuthActions.changePasswordSuccess());
    } else {
      yield put(AuthActions.changePasswordFailure(response));

      setTimeout(() => {
        alert(getErrorMessageFromResponse(response));
      }, 200)
    }
  } else {
    yield put(AuthActions.changePasswordFailure(response));

    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}

export function* updateUserProfile(api, { form }) {
  const response = yield call(api.updateUserProfile, form);

  if (response.ok && response.data.User) {
    yield put(AuthActions.updateUserProfileSuccess());
  } else {
    yield put(AuthActions.updateUserProfileFailure(response));

    setTimeout(() => {
      alert(getErrorMessageFromResponse(response));
    }, 200)
  }
}


export function * getUserInfo (api) {
  const response = yield call(api.userInfo)

  // success?
  if (response.ok) {
    yield put(AuthActions.getUserInfoSuccess(response.data))
  } else {
    yield put(AuthActions.getUserInfoFailure())
  }
}

export function * getUserAddress (api) {
  console.log('function * getUserAddress');
  const response = yield call(api.userAddresses)

  // success?
  if (response.ok) {
    yield put(AuthActions.getUserAddressSuccess(response.data))
  } else {
    yield put(AuthActions.getUserAddressFailure(response.data))
  }
}
export function * getLaunchData (api) {
  const response = yield call(api.launch);

  const token = yield getUserToken();

  if (token) {
    api.setHeader('Authorization', `Bearer ${token}`);
  }

  // success?
  if (response.ok) {
    yield put(AuthActions.getLaunchDataSuccess(response.data))
  } else {
    yield put(AuthActions.getLaunchDataFailure(response))
  }
}
