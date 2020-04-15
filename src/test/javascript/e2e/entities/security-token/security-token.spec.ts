import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SecurityTokenComponentsPage, { SecurityTokenDeleteDialog } from './security-token.page-object';
import SecurityTokenUpdatePage from './security-token-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('SecurityToken e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let securityTokenComponentsPage: SecurityTokenComponentsPage;
  let securityTokenUpdatePage: SecurityTokenUpdatePage;
  let securityTokenDeleteDialog: SecurityTokenDeleteDialog;
  const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);
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

  it('should load SecurityTokens', async () => {
    await navBarPage.getEntityPage('security-token');
    securityTokenComponentsPage = new SecurityTokenComponentsPage();
    expect(await securityTokenComponentsPage.title.getText()).to.match(/Security Tokens/);

    expect(await securityTokenComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([securityTokenComponentsPage.noRecords, securityTokenComponentsPage.table]);

    beforeRecordsCount = (await isVisible(securityTokenComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(securityTokenComponentsPage.table);
  });

  it('should load create SecurityToken page', async () => {
    await securityTokenComponentsPage.createButton.click();
    securityTokenUpdatePage = new SecurityTokenUpdatePage();
    expect(await securityTokenUpdatePage.getPageTitle().getText()).to.match(/Create or edit a SecurityToken/);
    await securityTokenUpdatePage.cancel();
  });

  it('should create and save SecurityTokens', async () => {
    await securityTokenComponentsPage.createButton.click();
    await securityTokenUpdatePage.setIdRedInput('idRed');
    expect(await securityTokenUpdatePage.getIdRedInput()).to.match(/idRed/);
    await securityTokenUpdatePage.setNameInput('name');
    expect(await securityTokenUpdatePage.getNameInput()).to.match(/name/);
    await securityTokenUpdatePage.setLaucheDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await securityTokenUpdatePage.getLaucheDateInput()).to.contain('2001-01-01T02:30');
    await securityTokenUpdatePage.setLogoInput(absolutePath);
    await securityTokenUpdatePage.setSymbolInput('symbol');
    expect(await securityTokenUpdatePage.getSymbolInput()).to.match(/symbol/);
    await securityTokenUpdatePage.juridictionSelectLastOption();
    await securityTokenUpdatePage.setIssuerNameInput('issuerName');
    expect(await securityTokenUpdatePage.getIssuerNameInput()).to.match(/issuerName/);
    await securityTokenUpdatePage.issuerCountySelectLastOption();
    await securityTokenUpdatePage.setTokenizationFirmNameInput('tokenizationFirmName');
    expect(await securityTokenUpdatePage.getTokenizationFirmNameInput()).to.match(/tokenizationFirmName/);
    await securityTokenUpdatePage.tokenizationFirmCountrySelectLastOption();
    await securityTokenUpdatePage.setKycProviderNameInput('kycProviderName');
    expect(await securityTokenUpdatePage.getKycProviderNameInput()).to.match(/kycProviderName/);
    await securityTokenUpdatePage.kycProviderCountrySelectLastOption();
    await securityTokenUpdatePage.setStoPriceInput('5');
    expect(await securityTokenUpdatePage.getStoPriceInput()).to.eq('5');
    await securityTokenUpdatePage.setAmountRaisedInput('5');
    expect(await securityTokenUpdatePage.getAmountRaisedInput()).to.eq('5');
    await securityTokenUpdatePage.categorySelectLastOption();
    await securityTokenUpdatePage.setSummaryInput('summary');
    expect(await securityTokenUpdatePage.getSummaryInput()).to.match(/summary/);
    await securityTokenUpdatePage.setDescriptionInput('description');
    expect(await securityTokenUpdatePage.getDescriptionInput()).to.match(/description/);
    await securityTokenUpdatePage.setRestrictionCountyInput('restrictionCounty');
    expect(await securityTokenUpdatePage.getRestrictionCountyInput()).to.match(/restrictionCounty/);
    await securityTokenUpdatePage.setRestrictionNationalityInput('restrictionNationality');
    expect(await securityTokenUpdatePage.getRestrictionNationalityInput()).to.match(/restrictionNationality/);
    await securityTokenUpdatePage.setProspectusInput(absolutePath);
    await securityTokenUpdatePage.statusSelectLastOption();
    await securityTokenUpdatePage.setRegistrationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await securityTokenUpdatePage.getRegistrationDateInput()).to.contain('2001-01-01T02:30');
    await securityTokenUpdatePage.setUpdateDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await securityTokenUpdatePage.getUpdateDateInput()).to.contain('2001-01-01T02:30');
    await securityTokenUpdatePage.setDueDiligenceDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await securityTokenUpdatePage.getDueDiligenceDateInput()).to.contain('2001-01-01T02:30');
    await securityTokenUpdatePage.setLastSellingpriceInput('5');
    expect(await securityTokenUpdatePage.getLastSellingpriceInput()).to.eq('5');
    await securityTokenUpdatePage.setLastBuyingPriceInput('5');
    expect(await securityTokenUpdatePage.getLastBuyingPriceInput()).to.eq('5');
    await securityTokenUpdatePage.setSmartcontractAddressInput('smartcontractAddress');
    expect(await securityTokenUpdatePage.getSmartcontractAddressInput()).to.match(/smartcontractAddress/);
    await securityTokenUpdatePage.setKycAddressInput('kycAddress');
    expect(await securityTokenUpdatePage.getKycAddressInput()).to.match(/kycAddress/);
    await securityTokenUpdatePage.setWebsiteInput('website');
    expect(await securityTokenUpdatePage.getWebsiteInput()).to.match(/website/);
    await waitUntilDisplayed(securityTokenUpdatePage.saveButton);
    await securityTokenUpdatePage.save();
    await waitUntilHidden(securityTokenUpdatePage.saveButton);
    expect(await isVisible(securityTokenUpdatePage.saveButton)).to.be.false;

    expect(await securityTokenComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(securityTokenComponentsPage.table);

    await waitUntilCount(securityTokenComponentsPage.records, beforeRecordsCount + 1);
    expect(await securityTokenComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last SecurityToken', async () => {
    const deleteButton = securityTokenComponentsPage.getDeleteButton(securityTokenComponentsPage.records.last());
    await click(deleteButton);

    securityTokenDeleteDialog = new SecurityTokenDeleteDialog();
    await waitUntilDisplayed(securityTokenDeleteDialog.deleteModal);
    expect(await securityTokenDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.securityToken.delete.question/);
    await securityTokenDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(securityTokenDeleteDialog.deleteModal);

    expect(await isVisible(securityTokenDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([securityTokenComponentsPage.noRecords, securityTokenComponentsPage.table]);

    const afterCount = (await isVisible(securityTokenComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(securityTokenComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
