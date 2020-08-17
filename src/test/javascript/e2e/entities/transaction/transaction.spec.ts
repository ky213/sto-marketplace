import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TransactionComponentsPage, { TransactionDeleteDialog } from './transaction.page-object';
import TransactionUpdatePage from './transaction-update.page-object';
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

describe('Transaction e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transactionComponentsPage: TransactionComponentsPage;
  let transactionUpdatePage: TransactionUpdatePage;
  let transactionDeleteDialog: TransactionDeleteDialog;
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

  it('should load Transactions', async () => {
    await navBarPage.getEntityPage('transaction');
    transactionComponentsPage = new TransactionComponentsPage();
    expect(await transactionComponentsPage.title.getText()).to.match(/Transactions/);

    await waitUntilAnyDisplayed([transactionComponentsPage.noRecords, transactionComponentsPage.table]);

    beforeRecordsCount = (await isVisible(transactionComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(transactionComponentsPage.table);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
