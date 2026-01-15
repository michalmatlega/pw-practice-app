import {expect, Page} from '@playwright/test'

export class DatepickerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Form Picker');
    await calendarInputField.click();
    const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday);
    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Range Picker');
    await calendarInputField.click();
    const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday);
    const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday);
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + numberOfDaysFromToday);
    const targetMonthNameLong = targetDate.toLocaleString('default', {month: 'long'});
    const targetYear = targetDate.toLocaleString('default', {year: 'numeric'});
    const targetDay = targetDate.toLocaleString('default', {day: 'numeric'});

    const targetDateInSelector = ` ${targetMonthNameLong} ${targetYear} `;

    const targetMonthNameShort = targetDate.toLocaleString('default', {month: 'short'});
    const targetDateToAssert = `${targetMonthNameShort} ${targetDay}, ${targetYear}`;

    let currentMonthYearInSelector = await this.page.locator('nb-calendar-view-mode').textContent(); //dont put DOT for non classes!!!

    while(!currentMonthYearInSelector.includes(targetDateInSelector)) {
      await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
      currentMonthYearInSelector = await this.page.locator('nb-calendar-view-mode').textContent();
    }

    await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(targetDay, {exact: true}).click();
    return targetDateToAssert;
  }
}
