import db from '../data/DB.js';
import fs from 'fs';

function exportTableToCSV(tableName: string, filename: string) {
  const rows = db.prepare(`SELECT * FROM ${tableName}`).all() as Record<string, any>[];

  if (!rows.length) {
    console.log(`No data found in ${tableName}`);
    return;
  }

  const headers = Object.keys(rows[0]).join(',');
  const csvRows = rows.map(row =>
    Object.values(row).map(val => `"${val}"`).join(',')
  );

  const csv = [headers, ...csvRows].join('\n');

  fs.writeFileSync(filename, csv);
  console.log(`Exported ${rows.length} rows to ${filename}`);
}

// Export all tables you want:
exportTableToCSV('daily_weather', './csv-exports/daily_weather.csv');
exportTableToCSV('hourly_weather', './csv-exports/hourly_weather.csv');
exportTableToCSV('daily_marine', './csv-exports/daily_marine.csv');
exportTableToCSV('hourly_marine', './csv-exports/hourly_marine.csv');
