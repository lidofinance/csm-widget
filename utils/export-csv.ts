/**
 * Escapes a CSV field value by wrapping it in quotes if needed
 */
const escapeCsvField = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * Converts an array of objects to CSV format and triggers download
 * @param data Array of data objects to export
 * @param headers Object mapping data keys to CSV column headers
 * @param filename Name of the file to download (without extension)
 */
export const exportToCsv = <T extends Record<string, unknown>>(
  data: T[],
  headers: Record<keyof T, string>,
  filename: string,
): void => {
  if (data.length === 0) {
    console.warn('Export CSV: No data to export');
    return;
  }

  const keys = Object.keys(headers) as (keyof T)[];
  const headerRow = keys.map((key) => escapeCsvField(headers[key])).join(',');

  const rows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        const stringValue =
          value === null || value === undefined ? '' : String(value);
        return escapeCsvField(stringValue);
      })
      .join(','),
  );

  const csv = [headerRow, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
