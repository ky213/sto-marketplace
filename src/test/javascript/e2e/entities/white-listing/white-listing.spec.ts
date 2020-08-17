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
import { assignIn } from 'lodash';

const expect = chai.expect;

describe('WhiteListing e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let whiteListingComponentsPage: WhiteListingComponentsPage;
  let whiteListingUpdatePage: WhiteListingUpdatePage;
  let whiteListingDeleteDialog: WhiteListingDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    navBarPage = new NavBarPage();
    signInPage = new SignInPage();
    whiteListingUpdatePage = new WhiteListingUpdatePage();
    await signInPage.get();

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
    await waitUntilDisplayed(whiteListingUpdatePage.pageTitle);
    expect(await whiteListingUpdatePage.getPageTitle().getText()).to.match(/Create or edit a WhiteListing/);
  });

  it('should create and save WhiteListings', async () => {
    await whiteListingUpdatePage.setCustomerNameInput('user');
    await waitUntilDisplayed(whiteListingUpdatePage.resultsItem);
    await whiteListingUpdatePage.userSelectFirstOption();
    expect(await whiteListingUpdatePage.getCustomerNameInput()).to.contains('user');
    await whiteListingUpdatePage.setStNameInput('Hryvnia projection');
    await waitUntilDisplayed(whiteListingUpdatePage.securitytokenSelect);
    await waitUntilDisplayed(whiteListingUpdatePage.resultsItem);
    await whiteListingUpdatePage.securitytokenSelectFirstOption();
    expect(await whiteListingUpdatePage.getStNameInput()).to.contains('Hryvnia projection');

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
