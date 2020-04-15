import { element, by, ElementFinder } from 'protractor';

export default class TransactionUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.transaction.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  idTxInput: ElementFinder = element(by.css('input#transaction-idTx'));
  createDateInput: ElementFinder = element(by.css('input#transaction-createDate'));
  updateDateInput: ElementFinder = element(by.css('input#transaction-updateDate'));
  closeDateInput: ElementFinder = element(by.css('input#transaction-closeDate'));
  securityTokenNameInput: ElementFinder = element(by.css('input#transaction-securityTokenName'));
  symbolInput: ElementFinder = element(by.css('input#transaction-symbol'));
  limitOrMarketSelect: ElementFinder = element(by.css('select#transaction-limitOrMarket'));
  volumeInput: ElementFinder = element(by.css('input#transaction-volume'));
  priceInput: ElementFinder = element(by.css('input#transaction-price'));
  totalAmountInput: ElementFinder = element(by.css('input#transaction-totalAmount'));
  categoryTokenSelect: ElementFinder = element(by.css('select#transaction-categoryToken'));
  statusSelect: ElementFinder = element(by.css('select#transaction-status'));
  activeInput: ElementFinder = element(by.css('input#transaction-active'));
  feeTransactionInput: ElementFinder = element(by.css('input#transaction-feeTransaction'));
  numBlockchainTxInput: ElementFinder = element(by.css('input#transaction-numBlockchainTx'));
  numBankTxInput: ElementFinder = element(by.css('input#transaction-numBankTx'));
  confBlkDateInput: ElementFinder = element(by.css('input#transaction-confBlkDate'));
  confBankDateInput: ElementFinder = element(by.css('input#transaction-confBankDate'));
  sellerBlkAddressInput: ElementFinder = element(by.css('input#transaction-sellerBlkAddress'));
  buyerBlkAddressInput: ElementFinder = element(by.css('input#transaction-buyerBlkAddress'));
  buyerIbanInput: ElementFinder = element(by.css('input#transaction-buyerIban'));
  sellerIbanInput: ElementFinder = element(by.css('input#transaction-sellerIban'));
  buyeridInput: ElementFinder = element(by.css('input#transaction-buyerid'));
  selleridInput: ElementFinder = element(by.css('input#transaction-sellerid'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setIdTxInput(idTx) {
    await this.idTxInput.sendKeys(idTx);
  }

  async getIdTxInput() {
    return this.idTxInput.getAttribute('value');
  }

  async setCreateDateInput(createDate) {
    await this.createDateInput.sendKeys(createDate);
  }

  async getCreateDateInput() {
    return this.createDateInput.getAttribute('value');
  }

  async setUpdateDateInput(updateDate) {
    await this.updateDateInput.sendKeys(updateDate);
  }

  async getUpdateDateInput() {
    return this.updateDateInput.getAttribute('value');
  }

  async setCloseDateInput(closeDate) {
    await this.closeDateInput.sendKeys(closeDate);
  }

  async getCloseDateInput() {
    return this.closeDateInput.getAttribute('value');
  }

  async setSecurityTokenNameInput(securityTokenName) {
    await this.securityTokenNameInput.sendKeys(securityTokenName);
  }

  async getSecurityTokenNameInput() {
    return this.securityTokenNameInput.getAttribute('value');
  }

  async setSymbolInput(symbol) {
    await this.symbolInput.sendKeys(symbol);
  }

  async getSymbolInput() {
    return this.symbolInput.getAttribute('value');
  }

  async setLimitOrMarketSelect(limitOrMarket) {
    await this.limitOrMarketSelect.sendKeys(limitOrMarket);
  }

  async getLimitOrMarketSelect() {
    return this.limitOrMarketSelect.element(by.css('option:checked')).getText();
  }

  async limitOrMarketSelectLastOption() {
    await this.limitOrMarketSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setVolumeInput(volume) {
    await this.volumeInput.sendKeys(volume);
  }

  async getVolumeInput() {
    return this.volumeInput.getAttribute('value');
  }

  async setPriceInput(price) {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput() {
    return this.priceInput.getAttribute('value');
  }

  async setTotalAmountInput(totalAmount) {
    await this.totalAmountInput.sendKeys(totalAmount);
  }

  async getTotalAmountInput() {
    return this.totalAmountInput.getAttribute('value');
  }

  async setCategoryTokenSelect(categoryToken) {
    await this.categoryTokenSelect.sendKeys(categoryToken);
  }

  async getCategoryTokenSelect() {
    return this.categoryTokenSelect.element(by.css('option:checked')).getText();
  }

  async categoryTokenSelectLastOption() {
    await this.categoryTokenSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  getActiveInput() {
    return this.activeInput;
  }
  async setFeeTransactionInput(feeTransaction) {
    await this.feeTransactionInput.sendKeys(feeTransaction);
  }

  async getFeeTransactionInput() {
    return this.feeTransactionInput.getAttribute('value');
  }

  async setNumBlockchainTxInput(numBlockchainTx) {
    await this.numBlockchainTxInput.sendKeys(numBlockchainTx);
  }

  async getNumBlockchainTxInput() {
    return this.numBlockchainTxInput.getAttribute('value');
  }

  async setNumBankTxInput(numBankTx) {
    await this.numBankTxInput.sendKeys(numBankTx);
  }

  async getNumBankTxInput() {
    return this.numBankTxInput.getAttribute('value');
  }

  async setConfBlkDateInput(confBlkDate) {
    await this.confBlkDateInput.sendKeys(confBlkDate);
  }

  async getConfBlkDateInput() {
    return this.confBlkDateInput.getAttribute('value');
  }

  async setConfBankDateInput(confBankDate) {
    await this.confBankDateInput.sendKeys(confBankDate);
  }

  async getConfBankDateInput() {
    return this.confBankDateInput.getAttribute('value');
  }

  async setSellerBlkAddressInput(sellerBlkAddress) {
    await this.sellerBlkAddressInput.sendKeys(sellerBlkAddress);
  }

  async getSellerBlkAddressInput() {
    return this.sellerBlkAddressInput.getAttribute('value');
  }

  async setBuyerBlkAddressInput(buyerBlkAddress) {
    await this.buyerBlkAddressInput.sendKeys(buyerBlkAddress);
  }

  async getBuyerBlkAddressInput() {
    return this.buyerBlkAddressInput.getAttribute('value');
  }

  async setBuyerIbanInput(buyerIban) {
    await this.buyerIbanInput.sendKeys(buyerIban);
  }

  async getBuyerIbanInput() {
    return this.buyerIbanInput.getAttribute('value');
  }

  async setSellerIbanInput(sellerIban) {
    await this.sellerIbanInput.sendKeys(sellerIban);
  }

  async getSellerIbanInput() {
    return this.sellerIbanInput.getAttribute('value');
  }

  async setBuyeridInput(buyerid) {
    await this.buyeridInput.sendKeys(buyerid);
  }

  async getBuyeridInput() {
    return this.buyeridInput.getAttribute('value');
  }

  async setSelleridInput(sellerid) {
    await this.selleridInput.sendKeys(sellerid);
  }

  async getSelleridInput() {
    return this.selleridInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
