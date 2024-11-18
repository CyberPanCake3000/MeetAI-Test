import dotenv from 'dotenv';

dotenv.config();
export const CONFIG = {
  url: process.env.TARGET_WEBSITE_URL,
  viewport: {
    width: 1920,
    height: 1080
  },
  outputDirs: {
    mainDir: process.env.MAIN_RESULT_DIR,
    text: process.env.TARGET_TEXT_DIR,
    images: process.env.TARGET_PICTURE_DIR
  },
  puppeteer: {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
};