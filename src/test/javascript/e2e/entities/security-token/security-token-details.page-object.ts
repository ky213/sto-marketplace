import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

export default class SecurityTokenDetailsPage {
  buyButton: ElementFinder = element(by.id('buy-button'));
  sellButton: ElementFinder = element(by.id('sell-button'));
  priceInput: ElementFinder = element(by.id('price'));
  volumeInput: ElementFinder = element(by.id('volume'));
  title: ElementFinder = element(by.id('st-name'));

  async clickOnBuyButton() {
    await this.buyButton.click();
  }

  async clickOnSellButton() {
    await this.sellButton.click();
  }
}

export class OrderConfirmDialog {
  orderConfirmModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('confirm-order-title'));
  private confirmButton = element(by.id('confirm-order'));
  private cancelButton = element(by.id('cancel-order'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
  async clickOnCancelButton() {
    await this.cancelButton.click();
  }
}
