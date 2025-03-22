import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { startEnv, stopEnv } from './morelogin.js';
import dotenv from 'dotenv';

dotenv.config('.env');

// Load environment variables from .env
const {
  ENV_ID,
  BASE_BREAK_TIME,
  TELEGRAM_URL,
  WAIT_TIME_MIN,
  WAIT_TIME_MAX,
  ADDITIONAL_TIME_MIN,
  ADDITIONAL_TIME_MAX,
} = process.env;

// Convert time values to integers
const baseBreakTime = parseInt(BASE_BREAK_TIME);
const waitTimeMin = parseInt(WAIT_TIME_MIN);
const waitTimeMax = parseInt(WAIT_TIME_MAX);
const additionalTimeMin = parseInt(ADDITIONAL_TIME_MIN);
const additionalTimeMax = parseInt(ADDITIONAL_TIME_MAX);

// Connect stealth plugin to puppeteer to bypass detection
puppeteer.use(StealthPlugin());

// Universal delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function emulateHumanActions(page) {
  try {
    // 1. Open Telegram Web page
    await page.goto(TELEGRAM_URL, { waitUntil: 'load' });
    console.log('Opened Telegram page');

    // 2. Wait for 10 seconds
    await delay(10000);

    // 3. Search and click the bot commands button
    console.log('Searching for bot command button');
    const botCommandsButton = await page.waitForSelector('.new-message-bot-commands-view', { visible: true });
    await botCommandsButton.click();
    console.log('Bot command button clicked');

    // 4. Wait for 30 seconds for iframe to load
    console.log('Waiting 30 seconds for iframe to load');
    await delay(30000);

    // 5. Search for the "Start Mining" button inside iframe
    console.log('Searching for Start Mining button inside iframe');
    const iframeElement = await page.waitForSelector('iframe', { visible: true });
    const iframe = await iframeElement.contentFrame();

    if (!iframe) {
      throw new Error('Failed to load iframe');
    }

    const startMiningButton = await iframe.waitForSelector('div.mining-btn > button.app-button.large.primary.block', {
      visible: true,
    });

    const buttonText = await iframe.evaluate((btn) => btn.textContent, startMiningButton);
    if (!buttonText.includes('Start Mining')) {
      throw new Error('Start Mining button not found or text mismatch');
    }

    await startMiningButton.click();
    console.log('Start Mining button clicked');

    // 6. Wait for a random time between min and max values
    const waitTime = Math.floor(Math.random() * (waitTimeMax - waitTimeMin + 1) + waitTimeMin) * 60 * 1000;
    console.log(`Waiting for ${waitTime / 1000} seconds`);
    await delay(waitTime);
  } catch (error) {
    console.error('Error in emulateHumanActions:', error);
    throw error; // Propagate error for handling in main
  }
}

async function main() {
  while (true) {
    let browser;
    try {
      const cdpUrl = await startEnv(ENV_ID);

      browser = await puppeteer.connect({ browserURL: cdpUrl });
      const [page] = await browser.pages();

      // Simulate human actions
      await emulateHumanActions(page);

      // Close the browser and profile after a successful cycle
      console.log('Closing browser after successful execution');
      await browser.close();

      // Calculate break time with random additional time
      const randomAdditionalTime = Math.random() * (additionalTimeMax - additionalTimeMin) * 60 * 1000 + additionalTimeMin * 60 * 1000;
      const totalBreakTime = baseBreakTime + randomAdditionalTime;
      console.log(`Break time: ${totalBreakTime / 1000 / 60} minutes`);

      // Wait during the break
      await delay(totalBreakTime);
    } catch (error) {
      console.error('Error in main:', error);

      // Close the browser and profile on error
      if (browser) {
        console.log('Closing browser due to error');
        await browser.close();
      }

      // Delay before restarting
      console.log('Restarting main in 1 minute');
      await delay(60 * 1000); // Delay for 1 minute before restarting
    }
  }
}

main();
