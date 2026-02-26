import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  Download, 
  TableChart, 
  Assessment, 
  PictureAsPdf,
  Email,
  CloudDownload,
  CheckCircle,
  Error
} from '@mui/icons-material';

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  includeCharts: boolean;
  dateRange: string;
  email?: string;
}

interface AdvancedExportProps {
  filter?: any;
  type?: 'portfolio' | 'publisher' | 'games' | 'all';
}

export const AdvancedExport: React.FC<AdvancedExportProps> = ({ filter, type = 'portfolio' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: false,
    dateRange: 'Last 30d'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportMessage, setExportMessage] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportDialogOpen = (exportType: string) => {
    setExportOptions(prev => ({ ...prev, format: exportType as any }));
    setExportDialogOpen(true);
    handleClose();
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
    setExportStatus('idle');
    setExportMessage('');
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real implementation, this would call the backend export API
      const exportData = {
        type,
        filter,
        options: exportOptions,
        timestamp: new Date().toISOString()
      };

      console.log('Exporting data:', exportData);

      // Simulate different outcomes
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        setExportStatus('success');
        setExportMessage(`Export completed successfully! ${exportOptions.format.toUpperCase()} file is ready for download.`);
        
        // In real implementation, trigger actual download
        if (exportOptions.format === 'csv') {
          downloadCSV(generateMockCSVData());
        }
      } else {
        setExportStatus('error');
        setExportMessage('Export failed. Please try again or contact support if the issue persists.');
      }
    } catch (error) {
      setExportStatus('error');
      setExportMessage('An unexpected error occurred during export.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateMockCSVData = () => {
    const headers = ['Date', 'Games', 'Installs', 'Revenue', 'CPI', 'DAU'];
    const rows = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return [
        date,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 1000) + 100,
        Math.floor(Math.random() * 10000) + 1000,
        (Math.random() * 5 + 0.5).toFixed(2),
        Math.floor(Math.random() * 5000) + 1000
      ];
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getExportIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'xlsx':
        return <TableChart />;
      case 'pdf':
        return <PictureAsPdf />;
      case 'json':
        return <Assessment />;
      default:
        return <Download />;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'csv': return 'CSV Spreadsheet';
      case 'xlsx': return 'Excel Spreadsheet';
      case 'pdf': return 'PDF Report';
      case 'json': return 'JSON Data';
      default: return format.toUpperCase();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        Export
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleExportDialogOpen('csv')}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportDialogOpen('xlsx')}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportDialogOpen('pdf')}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportDialogOpen('json')}>
          <ListItemIcon>
            <Assessment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={exportDialogOpen} onClose={handleExportDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {getExportIcon(exportOptions.format)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              Export Dashboard Data
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportOptions.format}
                label="Export Format"
                onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
              >
                <MenuItem value="csv">CSV Spreadsheet</MenuItem>
                <MenuItem value="xlsx">Excel Spreadsheet</MenuItem>
                <MenuItem value="pdf">PDF Report</MenuItem>
                <MenuItem value="json">JSON Data</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={exportOptions.dateRange}
                label="Date Range"
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <MenuItem value="Last 7d">Last 7 days</MenuItem>
                <MenuItem value="Last 30d">Last 30 days</MenuItem>
                <MenuItem value="Last 90d">Last 90 days</MenuItem>
                <MenuItem value="Custom">Custom range</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Filters:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {filter && Object.entries(filter).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {exportOptions.format === 'pdf' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  PDF Options:
                </Typography>
                <Box display="flex" alignItems="center">
                  <input
                    type="checkbox"
                    id="includeCharts"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  />
                  <label htmlFor="includeCharts" style={{ marginLeft: 8 }}>
                    Include charts and visualizations
                  </label>
                </Box>
              </Box>
            )}

            {isExporting && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Exporting data...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {exportStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <CheckCircle sx={{ mr: 1 }} />
                {exportMessage}
              </Alert>
            )}

            {exportStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Error sx={{ mr: 1 }} />
                {exportMessage}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleExportDialogClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            disabled={isExporting}
            startIcon={isExporting ? <CloudDownload /> : <Download />}
          >
            {isExporting ? 'Exporting...' : `Export as ${getFormatLabel(exportOptions.format)}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
