import * as fs from 'fs';
import * as path from 'path';
import { MarketData } from '../pages/EpexMarketPage';

/**
 * Export market data to CSV file
 * @param data - Market data object with dynamic columns
 * @param deliveryDate - Date in YYYY-MM-DD format
 * @param outputDir - Directory to save the CSV file (default: output)
 * @returns Path to the created CSV file
 */
export function exportMarketDataToCsv(
  data: MarketData,
  deliveryDate: string,
  outputDir: string = path.join(__dirname, '..', 'output')
): string {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Build the file path
  const csvFilePath = path.join(outputDir, `epex-market-data-${deliveryDate}.csv`);

  // Get column names from the data
  const columnKeys = Object.keys(data);

  // Write header row
  fs.writeFileSync(csvFilePath, columnKeys.join(',') + '\n', 'utf-8');

  // Get number of rows
  const rowCount = data[columnKeys[0]].length;

  // Write each data row directly to file
  for (let i = 0; i < rowCount; i++) {
    const rowValues = columnKeys.map(key => data[key][i]);
    fs.appendFileSync(csvFilePath, rowValues.join(',') + '\n', 'utf-8');
  }

  return csvFilePath;
}
