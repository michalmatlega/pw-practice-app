import { expect, test } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/');
});

test.describe.only('Form layouts page', () => {
    //test.describe.configure({retries: 2});
    test.describe.configure({mode: 'serial'});

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async({page}, testInfo) => {
        if(testInfo.retry) {
          //do sth
        }

        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"});
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500});

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });

    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});

        // await usingTheGridForm.getByLabel('Option 1').check({force: true});
        const radioOption1 = usingTheGridForm.getByRole('radio', {name: "Option 1"});
        const radioOption2 = usingTheGridForm.getByRole('radio', {name: "Option 2"});

        await radioOption1.check({force: true});    //musi byc force bo .visually-hidden wiec jest ukryty
        const radioStatus = await radioOption1.isChecked();
        expect(radioStatus).toBeTruthy();
        await expect(radioOption1).toBeChecked();

        await radioOption2.check({force: true});
        expect(await radioOption1.isChecked()).toBeFalsy();
        expect(await radioOption2.isChecked()).toBeTruthy();
    });

    test.only('radio buttons visual test', async({page}) => {
      const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});

      // await usingTheGridForm.getByLabel('Option 1').check({force: true});
      const radioOption1 = usingTheGridForm.getByRole('radio', {name: "Option 1"});
      const radioOption2 = usingTheGridForm.getByRole('radio', {name: "Option 2"});

      await radioOption1.check({force: true});    //musi byc force bo .visually-hidden wiec jest ukryty
      await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 10});
    });


})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true});
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true});

    const allBoxes = page.getByRole('checkbox');
    for(const box of await allBoxes.all()) {
        await box.uncheck({force: true});
        expect(await box.isChecked()).toBeFalsy();
    }
});

test('lists and dropdowns', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    page.getByRole('list'); //when the list has a UL tag
    page.getByRole('listitem'); //when the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: "Cosmic"}).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    await dropdownMenu.click();
    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)'
    }

    for(const color in colors) {
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color !== "Corporate")
            await dropdownMenu.click();
    }
});

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"});
    await toolTipCard.getByRole('button', {name: 'Top'}).hover();

    page.getByRole('tooltip'); //if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});

test('dialog box', async({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart table').click();

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?');
    dialog.accept();
  });

  await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
})

test('web tables', async({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //1 get the row by any test in this row
  const targetRow = page.getByRole('row', {name: "twitter@outlook.com"});
  await targetRow.locator('.nb-edit').click();
  await page.locator('input-editor').getByPlaceholder('Age').clear();
  await page.locator('input-editor').getByPlaceholder('Age').fill('35');

  const editButton = page.locator('.nb-checkmark');

  await editButton.click();

  //2 get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
  const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')});
  await targetRowById.locator('.nb-edit').click();
  await page.locator('input-editor').getByPlaceholder('E-mail').clear();
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
  await editButton.click();
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

  //3 test filter of the table

  const ages = ["20", "30", "40", "200"];

  for(let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear();
    await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    await page.waitForTimeout(500);
    const ageRows = page.locator('tbody tr');

    for(let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent();

      if(age === '200') {
        expect(await page.getByRole('table').textContent()).toContain('No data found');
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
})

test('datepicker', async({page}) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const calendarInputField = page.getByPlaceholder('Form Picker');
  await calendarInputField.click();

  await page.locator('.day-cell.ng-star-inserted').getByText('1', {exact: true}).click();
  //await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click();
  await expect(calendarInputField).toHaveValue('Jan 1, 2026');
});

test('datepicker any day in future', async({page}) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const calendarInputField = page.getByPlaceholder('Form Picker');
  await calendarInputField.click();

  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 199);
  const targetMonthNameLong = targetDate.toLocaleString('default', {month: 'long'});
  const targetYear = targetDate.toLocaleString('default', {year: 'numeric'});
  const targetDay = targetDate.toLocaleString('default', {day: 'numeric'});

  const targetDateInSelector = ` ${targetMonthNameLong} ${targetYear} `;

  const targetMonthNameShort = targetDate.toLocaleString('default', {month: 'short'});
  const targetDateToAssert = `${targetMonthNameShort} ${targetDay}, ${targetYear}`;

  let currentMonthYearInSelector = await page.locator('nb-calendar-view-mode').textContent(); //dont put DOT for non classes!!!

  expect(currentMonthYearInSelector).toEqual(' January 2026 ');

  while(!currentMonthYearInSelector.includes(targetDateInSelector)) {
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    currentMonthYearInSelector = await page.locator('nb-calendar-view-mode').textContent();
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(targetDay, {exact: true}).click();
  await expect(calendarInputField).toHaveValue(targetDateToAssert);
});

test('sliders', async({page}) => {
  //update attribute

  // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  // await tempGauge.evaluate(node => {
  //   node.setAttribute('cx', '232.630');
  //   node.setAttribute('cy', '232.630');
  // });
  // await tempGauge.click();

  //Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 100);
  await page.mouse.up();
  await expect(tempBox).toContainText('30');
})
