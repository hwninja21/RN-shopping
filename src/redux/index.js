import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../sagas'
import ReduxPersist from '../config/ReduxPersist'
import LogReducer from './LogReducer';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  startup: require('./StartupRedux').reducer,
  configuration: require('./ConfigurationRedux').reducer,
  auth: require('./AuthRedux').reducer,
  cart: require('./CartRedux').reducer,
  products:require('./ProductRedux').reducer,
  merchantDetail:require('./ProductRedux').reducer,
  detailProducts:require('./ProductRedux').reducer,
  productHeader:require('./ProductRedux').reducer,
  orders: require('./OrderRedux').reducer,
  customer: require('./CustomerRedux').reducer,
  productListView: require('./ProductListViewRedux').reducer,
  log: LogReducer
});

export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig;
    // @ts-ignore
    finalReducers = persistReducer(persistConfig, reducers)
  }

  let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga);

  if (module.hot) {
    // @ts-ignore
    module.hot.accept(() => {
      store.replaceReducer(require('.').reducers);

      const newYieldedSagas = require('../sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas)
      })
    })
  }

  return store
}
