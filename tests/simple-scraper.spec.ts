import { test } from '@playwright/test';
import { getYesterdayDate } from '../utils/date-helper';
import { EpexMarketPage } from '../pages/EpexMarketPage';
import { exportMarketDataToCsv } from '../utils/csv-exporter';

test('Scrape EPEX data', async ({ page }) => {
  const deliveryDate = getYesterdayDate();

  // Initialize Page Object
  const epexPage = new EpexMarketPage(page);

  // Step 1: Navigate to market results page
  await epexPage.navigateToMarketResults(deliveryDate);

  // Step 2: Scrape all market data (Low, High, Last, Weight Avg)
  const marketData = await epexPage.scrapeMarketData(deliveryDate);

  // Step 3: Export to CSV
  const csvFilePath = exportMarketDataToCsv(marketData, deliveryDate);
});
