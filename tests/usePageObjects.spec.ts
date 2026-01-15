import { expect, test } from '@playwright/test'
import { NavigationPage } from "../page-objects/navigationPage"
import {FormLayoutsPage} from "../page-objects/formLayoutsPage";
import {DatepickerPage} from "../page-objects/datepickerPage";
import {PageManager} from "../page-objects/pageManager";

test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200/');
});

test('navigate to form page', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
})

test('fill the forms', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'password', 'Option 2');
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('test@test.com', 'password', true);
})

test('fill the datepickers', async ({page}) => {
  const pm = new PageManager(page);
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10);
  await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(3,15);
})
