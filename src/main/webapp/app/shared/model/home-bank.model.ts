import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IHomeBank {
  id?: number;
  dateEvent?: Moment;
  custodyBalance?: number;
  totalUser?: number;
  volumeOrder?: number;
  totalRevenu?: number;
  equityAllocation?: number;
  fundsAllocation?: number;
  realEstateAllocation?: number;
  derivativeAllocation?: number;
  user?: IUser;
}

export const defaultValue: Readonly<IHomeBank> = {};
