import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import homeBank, {
  HomeBankState
} from 'app/entities/home-bank/home-bank.reducer';
// prettier-ignore
import homeCustomer, {
  HomeCustomerState
} from 'app/entities/home-customer/home-customer.reducer';
// prettier-ignore
import securityToken, {
  SecurityTokenState
} from 'app/entities/security-token/security-token.reducer';
// prettier-ignore
import userSetting, {
  UserSettingState
} from 'app/entities/user-setting/user-setting.reducer';
// prettier-ignore
import bankInfo, {
  BankInfoState
} from 'app/entities/bank-info/bank-info.reducer';
// prettier-ignore
import order, {
  OrderState
} from 'app/entities/order/order.reducer';
// prettier-ignore
import transaction, {
  TransactionState
} from 'app/entities/transaction/transaction.reducer';
// prettier-ignore
import whiteListing, {
  WhiteListingState
} from 'app/entities/white-listing/white-listing.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly homeBank: HomeBankState;
  readonly homeCustomer: HomeCustomerState;
  readonly securityToken: SecurityTokenState;
  readonly userSetting: UserSettingState;
  readonly bankInfo: BankInfoState;
  readonly order: OrderState;
  readonly transaction: TransactionState;
  readonly whiteListing: WhiteListingState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  homeBank,
  homeCustomer,
  securityToken,
  userSetting,
  bankInfo,
  order,
  transaction,
  whiteListing,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
