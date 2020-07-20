import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IHomeCustomer, defaultValue } from 'app/shared/model/home-customer.model';

export const ACTION_TYPES = {
  SEARCH_HOMECUSTOMERS: 'homeCustomer/SEARCH_HOMECUSTOMERS',
  FETCH_HOMECUSTOMER_LIST: 'homeCustomer/FETCH_HOMECUSTOMER_LIST',
  FETCH_HOMECUSTOMER: 'homeCustomer/FETCH_HOMECUSTOMER',
  FETCH_ASSET_ALLOCATION: 'homeCustomer/FETCH_ASSET_ALLOCATION',
  CREATE_HOMECUSTOMER: 'homeCustomer/CREATE_HOMECUSTOMER',
  UPDATE_HOMECUSTOMER: 'homeCustomer/UPDATE_HOMECUSTOMER',
  DELETE_HOMECUSTOMER: 'homeCustomer/DELETE_HOMECUSTOMER',
  RESET: 'homeCustomer/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IHomeCustomer>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  assetAllocation: {} as { [key: string]: number }
};

export type HomeCustomerState = Readonly<typeof initialState>;

// Reducer

export default (state: HomeCustomerState = initialState, action): HomeCustomerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_HOMECUSTOMERS):
    case REQUEST(ACTION_TYPES.FETCH_HOMECUSTOMER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_HOMECUSTOMER):
    case REQUEST(ACTION_TYPES.FETCH_ASSET_ALLOCATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_HOMECUSTOMER):
    case REQUEST(ACTION_TYPES.UPDATE_HOMECUSTOMER):
    case REQUEST(ACTION_TYPES.DELETE_HOMECUSTOMER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_HOMECUSTOMERS):
    case FAILURE(ACTION_TYPES.FETCH_HOMECUSTOMER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_HOMECUSTOMER):
    case FAILURE(ACTION_TYPES.FETCH_ASSET_ALLOCATION):
    case FAILURE(ACTION_TYPES.CREATE_HOMECUSTOMER):
    case FAILURE(ACTION_TYPES.UPDATE_HOMECUSTOMER):
    case FAILURE(ACTION_TYPES.DELETE_HOMECUSTOMER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_HOMECUSTOMERS):
    case SUCCESS(ACTION_TYPES.FETCH_HOMECUSTOMER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_HOMECUSTOMER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ASSET_ALLOCATION):
      return {
        ...state,
        loading: false,
        assetAllocation: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_HOMECUSTOMER):
    case SUCCESS(ACTION_TYPES.UPDATE_HOMECUSTOMER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_HOMECUSTOMER):
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

const apiUrl = 'api/home-customers';
const apiSearchUrl = 'api/_search/home-customers';

// Actions

export const getSearchEntities: ICrudSearchAction<IHomeCustomer> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_HOMECUSTOMERS,
  payload: axios.get<IHomeCustomer>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IHomeCustomer> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_HOMECUSTOMER_LIST,
    payload: axios.get<IHomeCustomer>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IHomeCustomer> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_HOMECUSTOMER,
    payload: axios.get<IHomeCustomer>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IHomeCustomer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_HOMECUSTOMER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IHomeCustomer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_HOMECUSTOMER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IHomeCustomer> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_HOMECUSTOMER,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const getAssetAllocation: any = () => {
  return {
    type: ACTION_TYPES.FETCH_ASSET_ALLOCATION,
    payload: axios.get<any>('/api/security-tokens/assets')
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
