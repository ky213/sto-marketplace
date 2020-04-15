import { Moment } from 'moment';
import { ORDERTYPE } from 'app/shared/model/enumerations/ordertype.model';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';
import { STATUS } from 'app/shared/model/enumerations/status.model';

export interface ITransaction {
  id?: number;
  idTx?: string;
  createDate?: Moment;
  updateDate?: Moment;
  closeDate?: Moment;
  securityTokenName?: string;
  symbol?: string;
  limitOrMarket?: ORDERTYPE;
  volume?: number;
  price?: number;
  totalAmount?: number;
  categoryToken?: CATEGORY;
  status?: STATUS;
  active?: boolean;
  feeTransaction?: number;
  numBlockchainTx?: string;
  numBankTx?: string;
  confBlkDate?: Moment;
  confBankDate?: Moment;
  sellerBlkAddress?: string;
  buyerBlkAddress?: string;
  buyerIban?: string;
  sellerIban?: string;
  buyerid?: number;
  sellerid?: number;
}

export const defaultValue: Readonly<ITransaction> = {
  active: false
};
