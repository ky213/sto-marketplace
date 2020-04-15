import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { COUNTRY } from 'app/shared/model/enumerations/country.model';

export interface IUserSetting {
  id?: number;
  dateOfBirth?: Moment;
  nationality?: COUNTRY;
  phoneNumber?: string;
  position?: string;
  address?: string;
  code?: string;
  city?: string;
  country?: COUNTRY;
  iban?: string;
  ethAddress?: string;
  riskProfil?: number;
  balance?: number;
  user?: IUser;
}

export const defaultValue: Readonly<IUserSetting> = {};
