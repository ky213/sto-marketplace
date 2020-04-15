import { element, by, ElementFinder } from 'protractor';

export default class OrderUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.order.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  idOrderInput: ElementFinder = element(by.css('input#order-idOrder'));
  refOrderInput: ElementFinder = element(by.css('input#order-refOrder'));
  createDateInput: ElementFinder = element(by.css('input#order-createDate'));
  updateDateInput: ElementFinder = element(by.css('input#order-updateDate'));
  closeDateInput: ElementFinder = element(by.css('input#order-closeDate'));
  securityTokenNameInput: ElementFinder = element(by.css('input#order-securityTokenName'));
  symbolInput: ElementFinder = element(by.css('input#order-symbol'));
  typeSelect: ElementFinder = element(by.css('select#order-type'));
  limitOrMarketSelect: ElementFinder = element(by.css('select#order-limitOrMarket'));
  volumeInput: ElementFinder = element(by.css('input#order-volume'));
  priceInput: ElementFinder = element(by.css('input#order-price'));
  totalAmountInput: ElementFinder = element(by.css('input#order-totalAmount'));
  categoryTokenSelect: ElementFinder = element(by.css('select#order-categoryToken'));
  statusSelect: ElementFinder = element(by.css('select#order-status'));
  activeInput: ElementFinder = element(by.css('input#order-active'));
  userSelect: ElementFinder = element(by.css('select#order-user'));
  transactionSelect: ElementFinder = element(by.css('select#order-transaction'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setIdOrderInput(idOrder) {
    await this.idOrderInput.sendKeys(idOrder);
  }

  async getIdOrderInput() {
    return this.idOrderInput.getAttribute('value');
  }

  async setRefOrderInput(refOrder) {
    await this.refOrderInput.sendKeys(refOrder);
  }

  async getRefOrderInput() {
    return this.refOrderInput.getAttribute('value');
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

  async setTypeSelect(type) {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect() {
    return this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption() {
    await this.typeSelect
      .all(by.tagName('option'))
      .last()
      .click();
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
  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async transactionSelectLastOption() {
    await this.transactionSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async transactionSelectOption(option) {
    await this.transactionSelect.sendKeys(option);
  }

  getTransactionSelect() {
    return this.transactionSelect;
  }

  async getTransactionSelectedOption() {
    return this.transactionSelect.element(by.css('option:checked')).getText();
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
