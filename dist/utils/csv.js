import fs from 'fs';
import path from 'path';
export function exportToCSV(filename, headers, rows) {
    const csvRows = [
        headers.join(','), // header row
        ...rows.map(row => row.join(',')) // data rows
    ];
    const csvString = csvRows.join('\n');
    const filePath = path.resolve('./', filename);
    fs.writeFileSync(filePath, csvString);
    console.log(`Saved data to ${filePath}`);
}
