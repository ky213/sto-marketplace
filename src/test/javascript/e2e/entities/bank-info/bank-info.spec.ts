import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import BankInfoComponentsPage, { BankInfoDeleteDialog } from './bank-info.page-object';
import BankInfoUpdatePage from './bank-info-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
  getToastByInnerText
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('BankInfo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bankInfoComponentsPage: BankInfoComponentsPage;
  let bankInfoUpdatePage: BankInfoUpdatePage;
  let bankInfoDeleteDialog: BankInfoDeleteDialog;
  const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);
  let beforeRecordsCount = 0;

  before(async () => {
    navBarPage = new NavBarPage();
    signInPage = new SignInPage();

    await signInPage.get();
    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load BankInfos', async () => {
    await navBarPage.getEntityPage('bank-info');
    bankInfoComponentsPage = new BankInfoComponentsPage();
    expect(await bankInfoComponentsPage.title.getText()).to.match(/Bank Infos/);

    expect(await bankInfoComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([bankInfoComponentsPage.noRecords, bankInfoComponentsPage.table]);

    beforeRecordsCount = (await isVisible(bankInfoComponentsPage.noRecords)) ? 0 : await getRecordsCount(bankInfoComponentsPage.table);
  });

  it('should load create BankInfo page', async () => {
    await bankInfoComponentsPage.createButton.click();
    bankInfoUpdatePage = new BankInfoUpdatePage();
    expect(await bankInfoUpdatePage.getPageTitle().getText()).to.match(/Create or edit a BankInfo/);
  });

  it('should create and save BankInfos', async () => {
    await bankInfoUpdatePage.setBankNameInput('Maryland Cameroon facilitate');
    expect(await bankInfoUpdatePage.getBankNameInput()).to.contain('Maryland Cameroon facilitate');
    await bankInfoUpdatePage.setLogoInput(absolutePath);
    await bankInfoUpdatePage.countrySelectLastOption();
    await bankInfoUpdatePage.setBicNumberInput('xxxxxxxxxxxx');
    expect(await bankInfoUpdatePage.getBicNumberInput()).to.match(/xxxxxxxxxxxx/);
    await bankInfoUpdatePage.setOmnibusAccountInput('omnibusAccount');
    expect(await bankInfoUpdatePage.getOmnibusAccountInput()).to.match(/omnibusAccount/);
    await bankInfoUpdatePage.setFixedFeeInput('5');
    expect(await bankInfoUpdatePage.getFixedFeeInput()).to.eq('5');
    await bankInfoUpdatePage.setPercentFeeInput('5');
    expect(await bankInfoUpdatePage.getPercentFeeInput()).to.eq('5');
    await waitUntilDisplayed(bankInfoUpdatePage.saveButton);
    await bankInfoUpdatePage.save();
    await waitUntilHidden(bankInfoUpdatePage.saveButton);
    expect(await isVisible(bankInfoUpdatePage.saveButton)).to.be.false;

    const toast = getToastByInnerText('A new bankInfo is created with identifier');

    await waitUntilDisplayed(toast);

    expect(await toast.isPresent()).to.be.true;
  });

  it('should delete last BankInfo', async () => {
    await navBarPage.getEntityPage('bank-info');
    expect(await bankInfoComponentsPage.title.getText()).to.match(/Bank Infos/);
    const deleteButton = bankInfoComponentsPage.getDeleteButton(bankInfoComponentsPage.records.last());
    await click(deleteButton);

    bankInfoDeleteDialog = new BankInfoDeleteDialog();
    await waitUntilDisplayed(bankInfoDeleteDialog.deleteModal);
    expect(await bankInfoDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.bankInfo.delete.question/);
    await bankInfoDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(bankInfoDeleteDialog.deleteModal);

    expect(await isVisible(bankInfoDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([bankInfoComponentsPage.noRecords, bankInfoComponentsPage.table]);

    const afterCount = (await isVisible(bankInfoComponentsPage.noRecords)) ? 0 : await getRecordsCount(bankInfoComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
