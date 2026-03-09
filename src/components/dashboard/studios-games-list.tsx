import React from 'react';
import { useGetList } from 'react-admin';
import { QueryNames } from '../../common/constants';
import { formatDecimalNumber } from '../../common/utils';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Assessment, Business } from '@mui/icons-material';

interface StudiosGamesListProps {
  filter: any;
}

export const StudiosGamesList: React.FC<StudiosGamesListProps> = ({ filter }) => {
  const { data: studiosGamesData, isLoading, error } = useGetList(QueryNames.STUDIOS_GAMES, {
    filter: filter
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Studios & Games
        </Typography>
        <Typography>Loading studios and games...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Studios & Games
        </Typography>
        <Typography color="error">Error loading data: {error.message}</Typography>
      </Box>
    );
  }

  if (!studiosGamesData || studiosGamesData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Studios & Games
        </Typography>
        <Typography>No studios and games found for the selected filters.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Business sx={{ mr: 1 }} />
        Studios & Games
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Studio</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>DAU</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Installs</TableCell>
              <TableCell>CPI</TableCell>
              <TableCell>Reports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studiosGamesData.map((item: any) => (
              <TableRow key={`${item.studioId}-${item.gameId}`} hover>
                <TableCell>
                  <Chip
                    label={item.studio?.name || 'Unknown Studio'}
                    size="small"
                    variant="outlined"
                    icon={<Business />}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{item.game?.icon || '🎮'}</Typography>
                    <Typography variant="body1">{item.game?.name || 'Unknown Game'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatDecimalNumber(item.dau || 0)}</TableCell>
                <TableCell>${formatDecimalNumber(item.revenue || 0)}</TableCell>
                <TableCell>{formatDecimalNumber(item.installs || 0)}</TableCell>
                <TableCell>${formatDecimalNumber(item.cpi || 0)}</TableCell>
                <TableCell>
                  <Tooltip title="View detailed reports">
                    <IconButton
                      size="small"
                      onClick={() => console.log('Navigate to reports for:', item.game?.name)}
                    >
                      <Assessment color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};





