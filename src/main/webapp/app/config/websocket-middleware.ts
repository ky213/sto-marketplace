import SockJS from 'sockjs-client';

import Stomp from 'webstomp-client';
import { Observable } from 'rxjs';
import { Storage } from 'react-jhipster';
import { includes } from 'lodash';

import { ACTION_TYPES as AUTH_ACTIONS } from 'app/shared/reducers/authentication';
import { ACTION_TYPES as ORDER_ACTIONS } from 'app/entities/order/order.reducer';
import { ACTION_TYPES as SECURITYTOKEN_ACTIONS } from 'app/entities/security-token/security-token.reducer';
import { SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { AUTHORITIES } from './constants';

let stompClient = null;

let subscriber = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let alreadyConnectedOnce = false;

const createConnection = (): Promise<any> => new Promise((resolve, reject) => (connectedPromise = resolve));

const createListener = (): Observable<any> =>
  new Observable(observer => {
    listenerObserver = observer;
  });

const sendActivity = () => {
  connection.then(() => {
    stompClient.send(
      '/topic/activity', // destination
      JSON.stringify({ page: window.location.hash }), // body
      {} // header
    );
  });
};

const subscribe = () => {
  connection.then(() => {
    subscriber = stompClient.subscribe('/topic/tracker', data => {
      listenerObserver.next(JSON.parse(data.body));
    });
  });
};

const connect = () => {
  if (connectedPromise !== null || alreadyConnectedOnce) {
    // the connection is already being established
    return;
  }
  connection = createConnection();
  listener = createListener();

  // building absolute path so that websocket doesn't fail when deploying with a context path
  const loc = window.location;
  const baseHref = document
    .querySelector('base')
    .getAttribute('href')
    .replace(/\/$/, '');

  const headers = {};
  let url = '//' + loc.host + baseHref + '/websocket/tracker';
  const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  if (authToken) {
    url += '?access_token=' + authToken;
  }
  const socket = new SockJS(url);
  stompClient = Stomp.over(socket);

  stompClient.connect(headers, () => {
    connectedPromise('success');
    connectedPromise = null;
    subscribe();
    sendActivity();
    if (!alreadyConnectedOnce) {
      window.onhashchange = () => {
        sendActivity();
      };
      alreadyConnectedOnce = true;
    }
  });
};

const disconnect = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
  window.onhashchange = () => {};
  alreadyConnectedOnce = false;
};

const receive = () => listener;

const unsubscribe = () => {
  if (subscriber !== null) {
    subscriber.unsubscribe();
  }
  listener = createListener();
};

export default store => next => action => {
  if (action.type === SUCCESS(AUTH_ACTIONS.GET_SESSION)) {
    const isAdmin = includes(action.payload.data.authorities, AUTHORITIES.ADMIN);
    const isBank = includes(action.payload.data.authorities, AUTHORITIES.BANK);

    connect();
    if (!alreadyConnectedOnce) {
      receive().subscribe(activity => {
        if ('idOrder' in activity) {
          /* eslint  @typescript-eslint/no-misused-promises:off */
          if (isAdmin || isBank)
            return Promise.all([
              store.dispatch({
                type: ORDER_ACTIONS.PUSH_ORDER,
                payload: activity
              }),
              store.dispatch({
                type: SECURITYTOKEN_ACTIONS.UPDATE_SECURITYTOKEN_PRICE,
                payload: activity
              })
            ]);

          return store.dispatch({
            type: SECURITYTOKEN_ACTIONS.UPDATE_SECURITYTOKEN_PRICE,
            payload: activity
          });
        }
      });
    }
  } else if (action.type === FAILURE(AUTH_ACTIONS.GET_SESSION)) {
    unsubscribe();
    disconnect();
  }
  return next(action);
};
