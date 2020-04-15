import { element, by, ElementFinder } from 'protractor';

export default class UserSettingUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.userSetting.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dateOfBirthInput: ElementFinder = element(by.css('input#user-setting-dateOfBirth'));
  nationalitySelect: ElementFinder = element(by.css('select#user-setting-nationality'));
  phoneNumberInput: ElementFinder = element(by.css('input#user-setting-phoneNumber'));
  positionInput: ElementFinder = element(by.css('input#user-setting-position'));
  addressInput: ElementFinder = element(by.css('input#user-setting-address'));
  codeInput: ElementFinder = element(by.css('input#user-setting-code'));
  cityInput: ElementFinder = element(by.css('input#user-setting-city'));
  countrySelect: ElementFinder = element(by.css('select#user-setting-country'));
  ibanInput: ElementFinder = element(by.css('input#user-setting-iban'));
  ethAddressInput: ElementFinder = element(by.css('input#user-setting-ethAddress'));
  riskProfilInput: ElementFinder = element(by.css('input#user-setting-riskProfil'));
  balanceInput: ElementFinder = element(by.css('input#user-setting-balance'));
  userSelect: ElementFinder = element(by.css('select#user-setting-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDateOfBirthInput(dateOfBirth) {
    await this.dateOfBirthInput.sendKeys(dateOfBirth);
  }

  async getDateOfBirthInput() {
    return this.dateOfBirthInput.getAttribute('value');
  }

  async setNationalitySelect(nationality) {
    await this.nationalitySelect.sendKeys(nationality);
  }

  async getNationalitySelect() {
    return this.nationalitySelect.element(by.css('option:checked')).getText();
  }

  async nationalitySelectLastOption() {
    await this.nationalitySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setPhoneNumberInput(phoneNumber) {
    await this.phoneNumberInput.sendKeys(phoneNumber);
  }

  async getPhoneNumberInput() {
    return this.phoneNumberInput.getAttribute('value');
  }

  async setPositionInput(position) {
    await this.positionInput.sendKeys(position);
  }

  async getPositionInput() {
    return this.positionInput.getAttribute('value');
  }

  async setAddressInput(address) {
    await this.addressInput.sendKeys(address);
  }

  async getAddressInput() {
    return this.addressInput.getAttribute('value');
  }

  async setCodeInput(code) {
    await this.codeInput.sendKeys(code);
  }

  async getCodeInput() {
    return this.codeInput.getAttribute('value');
  }

  async setCityInput(city) {
    await this.cityInput.sendKeys(city);
  }

  async getCityInput() {
    return this.cityInput.getAttribute('value');
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
  async setIbanInput(iban) {
    await this.ibanInput.sendKeys(iban);
  }

  async getIbanInput() {
    return this.ibanInput.getAttribute('value');
  }

  async setEthAddressInput(ethAddress) {
    await this.ethAddressInput.sendKeys(ethAddress);
  }

  async getEthAddressInput() {
    return this.ethAddressInput.getAttribute('value');
  }

  async setRiskProfilInput(riskProfil) {
    await this.riskProfilInput.sendKeys(riskProfil);
  }

  async getRiskProfilInput() {
    return this.riskProfilInput.getAttribute('value');
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
