import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IHomeCustomer {
  id?: number;
  dateEvent?: Moment;
  tokenBalance?: number;
  bigestTokenName?: string;
  bigestTokenValue?: number;
  secondTokenName?: string;
  secondTokenValue?: number;
  bankBalance?: number;
  equityAllocation?: number;
  fundsAllocation?: number;
  realEstateAllocation?: number;
  derivativeAllocation?: number;
  user?: IUser;
}

export const defaultValue: Readonly<IHomeCustomer> = {};
