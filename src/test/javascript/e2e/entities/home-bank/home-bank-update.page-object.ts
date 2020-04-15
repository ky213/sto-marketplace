import { element, by, ElementFinder } from 'protractor';

export default class HomeBankUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.homeBank.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateEventInput: ElementFinder = element(by.css('input#home-bank-dateEvent'));
  custodyBalanceInput: ElementFinder = element(by.css('input#home-bank-custodyBalance'));
  totalUserInput: ElementFinder = element(by.css('input#home-bank-totalUser'));
  volumeOrderInput: ElementFinder = element(by.css('input#home-bank-volumeOrder'));
  totalRevenuInput: ElementFinder = element(by.css('input#home-bank-totalRevenu'));
  equityAllocationInput: ElementFinder = element(by.css('input#home-bank-equityAllocation'));
  fundsAllocationInput: ElementFinder = element(by.css('input#home-bank-fundsAllocation'));
  realEstateAllocationInput: ElementFinder = element(by.css('input#home-bank-realEstateAllocation'));
  derivativeAllocationInput: ElementFinder = element(by.css('input#home-bank-derivativeAllocation'));
  userSelect: ElementFinder = element(by.css('select#home-bank-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateEventInput(dateEvent) {
    await this.dateEventInput.sendKeys(dateEvent);
  }

  async getDateEventInput() {
    return this.dateEventInput.getAttribute('value');
  }

  async setCustodyBalanceInput(custodyBalance) {
    await this.custodyBalanceInput.sendKeys(custodyBalance);
  }

  async getCustodyBalanceInput() {
    return this.custodyBalanceInput.getAttribute('value');
  }

  async setTotalUserInput(totalUser) {
    await this.totalUserInput.sendKeys(totalUser);
  }

  async getTotalUserInput() {
    return this.totalUserInput.getAttribute('value');
  }

  async setVolumeOrderInput(volumeOrder) {
    await this.volumeOrderInput.sendKeys(volumeOrder);
  }

  async getVolumeOrderInput() {
    return this.volumeOrderInput.getAttribute('value');
  }

  async setTotalRevenuInput(totalRevenu) {
    await this.totalRevenuInput.sendKeys(totalRevenu);
  }

  async getTotalRevenuInput() {
    return this.totalRevenuInput.getAttribute('value');
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
