import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function scrapeWebsite() {
  try {
    const textDir = path.join(__dirname, 'text');
    const imagesDir = path.join(__dirname, 'images');

    await fs.ensureDir(textDir);
    await fs.ensureDir(imagesDir);

    const browser = await puppeteer.launch({
      headless: 'new'
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Открываем страницу...');
    await page.goto('https://mymeet.ai', {
      waitUntil: 'networkidle0'
    });

    console.log('Собираем текст...');
    const textContent = await page.evaluate(() => {
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

    await fs.writeFile(path.join(textDir, 'content.txt'), textContent);

    console.log('Собираем изображения...');
    const images = await page.evaluate(() => {
      return Array.from(document.images, img => ({
        src: img.src,
        alt: img.alt
      }));
    });

    console.log('Скачиваем изображения...');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        const response = await page.goto(img.src);
        const buffer = await response.buffer();
        const filename = `image_${i}_${img.alt.replace(/[^a-z0-9]/gi, '_')}.png`;
        await fs.writeFile(path.join(imagesDir, filename), buffer);
      } catch (error) {
        console.error(`Ошибка при скачивании изображения ${img.src}:`, error);
      }
    }

    await browser.close();
    console.log('Скраппинг завершен успешно!');

  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

scrapeWebsite();