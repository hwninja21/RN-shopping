import { createActions, createReducer } from 'reduxsauce';
import { StartupTypes } from './StartupRedux';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['form'],
  loginSuccess: ['response'],
  loginFailure: ['response'],
  registerRequest: ['form'],
  registerSuccess: ['response'],
  registerFailure: ['response'],
  forgotPasswordRequest: ['form'],
  forgotPasswordSuccess: ['response'],
  forgotPasswordFailure: ['response'],
  forgotVerifyPasswordRequest: ['form'],
  forgotVerifyPasswordSuccess: ['response'],
  forgotVerifyPasswordFailure: ['response'],
  updateUserProfileRequest: ['form'],
  updateUserProfileSuccess: ['response'],
  updateUserProfileFailure: ['response'],
  changePasswordRequest: ['form'],
  changePasswordSuccess: ['response'],
  changePasswordFailure: ['response'],
  getUserInfo: null,
  getUserInfoSuccess: ['response'],
  getUserInfoFailure: ['response'],
  getUserAddress: ['form'],
  getUserAddressSuccess: ['response'],
  getUserAddressFailure: ['response'],
  authFailure: null,
  logout: null,
  getLaunchDataRequest: null,
  getLaunchDataSuccess: ['response'],
  getLaunchDataFailure: ['response'],
  resetExperienceID: ['response']
});

export const AuthTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  token: null,
  user: null,
  error: null,
  posting: false,
  addresses: [],
  forgotPasswordCode: null
});

export const loginSuccess = (state, { response }) =>
  state.merge({
    posting: false,
    error: null,
    token: response.Token,
    user: response.User
  });
export const forgotPasswordSuccess = (state, { response }) =>
  state.merge({ posting: false, forgotPasswordCode: response.code });

export const forgotVerifyPasswordSuccess = (state, { response }) =>
  state.merge({ posting: false, forgotVerifyPasswordMessage: response.message });

export const getUserInfoSuccess = (state, { response }) => state.merge({ fetching: false, error: null, user: response.User })

export const getAddressSuccess = (state, { response }) => state.merge({ address: response.Addresses });


export const postRequest = state => state.merge({ posting: true, error: null });
export const postSuccess = state =>
  state.merge({ posting: false, error: null });
export const postFailure = (state, { response }) =>
  state.merge({ posting: false, error: response });
export const request = state => state.merge({ fetching: true, error: null});
export const success = state => state.merge({ fetching: false, error: null });
export const failure = (state, { response }) => state.merge({ fetching: false, error: response });
export const logout = state => INITIAL_STATE;
export const getLaunchDataSuccess = (state, { response }) => state.merge({ launchData: response });

export const resetExperienceID = (state, { response }) =>
  state.merge({ user: response });
  
const startupRequestSuccess = (state, { response }) => state.merge({ user: response.User });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: postRequest,
  [Types.LOGIN_FAILURE]: postFailure,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.REGISTER_REQUEST]: postRequest,
  [Types.REGISTER_FAILURE]: postFailure,
  [Types.REGISTER_SUCCESS]: postSuccess,
  [Types.FORGOT_PASSWORD_REQUEST]: postRequest,
  [Types.FORGOT_PASSWORD_FAILURE]: postFailure,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_VERIFY_PASSWORD_REQUEST]: postRequest,
  [Types.FORGOT_VERIFY_PASSWORD_FAILURE]: postFailure,
  [Types.FORGOT_VERIFY_PASSWORD_SUCCESS]: forgotVerifyPasswordSuccess,
  [Types.UPDATE_USER_PROFILE_REQUEST]: postRequest,
  [Types.UPDATE_USER_PROFILE_FAILURE]: postFailure,
  [Types.UPDATE_USER_PROFILE_SUCCESS]: postSuccess,
  [Types.CHANGE_PASSWORD_REQUEST]: postRequest,
  [Types.CHANGE_PASSWORD_FAILURE]: postFailure,
  [Types.CHANGE_PASSWORD_SUCCESS]: postSuccess,
  [Types.GET_USER_INFO]: request,
  [Types.GET_USER_INFO_SUCCESS]: getUserInfoSuccess,
  [Types.GET_USER_INFO_FAILURE]: failure,
  [Types.GET_USER_ADDRESS]: request,
  [Types.GET_USER_ADDRESS_SUCCESS]: getAddressSuccess,
  [Types.GET_USER_ADDRESS_FAILURE]: failure,
  [Types.AUTH_FAILURE]: failure,
  [Types.LOGOUT]: logout,
  [Types.GET_LAUNCH_DATA_REQUEST]: request,
  [Types.GET_LAUNCH_DATA_SUCCESS]: getLaunchDataSuccess,
  [Types.GET_LAUNCH_DATA_FAILURE]: failure,
  [StartupTypes.STARTUP_SUCCESS]: startupRequestSuccess,
  [Types.RESET_EXPERIENCE_ID]: resetExperienceID,
});
