const puppeteer = require('puppeteer');

class Scraper {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch(this.config.puppeteer);
    this.page = await this.browser.newPage();
    await this.page.setViewport(this.config.viewport);
  }

  async scrapeText() {
    return await this.page.evaluate(() => {
      const textNodes = document.evaluate(
        '//text()[normalize-space(.)!=""]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      let text = '';
      for (let i = 0; i < textNodes.snapshotLength; i++) {
        text += textNodes.snapshotItem(i).textContent.trim() + '\n';
      }
      return text;
    });
  }

  async scrapeImages() {
    return await this.page.evaluate(() => {
      return Array.from(document.images, img => ({
        src: img.src,
        alt: img.alt
      }));
    });
  }

  async downloadImage(imageUrl) {
    const response = await this.page.goto(imageUrl);
    return await response.buffer();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = { Scraper };