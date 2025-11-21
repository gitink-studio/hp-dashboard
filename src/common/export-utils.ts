/**
 * Utility functions for exporting data to CSV format
 */

export interface ExportData {
  [key: string]: any;
}

export const exportToCSV = (data: ExportData[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportReportData = (
  reportType: string,
  data: ExportData[],
  filters: any,
  gameName?: string,
  studioName?: string
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}_${gameName || 'AllGames'}_${studioName || 'AllStudios'}_${timestamp}`;
  
  exportToCSV(data, filename);
};

export const generateReportFilename = (
  reportType: string,
  gameName?: string,
  studioName?: string,
  dateRange?: string
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const game = gameName ? gameName.replace(/\s+/g, '_') : 'AllGames';
  const studio = studioName ? studioName.replace(/\s+/g, '_') : 'AllStudios';
  const range = dateRange ? dateRange.replace(/\s+/g, '_') : 'Last30d';
  
  return `${reportType}_${game}_${studio}_${range}_${timestamp}`;
};





























