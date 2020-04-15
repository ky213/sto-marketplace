import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserSetting, defaultValue } from 'app/shared/model/user-setting.model';

export const ACTION_TYPES = {
  SEARCH_USERSETTINGS: 'userSetting/SEARCH_USERSETTINGS',
  FETCH_USERSETTING_LIST: 'userSetting/FETCH_USERSETTING_LIST',
  FETCH_USERSETTING: 'userSetting/FETCH_USERSETTING',
  CREATE_USERSETTING: 'userSetting/CREATE_USERSETTING',
  UPDATE_USERSETTING: 'userSetting/UPDATE_USERSETTING',
  DELETE_USERSETTING: 'userSetting/DELETE_USERSETTING',
  RESET: 'userSetting/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserSetting>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type UserSettingState = Readonly<typeof initialState>;

// Reducer

export default (state: UserSettingState = initialState, action): UserSettingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_USERSETTINGS):
    case REQUEST(ACTION_TYPES.FETCH_USERSETTING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERSETTING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_USERSETTING):
    case REQUEST(ACTION_TYPES.UPDATE_USERSETTING):
    case REQUEST(ACTION_TYPES.DELETE_USERSETTING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_USERSETTINGS):
    case FAILURE(ACTION_TYPES.FETCH_USERSETTING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERSETTING):
    case FAILURE(ACTION_TYPES.CREATE_USERSETTING):
    case FAILURE(ACTION_TYPES.UPDATE_USERSETTING):
    case FAILURE(ACTION_TYPES.DELETE_USERSETTING):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_USERSETTINGS):
    case SUCCESS(ACTION_TYPES.FETCH_USERSETTING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERSETTING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERSETTING):
    case SUCCESS(ACTION_TYPES.UPDATE_USERSETTING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERSETTING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/user-settings';
const apiSearchUrl = 'api/_search/user-settings';

// Actions

export const getSearchEntities: ICrudSearchAction<IUserSetting> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_USERSETTINGS,
  payload: axios.get<IUserSetting>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IUserSetting> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERSETTING_LIST,
    payload: axios.get<IUserSetting>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IUserSetting> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERSETTING,
    payload: axios.get<IUserSetting>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IUserSetting> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERSETTING,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUserSetting> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERSETTING,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserSetting> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERSETTING,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
