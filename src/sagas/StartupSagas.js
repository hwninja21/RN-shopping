import { put, call } from 'redux-saga/effects'
import StartupActions from '../redux/StartupRedux'
import ConfigurationActions from '../redux/ConfigurationRedux'
import CartActions from '../redux/CartRedux'
import AppSessionManager from '../components/AppSessionManager'
import { getUserToken, NoInternetAlert } from '../components'
import { configureSentryUser } from '../config';


// process STARTUP actions
export function * startup (api, action) {
  const token = yield getUserToken();

  if (token !== null) {
    api.setHeader('Authorization', 'Bearer ' + token)
    AppSessionManager.shared().updateSessionToken(token);
  }
  const response = yield call(api.launch)

  // success?
  if (response.ok) {
    yield put(StartupActions.startupSuccess(response.data))
    yield put(ConfigurationActions.setConfiguration(response.data))

    const user = response.data.User;

    if (user) {
      configureSentryUser(user);
    }

    if (token) {
      yield put(CartActions.getCart())
    }
  } else {
    yield put(StartupActions.startupFailure(response.data))
    yield put(ConfigurationActions.resetConfiguration(response.data))
    NoInternetAlert()
  }
}
