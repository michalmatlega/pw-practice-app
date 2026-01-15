import { Page } from '@playwright/test'

export class FormLayoutsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   *
   * @param email
   * @param password
   * @param optionText
   */
  async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator('nb-card', {hasText: 'Using the Grid'});
    await usingTheGridForm.getByRole('textbox', {name: 'Email'}).fill(email);
    await usingTheGridForm.getByRole('textbox', {name: 'Password'}).fill(password);
    await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true}); //force true because is not visible in the code
    await usingTheGridForm.getByRole('button').click();
  }

  /**
   *
   * @param name - should be first and last name
   * @param email - valid email for the test user
   * @param rememberMe - should Remember me checkbox be checked
   */
  async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
    const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'});
    await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name);
    await inlineForm.getByRole('textbox', {name: "Email"}).fill(email);
    if(rememberMe) {
      await inlineForm.getByRole('checkbox').click({force: true});
    }
    await inlineForm.getByRole('button').click();
  }
}
