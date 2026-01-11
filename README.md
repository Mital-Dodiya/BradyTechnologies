# BradyTechnologies
Technical Task files
# EPEX Scraper Simple

A simple EPEX SPOT market data scraper using Playwright and TypeScript with Page Object Model pattern.

## Features

- Scrapes EPEX SPOT market data (Low, High, Last, Weight Avg)
- Page Object Model architecture for maintainability
- Exports data to CSV format
- TypeScript for type safety
- Filters out blank/missing values

## Project Structure

```
epex-scraper-simple/
├── pages/
│   └── EpexMarketPage.ts        # Page Object Model
├── utils/
│   ├── csv-exporter.ts          # CSV export utility
│   └── date-helper.ts           # Date helper functions
├── tests/
│   └── simple-scraper.spec.ts   # Main test/scraper
├── output/                      # Generated CSV files
├── package.json
├── tsconfig.json
└── playwright.config.ts
```

## Installation

```bash
npm install
npx playwright install chromium
```

## Usage

Run the scraper:

```bash
npm run scrape
```

Run with headed browser (see what's happening):

```bash
npm run test:headed
```

## Output

CSV files are generated in the `output/` directory with the format:
`epex-market-data-YYYY-MM-DD.csv`

The CSV contains 4 columns:
- Low (£/MWh)
- High (£/MWh)
- Last (£/MWh)
- Weight Avg (£/MWh)
