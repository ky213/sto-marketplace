import { COUNTRY } from 'app/shared/model/enumerations/country.model';

export interface IBankInfo {
  id?: number;
  bankName?: string;
  logoContentType?: string;
  logo?: any;
  country?: COUNTRY;
  bicNumber?: string;
  omnibusAccount?: string;
  fixedFee?: number;
  percentFee?: number;
}

export const defaultValue: Readonly<IBankInfo> = {};
