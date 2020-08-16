import { element, by, ElementFinder } from 'protractor';

export default class SecurityTokenUpdatePage {
  pageTitle: ElementFinder = element(by.id('exchangeApp.securityToken.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  idRedInput: ElementFinder = element(by.css('input#security-token-idRed'));
  nameInput: ElementFinder = element(by.css('input#security-token-name'));
  laucheDateInput: ElementFinder = element(by.css('input#security-token-laucheDate'));
  logoInput: ElementFinder = element(by.css('input#file_logo'));
  symbolInput: ElementFinder = element(by.css('input#security-token-symbol'));
  juridictionSelect: ElementFinder = element(by.css('select#security-token-juridiction'));
  issuerNameInput: ElementFinder = element(by.css('input#security-token-issuerName'));
  issuerCountySelect: ElementFinder = element(by.css('select#security-token-issuerCounty'));
  tokenizationFirmNameInput: ElementFinder = element(by.css('input#security-token-tokenizationFirmName'));
  tokenizationFirmCountrySelect: ElementFinder = element(by.css('select#security-token-tokenizationFirmCountry'));
  kycProviderNameInput: ElementFinder = element(by.css('input#security-token-kycProviderName'));
  kycProviderCountrySelect: ElementFinder = element(by.css('select#security-token-kycProviderCountry'));
  stoPriceInput: ElementFinder = element(by.css('input#security-token-stoPrice'));
  amountRaisedInput: ElementFinder = element(by.css('input#security-token-amountRaised'));
  category: ElementFinder = element(by.css('input#radio-category-EQUITY'));
  summaryInput: ElementFinder = element(by.css('textarea#security-token-summary'));
  descriptionInput: ElementFinder = element(by.css('textarea#security-token-description'));
  restrictionCountyInput: ElementFinder = element(by.css('select#security-token-restrictionCounty'));
  restrictionNationalityInput: ElementFinder = element(by.css('select#security-token-restrictionNationality'));
  prospectusInput: ElementFinder = element(by.css('input#file_prospectus'));
  statusSelect: ElementFinder = element(by.css('select#security-token-status'));
  registrationDateInput: ElementFinder = element(by.css('input#security-token-registrationDate'));
  updateDateInput: ElementFinder = element(by.css('input#security-token-updateDate'));
  dueDiligenceDateInput: ElementFinder = element(by.css('input#security-token-dueDiligenceDate'));
  lastSellingpriceInput: ElementFinder = element(by.css('input#security-token-lastSellingprice'));
  lastBuyingPriceInput: ElementFinder = element(by.css('input#security-token-lastBuyingPrice'));
  smartcontractAddressInput: ElementFinder = element(by.css('input#security-token-smartcontractAddress'));
  kycAddressInput: ElementFinder = element(by.css('input#security-token-kycAddress'));
  websiteInput: ElementFinder = element(by.css('input#security-token-website'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setIdRedInput(idRed) {
    await this.idRedInput.sendKeys(idRed);
  }

  async getIdRedInput() {
    return this.idRedInput.getAttribute('value');
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setLaucheDateInput(laucheDate) {
    await this.laucheDateInput.clear();
    await this.laucheDateInput.sendKeys(laucheDate);
  }

  async getLaucheDateInput() {
    return this.laucheDateInput.getAttribute('value');
  }

  async setLogoInput(logo) {
    await this.logoInput.sendKeys(logo);
  }

  async getLogoInput() {
    return this.logoInput.getAttribute('value');
  }

  async setSymbolInput(symbol) {
    await this.symbolInput.sendKeys(symbol);
  }

  async getSymbolInput() {
    return this.symbolInput.getAttribute('value');
  }

  async setJuridictionSelect(juridiction) {
    await this.juridictionSelect.sendKeys(juridiction);
  }

  async getJuridictionSelect() {
    return this.juridictionSelect.element(by.css('option:checked')).getText();
  }

  async juridictionSelectLastOption() {
    await this.juridictionSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setIssuerNameInput(issuerName) {
    await this.issuerNameInput.sendKeys(issuerName);
  }

  async getIssuerNameInput() {
    return this.issuerNameInput.getAttribute('value');
  }

  async setIssuerCountySelect(issuerCounty) {
    await this.issuerCountySelect.sendKeys(issuerCounty);
  }

  async getIssuerCountySelect() {
    return this.issuerCountySelect.element(by.css('option:checked')).getText();
  }

  async issuerCountySelectLastOption() {
    await this.issuerCountySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setTokenizationFirmNameInput(tokenizationFirmName) {
    await this.tokenizationFirmNameInput.sendKeys(tokenizationFirmName);
  }

  async getTokenizationFirmNameInput() {
    return this.tokenizationFirmNameInput.getAttribute('value');
  }

  async setTokenizationFirmCountrySelect(tokenizationFirmCountry) {
    await this.tokenizationFirmCountrySelect.sendKeys(tokenizationFirmCountry);
  }

  async getTokenizationFirmCountrySelect() {
    return this.tokenizationFirmCountrySelect.element(by.css('option:checked')).getText();
  }

  async tokenizationFirmCountrySelectLastOption() {
    await this.tokenizationFirmCountrySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setKycProviderNameInput(kycProviderName) {
    await this.kycProviderNameInput.sendKeys(kycProviderName);
  }

  async getKycProviderNameInput() {
    return this.kycProviderNameInput.getAttribute('value');
  }

  async setKycProviderCountrySelect(kycProviderCountry) {
    await this.kycProviderCountrySelect.sendKeys(kycProviderCountry);
  }

  async getKycProviderCountrySelect() {
    return this.kycProviderCountrySelect.element(by.css('option:checked')).getText();
  }

  async kycProviderCountrySelectLastOption() {
    await this.kycProviderCountrySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setStoPriceInput(stoPrice) {
    await this.stoPriceInput.sendKeys(stoPrice);
  }

  async getStoPriceInput() {
    return this.stoPriceInput.getAttribute('value');
  }

  async setAmountRaisedInput(amountRaised) {
    await this.amountRaisedInput.sendKeys(amountRaised);
  }

  async getAmountRaisedInput() {
    return this.amountRaisedInput.getAttribute('value');
  }

  async setCategorySelect(category) {
    await this.category.sendKeys(category);
  }

  async getCategorySelect() {
    return this.category.getAttribute('checked');
  }

  async categorySelect() {
    await this.category.click();
  }
  async setSummaryInput(summary) {
    await this.summaryInput.sendKeys(summary);
  }

  async getSummaryInput() {
    return this.summaryInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setRestrictionCountyInput(restrictionCounty) {
    return this.restrictionCountyInput
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getRestrictionCountyInput() {
    await this.restrictionCountyInput.element(by.css('option:checked')).getText();
  }

  async setRestrictionNationalityInput(restrictionNationality) {
    return this.restrictionNationalityInput
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async getRestrictionNationalityInput() {
    return this.restrictionNationalityInput.element(by.css('option:checked')).getText();
  }

  async setProspectusInput(prospectus) {
    await this.prospectusInput.sendKeys(prospectus);
  }

  async getProspectusInput() {
    return this.prospectusInput.getAttribute('value');
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
  async setRegistrationDateInput(registrationDate) {
    await this.registrationDateInput.sendKeys(registrationDate);
  }

  async getRegistrationDateInput() {
    return this.registrationDateInput.getAttribute('value');
  }

  async setUpdateDateInput(updateDate) {
    await this.updateDateInput.sendKeys(updateDate);
  }

  async getUpdateDateInput() {
    return this.updateDateInput.getAttribute('value');
  }

  async setDueDiligenceDateInput(dueDiligenceDate) {
    await this.dueDiligenceDateInput.sendKeys(dueDiligenceDate);
  }

  async getDueDiligenceDateInput() {
    return this.dueDiligenceDateInput.getAttribute('value');
  }

  async setLastSellingpriceInput(lastSellingprice) {
    await this.lastSellingpriceInput.sendKeys(lastSellingprice);
  }

  async getLastSellingpriceInput() {
    return this.lastSellingpriceInput.getAttribute('value');
  }

  async setLastBuyingPriceInput(lastBuyingPrice) {
    await this.lastBuyingPriceInput.sendKeys(lastBuyingPrice);
  }

  async getLastBuyingPriceInput() {
    return this.lastBuyingPriceInput.getAttribute('value');
  }

  async setSmartcontractAddressInput(smartcontractAddress) {
    await this.smartcontractAddressInput.sendKeys(smartcontractAddress);
  }

  async getSmartcontractAddressInput() {
    return this.smartcontractAddressInput.getAttribute('value');
  }

  async setKycAddressInput(kycAddress) {
    await this.kycAddressInput.sendKeys(kycAddress);
  }

  async getKycAddressInput() {
    return this.kycAddressInput.getAttribute('value');
  }

  async setWebsiteInput(website) {
    await this.websiteInput.sendKeys(website);
  }

  async getWebsiteInput() {
    return this.websiteInput.getAttribute('value');
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
