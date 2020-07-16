import axios from 'axios';
import { uniqBy } from 'lodash';
import { parseHeaderForLinks, loadMoreDataWhenScrolled, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IOrder, defaultValue } from 'app/shared/model/order.model';

export const ACTION_TYPES = {
  SEARCH_ORDERS: 'order/SEARCH_ORDERS',
  FETCH_ORDER_LIST: 'order/FETCH_ORDER_LIST',
  FETCH_ORDER: 'order/FETCH_ORDER',
  CREATE_ORDER: 'order/CREATE_ORDER',
  UPDATE_ORDER: 'order/UPDATE_ORDER',
  DELETE_ORDER: 'order/DELETE_ORDER',
  CANCEL_ORDER: 'order/CANCEL_ORDER',
  EXPORT_ORDER: 'order/EXPORT_ORDER',
  PUSH_ORDER: 'order/PUSH_ORDER',
  RESET: 'order/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IOrder>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  ordersSheet: null
};

export type OrderState = Readonly<typeof initialState>;

// Reducer

export default (state: OrderState = initialState, action): OrderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_ORDERS):
    case REQUEST(ACTION_TYPES.FETCH_ORDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ORDER):
    case FAILURE(ACTION_TYPES.EXPORT_ORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_ORDER):
    case REQUEST(ACTION_TYPES.UPDATE_ORDER):
    case REQUEST(ACTION_TYPES.EXPORT_ORDER):
    case REQUEST(ACTION_TYPES.CANCEL_ORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_ORDERS):
    case FAILURE(ACTION_TYPES.FETCH_ORDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ORDER):
    case FAILURE(ACTION_TYPES.CREATE_ORDER):
    case FAILURE(ACTION_TYPES.UPDATE_ORDER):
    case FAILURE(ACTION_TYPES.CANCEL_ORDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_ORDERS):
    case SUCCESS(ACTION_TYPES.FETCH_ORDER_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_ORDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.EXPORT_ORDER):
      return {
        ...state,
        loading: false,
        ordersSheet: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_ORDER):
    case SUCCESS(ACTION_TYPES.UPDATE_ORDER):
    case SUCCESS(ACTION_TYPES.CANCEL_ORDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_ORDER):
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
    case ACTION_TYPES.PUSH_ORDER:
      return {
        ...state,
        entities: uniqBy([action.payload, ...state.entities], 'id')
      };

    default:
      return state;
  }
};

const apiUrl = 'api/orders';
const apiSearchUrl = 'api/_search/orders';

// Actions

export const getSearchEntities: any = (query, page, size, sort, userId) => {
  const url = userId ? `/api/_search/user-orders?userId=${userId}&query=${query}` : `${apiSearchUrl}?&query=${query}`;

  return {
    type: ACTION_TYPES.SEARCH_ORDERS,
    payload: axios.get<IOrder>(url)
  };
};

export const getEntities: any = (page, size, sort, userId) => {
  const url = userId ? '/api/user-orders' : apiUrl;
  const requestUrl = `${url}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}&userId=${userId}`;

  return {
    type: ACTION_TYPES.FETCH_ORDER_LIST,
    payload: axios.get<IOrder>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: any = (id, userId) => {
  const requestUrl = `${apiUrl}/${id}`;

  return {
    type: ACTION_TYPES.FETCH_ORDER,
    payload: axios.get<IOrder>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ORDER,
    payload: axios.post('api/create-order', cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ORDER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IOrder> = id => async dispatch => {
  const requestUrl = `/api/cancel-order?orderId=${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.CANCEL_ORDER,
    payload: axios.put(requestUrl)
  });
  return result;
};

export const exportOrder: any = (fromDate, toDate, userId) => {
  const url = userId ? 'api/user-orders/export' : `${apiUrl}/export`;
  return {
    type: ACTION_TYPES.EXPORT_ORDER,
    payload: axios.get(url, {
      responseType: 'blob',
      params: {
        beginDateParam: fromDate,
        endDateParam: toDate,
        userId
      }
    })
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
