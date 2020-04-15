import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WhiteListingComponentsPage, { WhiteListingDeleteDialog } from './white-listing.page-object';
import WhiteListingUpdatePage from './white-listing-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('WhiteListing e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let whiteListingComponentsPage: WhiteListingComponentsPage;
  let whiteListingUpdatePage: WhiteListingUpdatePage;
  let whiteListingDeleteDialog: WhiteListingDeleteDialog;
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

  it('should load WhiteListings', async () => {
    await navBarPage.getEntityPage('white-listing');
    whiteListingComponentsPage = new WhiteListingComponentsPage();
    expect(await whiteListingComponentsPage.title.getText()).to.match(/White Listings/);

    expect(await whiteListingComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([whiteListingComponentsPage.noRecords, whiteListingComponentsPage.table]);

    beforeRecordsCount = (await isVisible(whiteListingComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(whiteListingComponentsPage.table);
  });

  it('should load create WhiteListing page', async () => {
    await whiteListingComponentsPage.createButton.click();
    whiteListingUpdatePage = new WhiteListingUpdatePage();
    expect(await whiteListingUpdatePage.getPageTitle().getText()).to.match(/Create or edit a WhiteListing/);
    await whiteListingUpdatePage.cancel();
  });

  it('should create and save WhiteListings', async () => {
    await whiteListingComponentsPage.createButton.click();
    await whiteListingUpdatePage.setDateEventInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await whiteListingUpdatePage.getDateEventInput()).to.contain('2001-01-01T02:30');
    await whiteListingUpdatePage.statusSelectLastOption();
    const selectedActive = await whiteListingUpdatePage.getActiveInput().isSelected();
    if (selectedActive) {
      await whiteListingUpdatePage.getActiveInput().click();
      expect(await whiteListingUpdatePage.getActiveInput().isSelected()).to.be.false;
    } else {
      await whiteListingUpdatePage.getActiveInput().click();
      expect(await whiteListingUpdatePage.getActiveInput().isSelected()).to.be.true;
    }
    await whiteListingUpdatePage.setEthAddressInput('ethAddress');
    expect(await whiteListingUpdatePage.getEthAddressInput()).to.match(/ethAddress/);
    await whiteListingUpdatePage.setDateSynchBlkInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await whiteListingUpdatePage.getDateSynchBlkInput()).to.contain('2001-01-01T02:30');
    await whiteListingUpdatePage.setStNameInput('stName');
    expect(await whiteListingUpdatePage.getStNameInput()).to.match(/stName/);
    await whiteListingUpdatePage.setCustomerNameInput('customerName');
    expect(await whiteListingUpdatePage.getCustomerNameInput()).to.match(/customerName/);
    await whiteListingUpdatePage.setBalanceInput('5');
    expect(await whiteListingUpdatePage.getBalanceInput()).to.eq('5');
    await whiteListingUpdatePage.userSelectLastOption();
    await whiteListingUpdatePage.securitytokenSelectLastOption();
    await waitUntilDisplayed(whiteListingUpdatePage.saveButton);
    await whiteListingUpdatePage.save();
    await waitUntilHidden(whiteListingUpdatePage.saveButton);
    expect(await isVisible(whiteListingUpdatePage.saveButton)).to.be.false;

    expect(await whiteListingComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(whiteListingComponentsPage.table);

    await waitUntilCount(whiteListingComponentsPage.records, beforeRecordsCount + 1);
    expect(await whiteListingComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last WhiteListing', async () => {
    const deleteButton = whiteListingComponentsPage.getDeleteButton(whiteListingComponentsPage.records.last());
    await click(deleteButton);

    whiteListingDeleteDialog = new WhiteListingDeleteDialog();
    await waitUntilDisplayed(whiteListingDeleteDialog.deleteModal);
    expect(await whiteListingDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/exchangeApp.whiteListing.delete.question/);
    await whiteListingDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(whiteListingDeleteDialog.deleteModal);

    expect(await isVisible(whiteListingDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([whiteListingComponentsPage.noRecords, whiteListingComponentsPage.table]);

    const afterCount = (await isVisible(whiteListingComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(whiteListingComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
