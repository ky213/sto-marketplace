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
  isVisible,
  getToastByInnerText
} from '../../util/utils';
import SecurityTokenDetailsPage, { OrderConfirmDialog } from '../security-token/security-token-details.page-object';

const expect = chai.expect;

describe('Order e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let securityTokenPage: SecurityTokenDetailsPage;
  let orderComponentsPage: OrderComponentsPage;
  let orderConfirmDialog: OrderConfirmDialog;
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

  it('should load security token page', async () => {
    securityTokenPage = new SecurityTokenDetailsPage();
    await securityTokenPage.get();
    expect(await securityTokenPage.title.getText()).to.match(/input disintermediate HDD/);
  });

  it('should create a buy order', async () => {
    securityTokenPage = new SecurityTokenDetailsPage();
    orderConfirmDialog = new OrderConfirmDialog();
    await securityTokenPage.get();
    expect(await securityTokenPage.title.getText()).to.match(/input disintermediate HDD/);
    await securityTokenPage.setPrice(100);
    await securityTokenPage.setVolume(10);
    expect(await securityTokenPage.getPrice()).to.eq('100');
    expect(await securityTokenPage.getVolume()).to.eq('10');
    await securityTokenPage.buyButton.click();
    await waitUntilDisplayed(orderConfirmDialog.orderConfirmModal);
    expect(await orderConfirmDialog.dialogTitle.getText()).to.match(/Confirm order creation/);
    await orderConfirmDialog.clickOnConfirmButton();

    await waitUntilHidden(orderConfirmDialog.orderConfirmModal);

    expect(await isVisible(orderConfirmDialog.orderConfirmModal)).to.be.false;

    await waitUntilDisplayed(orderComponentsPage.table);

    const toast = getToastByInnerText('A new order is created with identifier');

    await waitUntilDisplayed(toast);

    expect(await toast.isPresent()).to.be.true;
  });

  it('should create a sell order', async () => {
    securityTokenPage = new SecurityTokenDetailsPage();
    orderConfirmDialog = new OrderConfirmDialog();
    await securityTokenPage.get();
    expect(await securityTokenPage.title.getText()).to.match(/input disintermediate HDD/);
    await securityTokenPage.setPrice(100);
    await securityTokenPage.setVolume(10);
    expect(await securityTokenPage.getPrice()).to.eq('100');
    expect(await securityTokenPage.getVolume()).to.eq('10');
    await securityTokenPage.sellButton.click();
    await waitUntilDisplayed(orderConfirmDialog.orderConfirmModal);
    expect(await orderConfirmDialog.dialogTitle.getText()).to.match(/Confirm order creation/);
    await orderConfirmDialog.clickOnConfirmButton();

    await waitUntilHidden(orderConfirmDialog.orderConfirmModal);

    expect(await isVisible(orderConfirmDialog.orderConfirmModal)).to.be.false;

    await waitUntilDisplayed(orderComponentsPage.table);
  });

  it('should cancel Order', async () => {
    const deleteButton = orderComponentsPage.getDeleteButton(orderComponentsPage.records.first());
    await click(deleteButton);

    orderDeleteDialog = new OrderDeleteDialog();
    await waitUntilDisplayed(orderDeleteDialog.deleteModal);
    expect(await orderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/order-cancel-dialog-title/);
    await orderDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(orderDeleteDialog.deleteModal);

    expect(await isVisible(orderDeleteDialog.deleteModal)).to.be.false;
    const toast = getToastByInnerText('A order is updated with identifier');

    await waitUntilDisplayed(toast);

    expect(await toast.isPresent()).to.be.true;
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
