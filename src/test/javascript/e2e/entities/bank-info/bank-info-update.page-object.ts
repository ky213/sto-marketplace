import { element, by, ElementFinder } from 'protractor';

export default class BankInfoUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.bankInfo.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  bankNameInput: ElementFinder = element(by.css('input#bank-info-bankName'));
  logoInput: ElementFinder = element(by.css('input#file_logo'));
  countrySelect: ElementFinder = element(by.css('select#bank-info-country'));
  bicNumberInput: ElementFinder = element(by.css('input#bank-info-bicNumber'));
  omnibusAccountInput: ElementFinder = element(by.css('input#bank-info-omnibusAccount'));
  fixedFeeInput: ElementFinder = element(by.css('input#bank-info-fixedFee'));
  percentFeeInput: ElementFinder = element(by.css('input#bank-info-percentFee'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setBankNameInput(bankName) {
    await this.bankNameInput.sendKeys(bankName);
  }

  async getBankNameInput() {
    return this.bankNameInput.getAttribute('value');
  }

  async setLogoInput(logo) {
    await this.logoInput.sendKeys(logo);
  }

  async getLogoInput() {
    return this.logoInput.getAttribute('value');
  }

  async setCountrySelect(country) {
    await this.countrySelect.sendKeys(country);
  }

  async getCountrySelect() {
    return this.countrySelect.element(by.css('option:checked')).getText();
  }

  async countrySelectLastOption() {
    await this.countrySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setBicNumberInput(bicNumber) {
    await this.bicNumberInput.sendKeys(bicNumber);
  }

  async getBicNumberInput() {
    return this.bicNumberInput.getAttribute('value');
  }

  async setOmnibusAccountInput(omnibusAccount) {
    await this.omnibusAccountInput.sendKeys(omnibusAccount);
  }

  async getOmnibusAccountInput() {
    return this.omnibusAccountInput.getAttribute('value');
  }

  async setFixedFeeInput(fixedFee) {
    await this.fixedFeeInput.sendKeys(fixedFee);
  }

  async getFixedFeeInput() {
    return this.fixedFeeInput.getAttribute('value');
  }

  async setPercentFeeInput(percentFee) {
    await this.percentFeeInput.sendKeys(percentFee);
  }

  async getPercentFeeInput() {
    return this.percentFeeInput.getAttribute('value');
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
