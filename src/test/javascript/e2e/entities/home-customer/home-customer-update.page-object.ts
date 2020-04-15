import { element, by, ElementFinder } from 'protractor';

export default class HomeCustomerUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.homeCustomer.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateEventInput: ElementFinder = element(by.css('input#home-customer-dateEvent'));
  tokenBalanceInput: ElementFinder = element(by.css('input#home-customer-tokenBalance'));
  bigestTokenNameInput: ElementFinder = element(by.css('input#home-customer-bigestTokenName'));
  bigestTokenValueInput: ElementFinder = element(by.css('input#home-customer-bigestTokenValue'));
  secondTokenNameInput: ElementFinder = element(by.css('input#home-customer-secondTokenName'));
  secondTokenValueInput: ElementFinder = element(by.css('input#home-customer-secondTokenValue'));
  bankBalanceInput: ElementFinder = element(by.css('input#home-customer-bankBalance'));
  equityAllocationInput: ElementFinder = element(by.css('input#home-customer-equityAllocation'));
  fundsAllocationInput: ElementFinder = element(by.css('input#home-customer-fundsAllocation'));
  realEstateAllocationInput: ElementFinder = element(by.css('input#home-customer-realEstateAllocation'));
  derivativeAllocationInput: ElementFinder = element(by.css('input#home-customer-derivativeAllocation'));
  userSelect: ElementFinder = element(by.css('select#home-customer-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateEventInput(dateEvent) {
    await this.dateEventInput.sendKeys(dateEvent);
  }

  async getDateEventInput() {
    return this.dateEventInput.getAttribute('value');
  }

  async setTokenBalanceInput(tokenBalance) {
    await this.tokenBalanceInput.sendKeys(tokenBalance);
  }

  async getTokenBalanceInput() {
    return this.tokenBalanceInput.getAttribute('value');
  }

  async setBigestTokenNameInput(bigestTokenName) {
    await this.bigestTokenNameInput.sendKeys(bigestTokenName);
  }

  async getBigestTokenNameInput() {
    return this.bigestTokenNameInput.getAttribute('value');
  }

  async setBigestTokenValueInput(bigestTokenValue) {
    await this.bigestTokenValueInput.sendKeys(bigestTokenValue);
  }

  async getBigestTokenValueInput() {
    return this.bigestTokenValueInput.getAttribute('value');
  }

  async setSecondTokenNameInput(secondTokenName) {
    await this.secondTokenNameInput.sendKeys(secondTokenName);
  }

  async getSecondTokenNameInput() {
    return this.secondTokenNameInput.getAttribute('value');
  }

  async setSecondTokenValueInput(secondTokenValue) {
    await this.secondTokenValueInput.sendKeys(secondTokenValue);
  }

  async getSecondTokenValueInput() {
    return this.secondTokenValueInput.getAttribute('value');
  }

  async setBankBalanceInput(bankBalance) {
    await this.bankBalanceInput.sendKeys(bankBalance);
  }

  async getBankBalanceInput() {
    return this.bankBalanceInput.getAttribute('value');
  }

  async setEquityAllocationInput(equityAllocation) {
    await this.equityAllocationInput.sendKeys(equityAllocation);
  }

  async getEquityAllocationInput() {
    return this.equityAllocationInput.getAttribute('value');
  }

  async setFundsAllocationInput(fundsAllocation) {
    await this.fundsAllocationInput.sendKeys(fundsAllocation);
  }

  async getFundsAllocationInput() {
    return this.fundsAllocationInput.getAttribute('value');
  }

  async setRealEstateAllocationInput(realEstateAllocation) {
    await this.realEstateAllocationInput.sendKeys(realEstateAllocation);
  }

  async getRealEstateAllocationInput() {
    return this.realEstateAllocationInput.getAttribute('value');
  }

  async setDerivativeAllocationInput(derivativeAllocation) {
    await this.derivativeAllocationInput.sendKeys(derivativeAllocation);
  }

  async getDerivativeAllocationInput() {
    return this.derivativeAllocationInput.getAttribute('value');
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
