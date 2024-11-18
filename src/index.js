import { CONFIG } from './config.js';
import { Logger } from './utils/logger.js';
import { FileManager } from './utils/file-manager.js';
import { Scraper } from './services/scraper.js';

async function main() {
  const fileManager = new FileManager(
    CONFIG.outputDirs.mainDir,
    CONFIG.outputDirs.text,
    CONFIG.outputDirs.images);
  const scraper = new Scraper(CONFIG);

  try {
    await fileManager.initializeDirs();
    await scraper.initialize();

    Logger.info(`Открываем страницу ${CONFIG.url}`);
    await scraper.page.goto(CONFIG.url, { waitUntil: 'networkidle0' });

    Logger.info('Собираем текст');
    const textContent = await scraper.scrapeText();
    await fileManager.saveText(textContent);

    Logger.info('Собираем изображения');
    const images = await scraper.scrapeImages();

    Logger.info(`Начинаем скачивание ${images.length} изображений`);
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        const buffer = await scraper.downloadImage(img.src);
        const filename = `image_${i}_${img.alt.replace(/[^a-z0-9]/gi, '_')}.png`;
        await fileManager.saveImage(buffer, filename);
        Logger.info(`Сохранено изображение ${i + 1}/${images.length}`);
      } catch (error) {
        Logger.error(`Ошибка при скачивании изображения ${img.src}`, error);
      }
    }

    const stats = fileManager.getStats();
    Logger.success(`Скраппинг завершен успешно! Сохранено ${stats.textFiles} текстовых файлов и ${stats.imageFiles} изображений`);

  } catch (error) {
    Logger.error('Произошла ошибка при выполнении скраппинга', error);
  } finally {
    await scraper.close();
  }
}

main();