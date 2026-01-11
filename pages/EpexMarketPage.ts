import { Page, Locator } from '@playwright/test';
const COLUMNS_TO_SCRAPE = ['Low','High','Last','Weight Avg'];

export type MarketData = Record<string, string[]>;

export class EpexMarketPage {
  readonly page: Page;
  private baseURL = 'https://www.epexspot.com/en/market-results';
  constructor(page: Page) {
  this.page = page;
  }

  /**
   * Navigate to market results page with specific delivery date
   * @param deliveryDate - Date in YYYY-MM-DD format
   */
  async navigateToMarketResults(deliveryDate: string): Promise<void> {
    const targetUrl = `${this.baseURL}?market_area=GB&auction=&trading_date=&delivery_date=${deliveryDate}&underlying_year=&modality=Continuous&sub_modality=&technology=&data_mode=table&period=&production_period=&product=30`;
    await this.page.goto(targetUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the market data table locator
   * Uses the first table on the page since we've already filtered by date in the URL
   */
  private getTable(): Locator {
    return this.page.locator('table').first();
  }

  /**
   * Find indices of all configured columns in the table
   */
  private async getColumnIndices(): Promise<Record<string, number>> {
    const table = this.getTable();
    const headerRow = table.locator('thead tr').nth(1);
    const headers = await headerRow.locator('th').allInnerTexts();

    const indices: Record<string, number> = {};

    // Find the index for each configured column
    COLUMNS_TO_SCRAPE.forEach(columnName => {
      const normalizedColumnName = columnName.toLowerCase().replace(/\s+/g, ' ').trim();

      const foundIndex = headers.findIndex((header: string) => {
        // Normalize header: replace newlines and multiple spaces with single space
        const normalizedHeader = header.toLowerCase().replace(/[\n\r\s]+/g, ' ').trim();
        // Check if the header starts with the column name
        return normalizedHeader.startsWith(normalizedColumnName);
      });

      indices[columnName] = foundIndex;
    });

    return indices;
  }

  /**
   * Extract column values from the table body
   * @param columnIndex - Index of the column to extract
   */
  private async getColumnValues(columnIndex: number): Promise<string[]> {
    const table = this.getTable();
    const tbody = table.locator('tbody');
    const rows = tbody.locator('tr');
    const rowCount = await rows.count();

    const values: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const cellValue = await cells.nth(columnIndex).innerText();

      // Filter out blank values and dashes
      if (cellValue.trim() !== '-' && cellValue.trim() !== '') {
        values.push(cellValue);
      }
    }

    return values;
  }

  /**
   * Scrape all configured market data columns
   * @param deliveryDate - Date in YYYY-MM-DD format (kept for backward compatibility)
   */
  async scrapeMarketData(deliveryDate: string): Promise<MarketData> {
    const indices = await this.getColumnIndices();

    // Scrape all configured columns in parallel
    const columnDataPromises = COLUMNS_TO_SCRAPE.map(columnName =>
      this.getColumnValues(indices[columnName])
    );

    const columnDataArrays = await Promise.all(columnDataPromises);

    // Build result object dynamically
    const result: MarketData = {};
    COLUMNS_TO_SCRAPE.forEach((columnName, index) => {
      result[columnName] = columnDataArrays[index];
    });

    return result;
  }
}
