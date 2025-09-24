import React from 'react';
import { useGetList } from 'react-admin';
import { QueryNames } from '../../common/constants';
import { formatNumber } from '../../common/utils';
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
  Paper
} from '@mui/material';
import { Assessment } from '@mui/icons-material';

interface GamesListProps {
  filters: any;
  onReportsNavigation: (gameName: string) => void;
}

export const GamesList: React.FC<GamesListProps> = ({ filters, onReportsNavigation }) => {
  // Get current user ID from localStorage
  const userId = localStorage.getItem("userId");
  
  const { data: gamesData, isLoading, error } = useGetList(QueryNames.GAMES_LIST, {
    filter: {
      ...filters,
      userId: userId // Pass user ID to the query
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography>Loading games...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography color="error">Error loading games: {error.message}</Typography>
      </Box>
    );
  }

  if (!gamesData || gamesData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography>No games found for the selected filters.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Games List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game</TableCell>
              <TableCell>DAU</TableCell>
              {/* Installs - Only for Major Stores */}
              {filters.platform !== 'Web' && filters.platform !== 'All' && (
                <TableCell>Installs</TableCell>
              )}
              {/* CPI - Only for Major Stores */}
              {filters.platform !== 'Web' && filters.platform !== 'All' && (
                <TableCell>CPI</TableCell>
              )}
              <TableCell>Revenue</TableCell>
              <TableCell>Reports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gamesData.map((game: any) => (
              <TableRow key={game.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{game.icon}</Typography>
                    <Typography variant="body1">{game.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatNumber(game.dau || 0)}</TableCell>
                {/* Installs - Only for Major Stores */}
                {filters.platform !== 'Web' && filters.platform !== 'All' && (
                  <TableCell>{formatNumber(game.installs || 0)}</TableCell>
                )}
                {/* CPI - Only for Major Stores */}
                {filters.platform !== 'Web' && filters.platform !== 'All' && (
                  <TableCell>${formatNumber(game.cpi || 0)}</TableCell>
                )}
                <TableCell>${formatNumber(game.revenue || 0)}</TableCell>
                <TableCell>
                  <Tooltip title="View detailed reports for this game">
                    <IconButton 
                      size="small"
                      onClick={() => onReportsNavigation(game.name)}
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
