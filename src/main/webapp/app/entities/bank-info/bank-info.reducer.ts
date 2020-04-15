import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBankInfo, defaultValue } from 'app/shared/model/bank-info.model';

export const ACTION_TYPES = {
  SEARCH_BANKINFOS: 'bankInfo/SEARCH_BANKINFOS',
  FETCH_BANKINFO_LIST: 'bankInfo/FETCH_BANKINFO_LIST',
  FETCH_BANKINFO: 'bankInfo/FETCH_BANKINFO',
  CREATE_BANKINFO: 'bankInfo/CREATE_BANKINFO',
  UPDATE_BANKINFO: 'bankInfo/UPDATE_BANKINFO',
  DELETE_BANKINFO: 'bankInfo/DELETE_BANKINFO',
  SET_BLOB: 'bankInfo/SET_BLOB',
  RESET: 'bankInfo/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBankInfo>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type BankInfoState = Readonly<typeof initialState>;

// Reducer

export default (state: BankInfoState = initialState, action): BankInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_BANKINFOS):
    case REQUEST(ACTION_TYPES.FETCH_BANKINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BANKINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BANKINFO):
    case REQUEST(ACTION_TYPES.UPDATE_BANKINFO):
    case REQUEST(ACTION_TYPES.DELETE_BANKINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_BANKINFOS):
    case FAILURE(ACTION_TYPES.FETCH_BANKINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BANKINFO):
    case FAILURE(ACTION_TYPES.CREATE_BANKINFO):
    case FAILURE(ACTION_TYPES.UPDATE_BANKINFO):
    case FAILURE(ACTION_TYPES.DELETE_BANKINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_BANKINFOS):
    case SUCCESS(ACTION_TYPES.FETCH_BANKINFO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_BANKINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BANKINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_BANKINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BANKINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/bank-infos';
const apiSearchUrl = 'api/_search/bank-infos';

// Actions

export const getSearchEntities: ICrudSearchAction<IBankInfo> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_BANKINFOS,
  payload: axios.get<IBankInfo>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IBankInfo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_BANKINFO_LIST,
    payload: axios.get<IBankInfo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IBankInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BANKINFO,
    payload: axios.get<IBankInfo>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBankInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BANKINFO,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBankInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BANKINFO,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBankInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BANKINFO,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
