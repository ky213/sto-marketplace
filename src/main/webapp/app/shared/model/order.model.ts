import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { ITransaction } from 'app/shared/model/transaction.model';
import { ACTIONTYPE } from 'app/shared/model/enumerations/actiontype.model';
import { ORDERTYPE } from 'app/shared/model/enumerations/ordertype.model';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';
import { STATUS } from 'app/shared/model/enumerations/status.model';

export interface IOrder {
  id?: number;
  idOrder?: string;
  refOrder?: number;
  createDate?: Moment;
  updateDate?: Moment;
  closeDate?: Moment;
  securityTokenName?: string;
  symbol?: string;
  type?: ACTIONTYPE;
  limitOrMarket?: ORDERTYPE;
  volume?: number;
  price?: number;
  totalAmount?: number;
  categoryToken?: CATEGORY;
  status?: STATUS;
  active?: boolean;
  user?: IUser;
  transaction?: ITransaction;
}

export const defaultValue: Readonly<IOrder> = {
  active: false
};
