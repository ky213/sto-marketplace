import { Moment } from 'moment';
import { COUNTRY } from 'app/shared/model/enumerations/country.model';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';
import { STSTATUS } from 'app/shared/model/enumerations/ststatus.model';

export interface ISecurityToken {
  id?: number;
  idRed?: string;
  name?: string;
  laucheDate?: Moment;
  logoContentType?: string;
  logo?: any;
  symbol?: string;
  juridiction?: COUNTRY;
  issuerName?: string;
  issuerCounty?: COUNTRY;
  tokenizationFirmName?: string;
  tokenizationFirmCountry?: COUNTRY;
  kycProviderName?: string;
  kycProviderCountry?: COUNTRY;
  stoPrice?: number;
  amountRaised?: number;
  category?: CATEGORY;
  summary?: string;
  description?: string;
  restrictionCounty?: string;
  restrictionNationality?: string;
  prospectusContentType?: string;
  prospectus?: any;
  status?: STSTATUS;
  registrationDate?: Moment;
  updateDate?: Moment;
  dueDiligenceDate?: Moment;
  lastSellingprice?: number;
  lastBuyingPrice?: number;
  smartcontractAddress?: string;
  kycAddress?: string;
  website?: string;
}

export const defaultValue: Readonly<ISecurityToken> = {};
