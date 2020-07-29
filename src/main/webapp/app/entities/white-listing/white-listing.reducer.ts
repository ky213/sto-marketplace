import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWhiteListing, defaultValue } from 'app/shared/model/white-listing.model';
import { IUser } from 'app/shared/model/user.model';
import { ISecurityToken } from 'app/shared/model/security-token.model';

export const ACTION_TYPES = {
  SEARCH_WHITELISTINGS: 'whiteListing/SEARCH_WHITELISTINGS',
  FETCH_WHITELISTING_LIST: 'whiteListing/FETCH_WHITELISTING_LIST',
  FETCH_WHITELISTING: 'whiteListing/FETCH_WHITELISTING',
  CREATE_WHITELISTING: 'whiteListing/CREATE_WHITELISTING',
  UPDATE_WHITELISTING: 'whiteListing/UPDATE_WHITELISTING',
  DELETE_WHITELISTING: 'whiteListing/DELETE_WHITELISTING',
  SUGGEST_USERS: 'whiteListing/SUGGEST_USERS',
  SUGGEST_SECURITY_TOKENS: 'whiteListing/SUGGEST_SECURITY_TOKENS',
  RESET: 'whiteListing/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWhiteListing>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  suggestedUsers: [] as Array<IUser>,
  suggestedSecurityTokens: [] as Array<ISecurityToken>
};

export type WhiteListingState = Readonly<typeof initialState>;

// Reducer

export default (state: WhiteListingState = initialState, action): WhiteListingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_WHITELISTINGS):
    case REQUEST(ACTION_TYPES.FETCH_WHITELISTING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WHITELISTING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.SUGGEST_USERS):
    case REQUEST(ACTION_TYPES.SUGGEST_SECURITY_TOKENS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false
      };
    case REQUEST(ACTION_TYPES.CREATE_WHITELISTING):
    case REQUEST(ACTION_TYPES.UPDATE_WHITELISTING):
    case REQUEST(ACTION_TYPES.DELETE_WHITELISTING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_WHITELISTINGS):
    case FAILURE(ACTION_TYPES.FETCH_WHITELISTING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WHITELISTING):
    case FAILURE(ACTION_TYPES.CREATE_WHITELISTING):
    case FAILURE(ACTION_TYPES.UPDATE_WHITELISTING):
    case FAILURE(ACTION_TYPES.DELETE_WHITELISTING):
    case FAILURE(ACTION_TYPES.SUGGEST_USERS):
    case FAILURE(ACTION_TYPES.SUGGEST_SECURITY_TOKENS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_WHITELISTINGS):
    case SUCCESS(ACTION_TYPES.FETCH_WHITELISTING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        entity: {},
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_WHITELISTING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SUGGEST_USERS):
      return {
        ...state,
        loading: false,
        suggestedUsers: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SUGGEST_SECURITY_TOKENS):
      return {
        ...state,
        loading: false,
        suggestedSecurityTokens: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_WHITELISTING):
    case SUCCESS(ACTION_TYPES.UPDATE_WHITELISTING):
    case SUCCESS(ACTION_TYPES.DELETE_WHITELISTING):
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

const apiUrl = 'api/white-listings';
const apiSearchUrl = 'api/_search/white-listings';

// Actions

export const getSearchEntities: any = (query, page, size, sort, userId) => {
  const url = userId ? 'api/_search/user-white-listings' : apiSearchUrl;

  return {
    type: ACTION_TYPES.SEARCH_WHITELISTINGS,
    payload: axios.get<IWhiteListing>(`${url}?query=${query}&userId=${userId}${sort ? `&page=${page}&size=${size}` : ''}`)
  };
};

export const suggestUsers: any = (query: string, securityTokenId: number) => {
  const url = `/api/_search-autocomplete/users`;

  return {
    type: ACTION_TYPES.SUGGEST_USERS,
    payload: axios.get<IUser>(`${url}?query=${query || ''}&securityTokenId=${securityTokenId || ''}`)
  };
};

export const suggestSecurityTokens: any = (query: string, userId: number) => {
  const url = `/api/_search-autocomplete/security-tokens`;

  return {
    type: ACTION_TYPES.SUGGEST_SECURITY_TOKENS,
    payload: axios.get<ISecurityToken>(`${url}?query=${query || ''}&userId=${userId || ''}`)
  };
};

export const getEntities: any = (page, size, sort, isUser) => {
  const url = isUser ? 'api/user-white-listings' : apiUrl;
  const requestUrl = `${url}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;

  return {
    type: ACTION_TYPES.FETCH_WHITELISTING_LIST,
    payload: axios.get<IWhiteListing>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IWhiteListing> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WHITELISTING,
    payload: axios.get<IWhiteListing>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IWhiteListing> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WHITELISTING,
    payload: axios.post('api/create-whitelistings', cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWhiteListing> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WHITELISTING,
    payload: axios.put('api/update-white-listings', cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWhiteListing> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WHITELISTING,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
