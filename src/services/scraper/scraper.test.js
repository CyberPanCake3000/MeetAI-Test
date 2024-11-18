const puppeteer = require('puppeteer');
const { Scraper } = require('./scraper');

jest.mock('puppeteer', () => ({
  launch: jest.fn(() => ({
    newPage: jest.fn(() => ({
      setViewport: jest.fn(),
      goto: jest.fn(),
      evaluate: jest.fn(),
    })),
    close: jest.fn()
  }))
}));

describe('Scraper', () => {
  let scraper;
  const mockConfig = {
    url: 'https://test.com',
    viewport: { width: 1920, height: 1080 },
    puppeteer: { headless: 'new' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    scraper = new Scraper(mockConfig);
  });

  test('should create instance with config', () => {
    expect(scraper.config).toBe(mockConfig);
  });

  test('should initialize browser', async () => {
    await scraper.initialize();
    expect(puppeteer.launch).toHaveBeenCalledWith(mockConfig.puppeteer);
  });
});