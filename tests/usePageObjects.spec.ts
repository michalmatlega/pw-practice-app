import { test } from '@playwright/test'
import {PageManager} from "../page-objects/pageManager";
import { faker } from '@faker-js/faker';

test.beforeEach(async({page}) => {
  await page.goto('/');
});

test.afterEach(async({page}) => {
  //await page.pause();
});

test('navigate to form page', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
})

test('parametrized methods', async ({page}) => {
  const pm = new PageManager(page);
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;
  await pm.navigateTo().formLayoutsPage();
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.EMAIL, process.env.PASSWORD, 'Option 2');
  await page.waitForTimeout(500);
  await page.screenshot({path: 'screenshots/formLayoutsPage.png'});
  await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'});
  // const buffer = await page.screenshot();
  // console.log(buffer.toString('base64'));
})

test('fill the datepickers', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10);
  await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(3,15);
})

test.only('testing with argos CI', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
})

