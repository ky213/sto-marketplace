import { $, element, by, ElementFinder, browser } from 'protractor';
import BasePage from '../../page-objects/base-component';

const selector: ElementFinder = $('#st-name');

export default class SecurityTokenDetailsPage extends BasePage {
  buyButton: ElementFinder = element(by.id('buy-button'));
  sellButton: ElementFinder = element(by.id('sell-button'));
  priceInput: ElementFinder = element(by.id('price'));
  volumeInput: ElementFinder = element(by.id('volume'));
  title: ElementFinder = element(by.id('st-name'));

  constructor() {
    super(selector);
    this.selector = selector;
  }

  async get() {
    await browser.get('/security-token/2/user');
    await this.waitUntilDisplayed();
  }

  async getPrice() {
    return await this.priceInput.getAttribute('value');
  }

  async getVolume() {
    return await this.volumeInput.getAttribute('value');
  }

  async setPrice(price: number) {
    await this.priceInput.clear();
    await this.priceInput.sendKeys(price);
  }

  async setVolume(volume: number) {
    await this.volumeInput.clear();
    await this.volumeInput.sendKeys(volume);
  }

  async clickOnBuyButton() {
    await this.buyButton.click();
  }

  async clickOnSellButton() {
    await this.sellButton.click();
  }
}

export class OrderConfirmDialog {
  orderConfirmModal = element(by.className('modal'));
  dialogTitle: ElementFinder = element(by.id('confirm-order-title'));
  confirmButton = element(by.id('confirm-order'));
  cancelButton = element(by.id('cancel-order'));

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
  async clickOnCancelButton() {
    await this.cancelButton.click();
  }
}
