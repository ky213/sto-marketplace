import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import HomeCustomerComponentsPage, { HomeCustomerDeleteDialog } from './home-customer.page-object';
import HomeCustomerUpdatePage from './home-customer-update.page-object';
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

describe('HomeCustomer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let homeCustomerComponentsPage: HomeCustomerComponentsPage;
  let homeCustomerUpdatePage: HomeCustomerUpdatePage;
  let homeCustomerDeleteDialog: HomeCustomerDeleteDialog;
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

  it('should load HomeCustomers', async () => {
    await navBarPage.getEntityPage('home-customer');
    homeCustomerComponentsPage = new HomeCustomerComponentsPage();
    expect(await homeCustomerComponentsPage.title.getText()).to.match(/Home Customers/);

    expect(await homeCustomerComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([homeCustomerComponentsPage.noRecords, homeCustomerComponentsPage.table]);

    beforeRecordsCount = (await isVisible(homeCustomerComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(homeCustomerComponentsPage.table);
  });

  it('should load create HomeCustomer page', async () => {
    await homeCustomerComponentsPage.createButton.click();
    homeCustomerUpdatePage = new HomeCustomerUpdatePage();
    expect(await homeCustomerUpdatePage.getPageTitle().getText()).to.match(/Create or edit a HomeCustomer/);
    await homeCustomerUpdatePage.cancel();
  });

  it('should create and save HomeCustomers', async () => {
    await homeCustomerComponentsPage.createButton.click();
    await homeCustomerUpdatePage.setDateEventInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await homeCustomerUpdatePage.getDateEventInput()).to.contain('2001-01-01T02:30');
    await homeCustomerUpdatePage.setTokenBalanceInput('5');
    expect(await homeCustomerUpdatePage.getTokenBalanceInput()).to.eq('5');
    await homeCustomerUpdatePage.setBigestTokenNameInput('bigestTokenName');
    expect(await homeCustomerUpdatePage.getBigestTokenNameInput()).to.match(/bigestTokenName/);
    await homeCustomerUpdatePage.setBigestTokenValueInput('5');
    expect(await homeCustomerUpdatePage.getBigestTokenValueInput()).to.eq('5');
    await homeCustomerUpdatePage.setSecondTokenNameInput('secondTokenName');
    expect(await homeCustomerUpdatePage.getSecondTokenNameInput()).to.match(/secondTokenName/);
    await homeCustomerUpdatePage.setSecondTokenValueInput('5');
    expect(await homeCustomerUpdatePage.getSecondTokenValueInput()).to.eq('5');
    await homeCustomerUpdatePage.setBankBalanceInput('5');
    expect(await homeCustomerUpdatePage.getBankBalanceInput()).to.eq('5');
    await homeCustomerUpdatePage.setEquityAllocationInput('5');
    expect(await homeCustomerUpdatePage.getEquityAllocationInput()).to.eq('5');
    await homeCustomerUpdatePage.setFundsAllocationInput('5');
    expect(await homeCustomerUpdatePage.getFundsAllocationInput()).to.eq('5');
    await homeCustomerUpdatePage.setRealEstateAllocationInput('5');
    expect(await homeCustomerUpdatePage.getRealEstateAllocationInput()).to.eq('5');
    await homeCustomerUpdatePage.setDerivativeAllocationInput('5');
    expect(await homeCustomerUpdatePage.getDerivativeAllocationInput()).to.eq('5');
    await homeCustomerUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(homeCustomerUpdatePage.saveButton);
    await homeCustomerUpdatePage.save();
    await waitUntilHidden(homeCustomerUpdatePage.saveButton);
    expect(await isVisible(homeCustomerUpdatePage.saveButton)).to.be.false;

    expect(await homeCustomerComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(homeCustomerComponentsPage.table);

    await waitUntilCount(homeCustomerComponentsPage.records, beforeRecordsCount + 1);
    expect(await homeCustomerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last HomeCustomer', async () => {
    const deleteButton = homeCustomerComponentsPage.getDeleteButton(homeCustomerComponentsPage.records.last());
    await click(deleteButton);

    homeCustomerDeleteDialog = new HomeCustomerDeleteDialog();
    await waitUntilDisplayed(homeCustomerDeleteDialog.deleteModal);
    expect(await homeCustomerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.homeCustomer.delete.question/);
    await homeCustomerDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(homeCustomerDeleteDialog.deleteModal);

    expect(await isVisible(homeCustomerDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([homeCustomerComponentsPage.noRecords, homeCustomerComponentsPage.table]);

    const afterCount = (await isVisible(homeCustomerComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(homeCustomerComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
