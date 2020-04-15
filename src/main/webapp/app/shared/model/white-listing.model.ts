import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { STATUS } from 'app/shared/model/enumerations/status.model';

export interface IWhiteListing {
  id?: number;
  dateEvent?: Moment;
  status?: STATUS;
  active?: boolean;
  ethAddress?: string;
  dateSynchBlk?: Moment;
  stName?: string;
  customerName?: string;
  balance?: number;
  user?: IUser;
  securitytoken?: ISecurityToken;
}

export const defaultValue: Readonly<IWhiteListing> = {
  active: false
};
