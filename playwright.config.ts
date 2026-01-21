import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
// @ts-ignore
import {createArgosReporterOptions} from "@argos-ci/playwright/reporter";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 40000,
  //globalTimeout: 60000,

  expect: {
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },
  retries: 0,  //tu ustawiasz ile razy ma sie powtorzyc w razie failu
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      }),
    ],
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright'],
    ['html']
  ],
  use: {
    baseURL: 'http://localhost:4200',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/'
      }
    },
    {
      name: 'chromium',
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
    }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    timeout: 120000,
  }
});
