import { element, by, ElementFinder } from 'protractor';

export default class WhiteListingUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.whiteListing.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateEventInput: ElementFinder = element(by.css('input#white-listing-dateEvent'));
  statusSelect: ElementFinder = element(by.css('select#white-listing-status'));
  activeInput: ElementFinder = element(by.css('input#white-listing-active'));
  stNameInput: ElementFinder = element(by.css('input#white-listing-stName'));
  customerNameInput: ElementFinder = element(by.css('input#white-listing-customerName'));
  userSelect: ElementFinder = element(by.css('#user-results'));
  resultsItem: ElementFinder = element(by.className('item'));
  securitytokenSelect: ElementFinder = element(by.css('#white-listing-results'));

  getPageTitle() {
    return this.pageTitle;
  }

  getActiveInput() {
    return this.activeInput;
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

  async userSelectFirstOption() {
    await this.userSelect
      .all(by.className('item'))
      .first()
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

  async securitytokenSelectFirstOption() {
    await this.securitytokenSelect
      .all(by.className('item'))
      .first()
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
