import { ElementFinder, browser, $ } from 'protractor';

import BasePage from './base-component';

const selector: ElementFinder = $('#register-form');
export default class RegisterPage extends BasePage {
  selector: ElementFinder;
  username: ElementFinder = this.selector.$('#username');
  email: ElementFinder = this.selector.$('#email');
  saveButton: ElementFinder = this.selector.$('button[type=submit]');
  title: ElementFinder = $('#register-title');

  constructor() {
    super(selector);
    this.selector = selector;
  }

  async get() {
    await browser.get('/admin/user-management/new');
    await this.waitUntilDisplayed();
  }

  async getTitle() {
    return this.title.getAttribute('id');
  }

  async setUserName(username: string) {
    await this.username.sendKeys(username);
  }

  async setEmail(email: string) {
    await this.email.sendKeys(email);
  }

  async autoSignUpUsing(username: string, email: string, password: string) {
    await this.setUserName(username);
    await this.setEmail(email);
    await this.save();
  }

  async save() {
    await this.saveButton.click();
  }
}
