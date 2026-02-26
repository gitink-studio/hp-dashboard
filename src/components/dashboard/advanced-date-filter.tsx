import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { CalendarToday, DateRange } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { QueryNames } from '../../common/constants';

interface AdvancedDateFilterProps {
  source?: string;
  label?: string;
  alwaysOn?: boolean;
  hideQuickButtons?: boolean;
  size?: 'small' | 'medium';
}

export const AdvancedDateFilter: React.FC<AdvancedDateFilterProps> = ({
  source: _source = "dateRange",
  label = "Date Range",
  alwaysOn: _alwaysOn = false,
  hideQuickButtons = false,
  size = 'small'
}) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30d");

  const { data, isLoading, error } = useGetList(QueryNames.DASHBOARD_FILTERS, {});

  if (isLoading) return <Box>Loading...</Box>;
  if (error) console.log(error);

  const dateRanges = data?.[0]?.dateRanges || [
    'Today',
    'Yesterday',
    'Last 7d',
    'Last 14d',
    'Last 30d',
    'Last 90d',
    'Custom'
  ];

  const choices = dateRanges.map((range: string) => ({
    id: range,
    name: range
  }));

  const handleCustomDateSave = () => {
    if (customStartDate && customEndDate) {
      // In a real implementation, this would update the filter values
      console.log('Custom date range:', { startDate: customStartDate, endDate: customEndDate });
      setCustomDialogOpen(false);
    }
  };

  // (Chip rendering for selected ranges is currently unused in this context)

  const handleDateRangeChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    setSelectedDateRange(value);

    if (value === 'Custom') {
      setCustomDialogOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 200 }} size={size}>
        <InputLabel>{label}</InputLabel>
        <Select
          size={size}
          value={selectedDateRange}
          onChange={handleDateRangeChange}
          label={label}
        >
          {choices.map((choice: { id: string; name: string }) => {
            if (choice.id === 'Custom') {
              return (
                <MenuItem
                  key={choice.id}
                  value={choice.id}
                  onClick={() => {
                    // Ensure dialog opens even if already on 'Custom'
                    setSelectedDateRange('Custom');
                    setCustomDialogOpen(true);
                  }}
                >
                  {choice.name}
                </MenuItem>
              );
            }
            return (
              <MenuItem key={choice.id} value={choice.id}>
                {choice.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* Custom Date Range Dialog */}
      <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <DateRange sx={{ mr: 1 }} />
            Custom Date Range
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                value={customStartDate ? customStartDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setCustomStartDate(e.target.value ? new Date(e.target.value) : null)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                value={customEndDate ? customEndDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setCustomEndDate(e.target.value ? new Date(e.target.value) : null)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {customStartDate && customEndDate && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Range:
              </Typography>
              <Chip
                icon={<CalendarToday />}
                label={`${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCustomDateSave}
            variant="contained"
            disabled={!customStartDate || !customEndDate}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Date Range Buttons */}
      {!hideQuickButtons && (
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['Last 7d', 'Last 30d', 'Last 90d'].map((range) => (
            <Button
              key={range}
              size="small"
              variant="outlined"
              onClick={() => {
                // In real implementation, this would update the filter
                console.log('Quick select:', range);
              }}
              sx={{ minWidth: 'auto' }}
            >
              {range}
            </Button>
          ))}
          <Button
            size="small"
            variant="outlined"
            startIcon={<DateRange />}
            onClick={() => setCustomDialogOpen(true)}
          >
            Custom
          </Button>
        </Box>
      )}
    </Box>
  );
};
