import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import OrderComponentsPage, { OrderDeleteDialog } from './order.page-object';
import OrderUpdatePage from './order-update.page-object';
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

describe('Order e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let securityTokenPage: SecurityTokenDetailsPage;
  let orderComponentsPage: OrderComponentsPage;
  let orderUpdatePage: OrderUpdatePage;
  let orderDeleteDialog: OrderDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    navBarPage = new NavBarPage();
    signInPage = new SignInPage();

    await signInPage.get();
    await signInPage.username.sendKeys('user');
    await signInPage.password.sendKeys('user');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Orders', async () => {
    await navBarPage.getEntityPage('order');
    orderComponentsPage = new OrderComponentsPage();
    expect(await orderComponentsPage.title.getText()).to.match(/Orders/);

    expect(await orderComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([orderComponentsPage.noRecords, orderComponentsPage.table]);

    beforeRecordsCount = (await isVisible(orderComponentsPage.noRecords)) ? 0 : await getRecordsCount(orderComponentsPage.table);
  });

  it('should load create Order page', async () => {
    await orderComponentsPage.createButton.click();
    orderUpdatePage = new OrderUpdatePage();
    expect(await orderUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Order/);
    await orderUpdatePage.cancel();
  });

  // it('should create and save Orders', async () => {
  //   await orderComponentsPage.createButton.click();
  //   await orderUpdatePage.setIdOrderInput('idOrder');
  //   expect(await orderUpdatePage.getIdOrderInput()).to.match(/idOrder/);
  //   await orderUpdatePage.setRefOrderInput('5');
  //   expect(await orderUpdatePage.getRefOrderInput()).to.eq('5');
  //   await orderUpdatePage.setCreateDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
  //   expect(await orderUpdatePage.getCreateDateInput()).to.contain('2001-01-01T02:30');
  //   await orderUpdatePage.setUpdateDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
  //   expect(await orderUpdatePage.getUpdateDateInput()).to.contain('2001-01-01T02:30');
  //   await orderUpdatePage.setCloseDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
  //   expect(await orderUpdatePage.getCloseDateInput()).to.contain('2001-01-01T02:30');
  //   await orderUpdatePage.setSecurityTokenNameInput('securityTokenName');
  //   expect(await orderUpdatePage.getSecurityTokenNameInput()).to.match(/securityTokenName/);
  //   await orderUpdatePage.setSymbolInput('symbol');
  //   expect(await orderUpdatePage.getSymbolInput()).to.match(/symbol/);
  //   await orderUpdatePage.typeSelectLastOption();
  //   await orderUpdatePage.limitOrMarketSelectLastOption();
  //   await orderUpdatePage.setVolumeInput('5');
  //   expect(await orderUpdatePage.getVolumeInput()).to.eq('5');
  //   await orderUpdatePage.setPriceInput('5');
  //   expect(await orderUpdatePage.getPriceInput()).to.eq('5');
  //   await orderUpdatePage.setTotalAmountInput('5');
  //   expect(await orderUpdatePage.getTotalAmountInput()).to.eq('5');
  //   await orderUpdatePage.categoryTokenSelectLastOption();
  //   await orderUpdatePage.statusSelectLastOption();
  //   const selectedActive = await orderUpdatePage.getActiveInput().isSelected();
  //   if (selectedActive) {
  //     await orderUpdatePage.getActiveInput().click();
  //     expect(await orderUpdatePage.getActiveInput().isSelected()).to.be.false;
  //   } else {
  //     await orderUpdatePage.getActiveInput().click();
  //     expect(await orderUpdatePage.getActiveInput().isSelected()).to.be.true;
  //   }
  //   await orderUpdatePage.userSelectLastOption();
  //   await orderUpdatePage.transactionSelectLastOption();
  //   await waitUntilDisplayed(orderUpdatePage.saveButton);
  //   await orderUpdatePage.save();
  //   await waitUntilHidden(orderUpdatePage.saveButton);
  //   expect(await isVisible(orderUpdatePage.saveButton)).to.be.false;

  //   expect(await orderComponentsPage.createButton.isEnabled()).to.be.true;

  //   await waitUntilDisplayed(orderComponentsPage.table);

  //   await waitUntilCount(orderComponentsPage.records, beforeRecordsCount + 1);
  //   expect(await orderComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  // });

  // it('should delete last Order', async () => {
  //   const deleteButton = orderComponentsPage.getDeleteButton(orderComponentsPage.records.last());
  //   await click(deleteButton);

  //   orderDeleteDialog = new OrderDeleteDialog();
  //   await waitUntilDisplayed(orderDeleteDialog.deleteModal);
  //   expect(await orderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.order.delete.question/);
  //   await orderDeleteDialog.clickOnConfirmButton();

  //   await waitUntilHidden(orderDeleteDialog.deleteModal);

  //   expect(await isVisible(orderDeleteDialog.deleteModal)).to.be.false;

  //   await waitUntilAnyDisplayed([orderComponentsPage.noRecords, orderComponentsPage.table]);

  //   const afterCount = (await isVisible(orderComponentsPage.noRecords)) ? 0 : await getRecordsCount(orderComponentsPage.table);
  //   expect(afterCount).to.eq(beforeRecordsCount);
  // });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
