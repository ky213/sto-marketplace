import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import HomeBankComponentsPage, { HomeBankDeleteDialog } from './home-bank.page-object';
import HomeBankUpdatePage from './home-bank-update.page-object';
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

describe('HomeBank e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let homeBankComponentsPage: HomeBankComponentsPage;
  let homeBankUpdatePage: HomeBankUpdatePage;
  let homeBankDeleteDialog: HomeBankDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load HomeBanks', async () => {
    await navBarPage.getEntityPage('home-bank');
    homeBankComponentsPage = new HomeBankComponentsPage();
    expect(await homeBankComponentsPage.title.getText()).to.match(/Home Banks/);

    expect(await homeBankComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([homeBankComponentsPage.noRecords, homeBankComponentsPage.table]);

    beforeRecordsCount = (await isVisible(homeBankComponentsPage.noRecords)) ? 0 : await getRecordsCount(homeBankComponentsPage.table);
  });

  it('should load create HomeBank page', async () => {
    await homeBankComponentsPage.createButton.click();
    homeBankUpdatePage = new HomeBankUpdatePage();
    expect(await homeBankUpdatePage.getPageTitle().getText()).to.match(/Create or edit a HomeBank/);
    await homeBankUpdatePage.cancel();
  });

  it('should create and save HomeBanks', async () => {
    await homeBankComponentsPage.createButton.click();
    await homeBankUpdatePage.setDateEventInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await homeBankUpdatePage.getDateEventInput()).to.contain('2001-01-01T02:30');
    await homeBankUpdatePage.setCustodyBalanceInput('5');
    expect(await homeBankUpdatePage.getCustodyBalanceInput()).to.eq('5');
    await homeBankUpdatePage.setTotalUserInput('5');
    expect(await homeBankUpdatePage.getTotalUserInput()).to.eq('5');
    await homeBankUpdatePage.setVolumeOrderInput('5');
    expect(await homeBankUpdatePage.getVolumeOrderInput()).to.eq('5');
    await homeBankUpdatePage.setTotalRevenuInput('5');
    expect(await homeBankUpdatePage.getTotalRevenuInput()).to.eq('5');
    await homeBankUpdatePage.setEquityAllocationInput('5');
    expect(await homeBankUpdatePage.getEquityAllocationInput()).to.eq('5');
    await homeBankUpdatePage.setFundsAllocationInput('5');
    expect(await homeBankUpdatePage.getFundsAllocationInput()).to.eq('5');
    await homeBankUpdatePage.setRealEstateAllocationInput('5');
    expect(await homeBankUpdatePage.getRealEstateAllocationInput()).to.eq('5');
    await homeBankUpdatePage.setDerivativeAllocationInput('5');
    expect(await homeBankUpdatePage.getDerivativeAllocationInput()).to.eq('5');
    await homeBankUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(homeBankUpdatePage.saveButton);
    await homeBankUpdatePage.save();
    await waitUntilHidden(homeBankUpdatePage.saveButton);
    expect(await isVisible(homeBankUpdatePage.saveButton)).to.be.false;

    expect(await homeBankComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(homeBankComponentsPage.table);

    await waitUntilCount(homeBankComponentsPage.records, beforeRecordsCount + 1);
    expect(await homeBankComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last HomeBank', async () => {
    const deleteButton = homeBankComponentsPage.getDeleteButton(homeBankComponentsPage.records.last());
    await click(deleteButton);

    homeBankDeleteDialog = new HomeBankDeleteDialog();
    await waitUntilDisplayed(homeBankDeleteDialog.deleteModal);
    expect(await homeBankDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.homeBank.delete.question/);
    await homeBankDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(homeBankDeleteDialog.deleteModal);

    expect(await isVisible(homeBankDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([homeBankComponentsPage.noRecords, homeBankComponentsPage.table]);

    const afterCount = (await isVisible(homeBankComponentsPage.noRecords)) ? 0 : await getRecordsCount(homeBankComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
