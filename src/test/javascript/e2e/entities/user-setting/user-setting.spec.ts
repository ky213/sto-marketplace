import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UserSettingComponentsPage, { UserSettingDeleteDialog } from './user-setting.page-object';
import UserSettingUpdatePage from './user-setting-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('UserSetting e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let userSettingComponentsPage: UserSettingComponentsPage;
  let userSettingUpdatePage: UserSettingUpdatePage;
  let userSettingDeleteDialog: UserSettingDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    navBarPage = new NavBarPage();
    signInPage = new SignInPage();
    await signInPage.get();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load UserSettings', async () => {
    await navBarPage.getEntityPage('user-setting');
    userSettingComponentsPage = new UserSettingComponentsPage();
    expect(await userSettingComponentsPage.title.getText()).to.match(/User Settings/);

    expect(await userSettingComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([userSettingComponentsPage.noRecords, userSettingComponentsPage.table]);

    beforeRecordsCount = (await isVisible(userSettingComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(userSettingComponentsPage.table);
  });

  it('should load create UserSetting page', async () => {
    await userSettingComponentsPage.createButton.click();
    userSettingUpdatePage = new UserSettingUpdatePage();
    expect(await userSettingUpdatePage.getPageTitle().getText()).to.match(/Create or edit a UserSetting/);
    await userSettingUpdatePage.cancel();
  });

  it('should create and save UserSettings', async () => {
    await userSettingComponentsPage.createButton.click();
    await userSettingUpdatePage.setDateOfBirthInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await userSettingUpdatePage.getDateOfBirthInput()).to.contain('2001-01-01T02:30');
    await userSettingUpdatePage.nationalitySelectLastOption();
    await userSettingUpdatePage.setPhoneNumberInput('phoneNumber');
    expect(await userSettingUpdatePage.getPhoneNumberInput()).to.match(/phoneNumber/);
    await userSettingUpdatePage.setPositionInput('position');
    expect(await userSettingUpdatePage.getPositionInput()).to.match(/position/);
    await userSettingUpdatePage.setAddressInput('address');
    expect(await userSettingUpdatePage.getAddressInput()).to.match(/address/);
    await userSettingUpdatePage.setCodeInput('code');
    expect(await userSettingUpdatePage.getCodeInput()).to.match(/code/);
    await userSettingUpdatePage.setCityInput('city');
    expect(await userSettingUpdatePage.getCityInput()).to.match(/city/);
    await userSettingUpdatePage.countrySelectLastOption();
    await userSettingUpdatePage.setIbanInput('xxxxxxxxxxxxxx');
    expect(await userSettingUpdatePage.getIbanInput()).to.match(/xxxxxxxxxxxxxx/);
    await userSettingUpdatePage.setEthAddressInput('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(await userSettingUpdatePage.getEthAddressInput()).to.match(/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/);
    await userSettingUpdatePage.setRiskProfilInput('5');
    expect(await userSettingUpdatePage.getRiskProfilInput()).to.eq('5');
    await userSettingUpdatePage.setBalanceInput('5');
    expect(await userSettingUpdatePage.getBalanceInput()).to.eq('5');
    await userSettingUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(userSettingUpdatePage.saveButton);
    await userSettingUpdatePage.save();
    await waitUntilHidden(userSettingUpdatePage.saveButton);
    expect(await isVisible(userSettingUpdatePage.saveButton)).to.be.false;

    expect(await userSettingComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(userSettingComponentsPage.table);

    await waitUntilCount(userSettingComponentsPage.records, beforeRecordsCount + 1);
    expect(await userSettingComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last UserSetting', async () => {
    const deleteButton = userSettingComponentsPage.getDeleteButton(userSettingComponentsPage.records.last());
    await click(deleteButton);

    userSettingDeleteDialog = new UserSettingDeleteDialog();
    await waitUntilDisplayed(userSettingDeleteDialog.deleteModal);
    expect(await userSettingDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.userSetting.delete.question/);
    await userSettingDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(userSettingDeleteDialog.deleteModal);

    expect(await isVisible(userSettingDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([userSettingComponentsPage.noRecords, userSettingComponentsPage.table]);

    const afterCount = (await isVisible(userSettingComponentsPage.noRecords)) ? 0 : await getRecordsCount(userSettingComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
