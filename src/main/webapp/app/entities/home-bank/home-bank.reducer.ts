import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IHomeBank, defaultValue } from 'app/shared/model/home-bank.model';
import { IOrder } from 'app/shared/model/order.model';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';

export const ACTION_TYPES = {
  SEARCH_HOMEBANKS: 'homeBank/SEARCH_HOMEBANKS',
  FETCH_HOMEBANK_LIST: 'homeBank/FETCH_HOMEBANK_LIST',
  FETCH_HOMEBANK: 'homeBank/FETCH_HOMEBANK',
  FETCH_LAST_ORDERS: 'homeBank/FETCH_LAST_ORDERS',
  FETCH_USERS_BALANCE: 'homeBank/FETCH_USERS_BALANCE',
  FETCH_NUMBER_OF_USERS: 'homeBank/FETCH_NUMBER_OF_USERS',
  FETCH_TOTAL_REVENUE: 'homeBank/FETCH_TOTAL_REVENUE',
  FETCH_TOTAL_CUSTODY_VALUE: 'homeBank/FETCH_TOTAL_CUSTODY_VALUE',
  FETCH_ASSET_DISTRIBUTION: 'homeBank/FETCH_ASSET_DISTRIBUTION',
  FETCH_TOTAL_TRANSACTIONS: 'homeBank/FETCH_VOLUME',
  CREATE_HOMEBANK: 'homeBank/CREATE_HOMEBANK',
  UPDATE_HOMEBANK: 'homeBank/UPDATE_HOMEBANK',
  DELETE_HOMEBANK: 'homeBank/DELETE_HOMEBANK',
  RESET: 'homeBank/RESET'
};

export interface AssetDistribution {
  category: CATEGORY;
  percentage: number;
  totalAmount: number;
}

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IHomeBank>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  lastOrders: [] as ReadonlyArray<IOrder>,
  usersBalance: [] as ReadonlyArray<{ [key: string]: number }>,
  numberOfUsers: 0,
  totalRevenue: 0,
  totalCustodyValue: 0,
  assetDistribution: [] as ReadonlyArray<AssetDistribution>,
  totalTransactions: 0
};

export type HomeBankState = Readonly<typeof initialState>;

// Reducer
/* eslint complexity:off */
export default (state: HomeBankState = initialState, action): HomeBankState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_HOMEBANKS):
    case REQUEST(ACTION_TYPES.FETCH_HOMEBANK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_HOMEBANK):
    case REQUEST(ACTION_TYPES.FETCH_LAST_ORDERS):
    case REQUEST(ACTION_TYPES.FETCH_USERS_BALANCE):
    case REQUEST(ACTION_TYPES.FETCH_NUMBER_OF_USERS):
    case REQUEST(ACTION_TYPES.FETCH_TOTAL_REVENUE):
    case REQUEST(ACTION_TYPES.FETCH_TOTAL_CUSTODY_VALUE):
    case REQUEST(ACTION_TYPES.FETCH_ASSET_DISTRIBUTION):
    case REQUEST(ACTION_TYPES.FETCH_TOTAL_TRANSACTIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_HOMEBANK):
    case REQUEST(ACTION_TYPES.UPDATE_HOMEBANK):
    case REQUEST(ACTION_TYPES.DELETE_HOMEBANK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_HOMEBANKS):
    case FAILURE(ACTION_TYPES.FETCH_HOMEBANK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_HOMEBANK):
    case FAILURE(ACTION_TYPES.FETCH_LAST_ORDERS):
    case FAILURE(ACTION_TYPES.FETCH_USERS_BALANCE):
    case FAILURE(ACTION_TYPES.FETCH_NUMBER_OF_USERS):
    case FAILURE(ACTION_TYPES.FETCH_TOTAL_REVENUE):
    case FAILURE(ACTION_TYPES.FETCH_TOTAL_CUSTODY_VALUE):
    case FAILURE(ACTION_TYPES.FETCH_ASSET_DISTRIBUTION):
    case FAILURE(ACTION_TYPES.FETCH_TOTAL_TRANSACTIONS):
    case FAILURE(ACTION_TYPES.CREATE_HOMEBANK):
    case FAILURE(ACTION_TYPES.UPDATE_HOMEBANK):
    case FAILURE(ACTION_TYPES.DELETE_HOMEBANK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_HOMEBANKS):
    case SUCCESS(ACTION_TYPES.FETCH_HOMEBANK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_HOMEBANK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_LAST_ORDERS):
      return {
        ...state,
        loading: false,
        lastOrders: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERS_BALANCE):
      return {
        ...state,
        loading: false,
        usersBalance: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_NUMBER_OF_USERS):
      return {
        ...state,
        loading: false,
        numberOfUsers: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TOTAL_REVENUE):
      return {
        ...state,
        loading: false,
        totalRevenue: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TOTAL_CUSTODY_VALUE):
      return {
        ...state,
        loading: false,
        totalCustodyValue: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_ASSET_DISTRIBUTION):
      return {
        ...state,
        loading: false,
        assetDistribution: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TOTAL_TRANSACTIONS):
      return {
        ...state,
        loading: false,
        totalTransactions: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_HOMEBANK):
    case SUCCESS(ACTION_TYPES.UPDATE_HOMEBANK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_HOMEBANK):
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

const apiUrl = 'api/home-banks';
const apiSearchUrl = 'api/_search/home-banks';

// Actions

export const getSearchEntities: ICrudSearchAction<IHomeBank> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_HOMEBANKS,
  payload: axios.get<IHomeBank>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IHomeBank> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_HOMEBANK_LIST,
    payload: axios.get<IHomeBank>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IHomeBank> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_HOMEBANK,
    payload: axios.get<IHomeBank>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IHomeBank> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_HOMEBANK,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IHomeBank> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_HOMEBANK,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IHomeBank> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_HOMEBANK,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const getLastOrders: ICrudGetAllAction<IOrder> = () => {
  return {
    type: ACTION_TYPES.FETCH_LAST_ORDERS,
    payload: axios.get<IOrder>(`api/user-orders/last-success/?userId=`)
  };
};

export const getUsersBalance: ICrudGetAllAction<{ [key: string]: string }> = () => {
  return {
    type: ACTION_TYPES.FETCH_USERS_BALANCE,
    payload: axios.get<{ [key: string]: string }>(`api/users/total-balance`)
  };
};

export const getNumberOfUsers: ICrudGetAllAction<number> = () => {
  return {
    type: ACTION_TYPES.FETCH_NUMBER_OF_USERS,
    payload: axios.get<number>(`api/users/number-of-role-user`)
  };
};

export const getTotalRevenue: ICrudGetAllAction<number> = () => {
  return {
    type: ACTION_TYPES.FETCH_TOTAL_REVENUE,
    payload: axios.get<number>(`api/transactions/total-revenue`)
  };
};

export const getAssetDistribution: ICrudGetAllAction<AssetDistribution> = () => {
  return {
    type: ACTION_TYPES.FETCH_ASSET_DISTRIBUTION,
    payload: axios.get<AssetDistribution>(`api/security-tokens/assets-distribution`)
  };
};

export const getTotalTransactions: ICrudGetAllAction<number> = () => {
  return {
    type: ACTION_TYPES.FETCH_TOTAL_TRANSACTIONS,
    payload: axios.get<number>(`api/transactions-success`)
  };
};

export const getTotalCustodyValue: ICrudGetAllAction<number> = () => {
  return {
    type: ACTION_TYPES.FETCH_TOTAL_CUSTODY_VALUE,
    payload: axios.get<number>(`api/security-tokens/total-custody`)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
