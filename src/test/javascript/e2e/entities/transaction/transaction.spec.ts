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

  it('should load Transactions', async () => {
    await navBarPage.getEntityPage('transaction');
    transactionComponentsPage = new TransactionComponentsPage();
    expect(await transactionComponentsPage.title.getText()).to.match(/Transactions/);

    expect(await transactionComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([transactionComponentsPage.noRecords, transactionComponentsPage.table]);

    beforeRecordsCount = (await isVisible(transactionComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(transactionComponentsPage.table);
  });

  it('should load create Transaction page', async () => {
    await transactionComponentsPage.createButton.click();
    transactionUpdatePage = new TransactionUpdatePage();
    expect(await transactionUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Transaction/);
    await transactionUpdatePage.cancel();
  });

  it('should create and save Transactions', async () => {
    await transactionComponentsPage.createButton.click();
    await transactionUpdatePage.setIdTxInput('idTx');
    expect(await transactionUpdatePage.getIdTxInput()).to.match(/idTx/);
    await transactionUpdatePage.setCreateDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await transactionUpdatePage.getCreateDateInput()).to.contain('2001-01-01T02:30');
    await transactionUpdatePage.setUpdateDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await transactionUpdatePage.getUpdateDateInput()).to.contain('2001-01-01T02:30');
    await transactionUpdatePage.setCloseDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await transactionUpdatePage.getCloseDateInput()).to.contain('2001-01-01T02:30');
    await transactionUpdatePage.setSecurityTokenNameInput('securityTokenName');
    expect(await transactionUpdatePage.getSecurityTokenNameInput()).to.match(/securityTokenName/);
    await transactionUpdatePage.setSymbolInput('symbol');
    expect(await transactionUpdatePage.getSymbolInput()).to.match(/symbol/);
    await transactionUpdatePage.limitOrMarketSelectLastOption();
    await transactionUpdatePage.setVolumeInput('5');
    expect(await transactionUpdatePage.getVolumeInput()).to.eq('5');
    await transactionUpdatePage.setPriceInput('5');
    expect(await transactionUpdatePage.getPriceInput()).to.eq('5');
    await transactionUpdatePage.setTotalAmountInput('5');
    expect(await transactionUpdatePage.getTotalAmountInput()).to.eq('5');
    await transactionUpdatePage.categoryTokenSelectLastOption();
    await transactionUpdatePage.statusSelectLastOption();
    const selectedActive = await transactionUpdatePage.getActiveInput().isSelected();
    if (selectedActive) {
      await transactionUpdatePage.getActiveInput().click();
      expect(await transactionUpdatePage.getActiveInput().isSelected()).to.be.false;
    } else {
      await transactionUpdatePage.getActiveInput().click();
      expect(await transactionUpdatePage.getActiveInput().isSelected()).to.be.true;
    }
    await transactionUpdatePage.setFeeTransactionInput('5');
    expect(await transactionUpdatePage.getFeeTransactionInput()).to.eq('5');
    await transactionUpdatePage.setNumBlockchainTxInput('numBlockchainTx');
    expect(await transactionUpdatePage.getNumBlockchainTxInput()).to.match(/numBlockchainTx/);
    await transactionUpdatePage.setNumBankTxInput('numBankTx');
    expect(await transactionUpdatePage.getNumBankTxInput()).to.match(/numBankTx/);
    await transactionUpdatePage.setConfBlkDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await transactionUpdatePage.getConfBlkDateInput()).to.contain('2001-01-01T02:30');
    await transactionUpdatePage.setConfBankDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await transactionUpdatePage.getConfBankDateInput()).to.contain('2001-01-01T02:30');
    await transactionUpdatePage.setSellerBlkAddressInput('sellerBlkAddress');
    expect(await transactionUpdatePage.getSellerBlkAddressInput()).to.match(/sellerBlkAddress/);
    await transactionUpdatePage.setBuyerBlkAddressInput('buyerBlkAddress');
    expect(await transactionUpdatePage.getBuyerBlkAddressInput()).to.match(/buyerBlkAddress/);
    await transactionUpdatePage.setBuyerIbanInput('buyerIban');
    expect(await transactionUpdatePage.getBuyerIbanInput()).to.match(/buyerIban/);
    await transactionUpdatePage.setSellerIbanInput('sellerIban');
    expect(await transactionUpdatePage.getSellerIbanInput()).to.match(/sellerIban/);
    await transactionUpdatePage.setBuyeridInput('5');
    expect(await transactionUpdatePage.getBuyeridInput()).to.eq('5');
    await transactionUpdatePage.setSelleridInput('5');
    expect(await transactionUpdatePage.getSelleridInput()).to.eq('5');
    await waitUntilDisplayed(transactionUpdatePage.saveButton);
    await transactionUpdatePage.save();
    await waitUntilHidden(transactionUpdatePage.saveButton);
    expect(await isVisible(transactionUpdatePage.saveButton)).to.be.false;

    expect(await transactionComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(transactionComponentsPage.table);

    await waitUntilCount(transactionComponentsPage.records, beforeRecordsCount + 1);
    expect(await transactionComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Transaction', async () => {
    const deleteButton = transactionComponentsPage.getDeleteButton(transactionComponentsPage.records.last());
    await click(deleteButton);

    transactionDeleteDialog = new TransactionDeleteDialog();
    await waitUntilDisplayed(transactionDeleteDialog.deleteModal);
    expect(await transactionDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.transaction.delete.question/);
    await transactionDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(transactionDeleteDialog.deleteModal);

    expect(await isVisible(transactionDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([transactionComponentsPage.noRecords, transactionComponentsPage.table]);

    const afterCount = (await isVisible(transactionComponentsPage.noRecords)) ? 0 : await getRecordsCount(transactionComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
