import { element, by, ElementFinder } from 'protractor';

export default class WhiteListingUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.whiteListing.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateEventInput: ElementFinder = element(by.css('input#white-listing-dateEvent'));
  statusSelect: ElementFinder = element(by.css('select#white-listing-status'));
  activeInput: ElementFinder = element(by.css('input#white-listing-active'));
  ethAddressInput: ElementFinder = element(by.css('input#white-listing-ethAddress'));
  dateSynchBlkInput: ElementFinder = element(by.css('input#white-listing-dateSynchBlk'));
  stNameInput: ElementFinder = element(by.css('input#white-listing-stName'));
  customerNameInput: ElementFinder = element(by.css('input#white-listing-customerName'));
  balanceInput: ElementFinder = element(by.css('input#white-listing-balance'));
  userSelect: ElementFinder = element(by.css('select#white-listing-user'));
  securitytokenSelect: ElementFinder = element(by.css('select#white-listing-securitytoken'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateEventInput(dateEvent) {
    await this.dateEventInput.sendKeys(dateEvent);
  }

  async getDateEventInput() {
    return this.dateEventInput.getAttribute('value');
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
  async setEthAddressInput(ethAddress) {
    await this.ethAddressInput.sendKeys(ethAddress);
  }

  async getEthAddressInput() {
    return this.ethAddressInput.getAttribute('value');
  }

  async setDateSynchBlkInput(dateSynchBlk) {
    await this.dateSynchBlkInput.sendKeys(dateSynchBlk);
  }

  async getDateSynchBlkInput() {
    return this.dateSynchBlkInput.getAttribute('value');
  }

  async setStNameInput(stName) {
    await this.stNameInput.sendKeys(stName);
  }

  async getStNameInput() {
    return this.stNameInput.getAttribute('value');
  }

  async setCustomerNameInput(customerName) {
    await this.customerNameInput.sendKeys(customerName);
  }

  async getCustomerNameInput() {
    return this.customerNameInput.getAttribute('value');
  }

  async setBalanceInput(balance) {
    await this.balanceInput.sendKeys(balance);
  }

  async getBalanceInput() {
    return this.balanceInput.getAttribute('value');
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

  async securitytokenSelectLastOption() {
    await this.securitytokenSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async securitytokenSelectOption(option) {
    await this.securitytokenSelect.sendKeys(option);
  }

  getSecuritytokenSelect() {
    return this.securitytokenSelect;
  }

  async getSecuritytokenSelectedOption() {
    return this.securitytokenSelect.element(by.css('option:checked')).getText();
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
