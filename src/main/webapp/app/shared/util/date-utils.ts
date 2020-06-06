import moment from 'moment';

import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export const convertDateTimeFromServer = (date, format = null) => (date ? moment(date).format(format || APP_LOCAL_DATE_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? moment(date, APP_LOCAL_DATE_FORMAT).toDate() : null);

export const displayDefaultDateTime = () =>
  moment()
    .startOf('day')
    .format(APP_LOCAL_DATE_FORMAT);
