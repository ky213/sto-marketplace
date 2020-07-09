import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISecurityToken, defaultValue } from 'app/shared/model/security-token.model';

export const ACTION_TYPES = {
  SEARCH_SECURITYTOKENS: 'securityToken/SEARCH_SECURITYTOKENS',
  FETCH_SECURITYTOKEN_LIST: 'securityToken/FETCH_SECURITYTOKEN_LIST',
  FETCH_SECURITYTOKEN: 'securityToken/FETCH_SECURITYTOKEN',
  FETCH_CHART_DATA: 'securityToken/FETCH_CHART_DATA',
  CREATE_SECURITYTOKEN: 'securityToken/CREATE_SECURITYTOKEN',
  UPDATE_SECURITYTOKEN: 'securityToken/UPDATE_SECURITYTOKEN',
  UPDATE_SECURITYTOKEN_PRICE: 'securityToken/UPDATE_SECURITYTOKEN_PRICE',
  DELETE_SECURITYTOKEN: 'securityToken/DELETE_SECURITYTOKEN',
  SET_BLOB: 'securityToken/SET_BLOB',
  RESET: 'securityToken/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISecurityToken>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  chartData: []
};

export type SecurityTokenState = Readonly<typeof initialState>;

// Reducer

export default (state: SecurityTokenState = initialState, action): SecurityTokenState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SECURITYTOKENS):
    case REQUEST(ACTION_TYPES.FETCH_SECURITYTOKEN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SECURITYTOKEN):
    case REQUEST(ACTION_TYPES.FETCH_CHART_DATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SECURITYTOKEN):
    case REQUEST(ACTION_TYPES.UPDATE_SECURITYTOKEN):
    case REQUEST(ACTION_TYPES.DELETE_SECURITYTOKEN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SECURITYTOKENS):
    case FAILURE(ACTION_TYPES.FETCH_SECURITYTOKEN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SECURITYTOKEN):
    case FAILURE(ACTION_TYPES.FETCH_CHART_DATA):
    case FAILURE(ACTION_TYPES.CREATE_SECURITYTOKEN):
    case FAILURE(ACTION_TYPES.UPDATE_SECURITYTOKEN):
    case FAILURE(ACTION_TYPES.DELETE_SECURITYTOKEN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SECURITYTOKENS):
    case SUCCESS(ACTION_TYPES.FETCH_SECURITYTOKEN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_SECURITYTOKEN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHART_DATA):
      return {
        ...state,
        loading: false,
        chartData: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SECURITYTOKEN):
    case SUCCESS(ACTION_TYPES.UPDATE_SECURITYTOKEN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SECURITYTOKEN):
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
    case ACTION_TYPES.UPDATE_SECURITYTOKEN_PRICE: {
      const newEntities = [...state.entities];
      const newST = action.payload.securityToken;
      const stIndex = state.entities.findIndex(st => st.id === newST.id);

      if (stIndex !== -1) {
        newEntities[stIndex].lastBuyingPrice = newST.lastBuyingPrice;
        newEntities[stIndex].lastSellingprice = newST.lastSellingprice;

        return { ...state, entities: newEntities };
      }

      return { ...state };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/security-tokens';
const apiSearchUrl = 'api/_search/security-tokens';

// Actions

export const getSearchEntities: ICrudSearchAction<ISecurityToken> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_SECURITYTOKENS,
  payload: axios.get<ISecurityToken>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<ISecurityToken> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SECURITYTOKEN_LIST,
    payload: axios.get<ISecurityToken>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ISecurityToken> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SECURITYTOKEN,
    payload: axios.get<ISecurityToken>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISecurityToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SECURITYTOKEN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISecurityToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SECURITYTOKEN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISecurityToken> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SECURITYTOKEN,
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

export const getChartData: any = (STName: string, startDate: string, endDate: string) => {
  const requestUrl = `api/transactions-prices/?securityTokenName=${STName}&startDate=${startDate}&endDate=${endDate}`;
  return {
    type: ACTION_TYPES.FETCH_CHART_DATA,
    payload: axios.get<any[]>(requestUrl)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
