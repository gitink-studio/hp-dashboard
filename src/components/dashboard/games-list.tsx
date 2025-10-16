import React, { useState } from 'react';
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
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Collapse,
  Chip
} from '@mui/material';
import { 
  Assessment, 
  TrendingUp, 
  MonetizationOn, 
  AttachMoney, 
  HealthAndSafety,
  Visibility,
  GetApp,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

interface GamesListProps {
  filters: any;
  onReportsNavigation: (gameName: string) => void;
}

export const GamesList: React.FC<GamesListProps> = ({ filters, onReportsNavigation }) => {
  // Get current user ID from localStorage
  const userId = localStorage.getItem("userId");
  
  // State for managing expanded games (accordion)
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

  // Helper function to get game icon based on game name
  const getGameIcon = (gameName: string) => {
    const name = gameName.toLowerCase();
    if (name.includes('pickle') || name.includes('ball')) return '🎾';
    if (name.includes('candy') || name.includes('diy')) return '🍬';
    if (name.includes('puzzle') || name.includes('pop')) return '🧩';
    if (name.includes('fruit') || name.includes('jam')) return '🍓';
    if (name.includes('slash') || name.includes('jam')) return '⚔️';
    if (name.includes('sports') || name.includes('arena')) return '🏟️';
    if (name.includes('tower') || name.includes('merge')) return '🏗️';
    if (name.includes('pixel') || name.includes('art')) return '🎨';
    if (name.includes('craft') || name.includes('master')) return '🔨';
    if (name.includes('drift') || name.includes('city')) return '🏎️';
    if (name.includes('archer') || name.includes('rush')) return '🏹';
    if (name.includes('bake') || name.includes('break')) return '🍰';
    if (name.includes('dream') || name.includes('racing')) return '🏁';
    if (name.includes('digital') || name.includes('quest')) return '🎮';
    return '🎮'; // Default icon
  };

  // Developer reports data as per Group 2 specification
  const getDeveloperReports = () => [
    {
      id: 'cpi-trends',
      title: 'CPI Trends',
      type: 'CPI',
      lastRun: 'Apr 22',
      status: 'Open',
      icon: <TrendingUp />,
      color: '#1976d2',
      data: {
        kpi: { installs: '122,000', spend: '$51,240', cpi: '$0.42' },
        table: [
          { date: 'Apr 1', installs: '5,200', spend: '$2,340', cpi: '$0.45' },
          { date: 'Apr 2', installs: '6,100', spend: '$2,745', cpi: '$0.45' },
          { date: 'Apr 3', installs: '4,900', spend: '$2,058', cpi: '$0.42' }
        ]
      }
    },
    {
      id: 'roas-trends',
      title: 'ROAS Trends',
      type: 'ROAS',
      lastRun: 'Apr 18',
      status: 'Open',
      icon: <TrendingUp />,
      color: '#2e7d32',
      data: {
        kpi: { roasD1: '62%', roasD7: '128%', roasD30: '212%' },
        table: [
          { date: 'Apr 1', spend: '$2,340', revD1: '$1,450', roas1: '62%', revD7: '$3,000', roas7: '128%', revD30: '$4,950', roas30: '211%' },
          { date: 'Apr 2', spend: '$2,745', revD1: '$1,700', roas1: '62%', revD7: '$3,500', roas7: '128%', revD30: '$5,800', roas30: '211%' }
        ]
      }
    },
    {
      id: 'retention',
      title: 'Retention',
      type: 'Retention',
      lastRun: 'Apr 12',
      status: 'Open',
      icon: <Assessment />,
      color: '#ed6c02',
      data: {
        kpi: { d1: '38%', d7: '18%', d30: '7%' },
        table: [
          { cohort: 'Apr 1', installs: '5,000', d1Users: '1,900', d1: '38%', d7Users: '900', d7: '18%', d30Users: '350', d30: '7%' },
          { cohort: 'Apr 2', installs: '4,200', d1Users: '1,596', d1: '38%', d7Users: '756', d7: '18%', d30Users: '294', d30: '7%' }
        ]
      }
    },
    {
      id: 'revenue-summary',
      title: 'Revenue Summary',
      type: 'Revenue',
      lastRun: 'Apr 10',
      status: 'Open',
      icon: <AttachMoney />,
      color: '#9c27b0',
      data: {
        kpi: { gross: '$18,300', iap: '$13,200', ads: '$5,100' },
        table: [
          { date: 'Apr 1', gross: '1,200', iap: '900', ads: '300' },
          { date: 'Apr 2', gross: '1,450', iap: '1,050', ads: '400' },
          { date: 'Apr 3', gross: '980', iap: '700', ads: '280' }
        ]
      }
    },
    {
      id: 'crash-rate',
      title: 'Crash Rate',
      type: 'Crashes',
      lastRun: 'Apr 09',
      status: 'Open',
      icon: <HealthAndSafety />,
      color: '#d32f2f',
      data: {
        kpi: { sessions: '950,000', crashes: '8,200', crashRate: '0.86%' },
        table: [
          { date: 'Apr 1', sessions: '32,000', crashes: '290', crashRate: '0.91%' },
          { date: 'Apr 2', sessions: '28,000', crashes: '240', crashRate: '0.86%' },
          { date: 'Apr 3', sessions: '35,000', crashes: '300', crashRate: '0.85%' }
        ]
      }
    }
  ];

  // Handle accordion expansion
  const handleToggleExpanded = (gameId: string) => {
    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(gameId)) {
      newExpanded.delete(gameId);
    } else {
      newExpanded.add(gameId);
    }
    setExpandedGames(newExpanded);
  };
  
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
              <React.Fragment key={game.id}>
                {/* Main Game Row */}
                <TableRow 
                  hover 
                  onClick={() => handleToggleExpanded(game.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" sx={{ pl: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpanded(game.id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        {expandedGames.has(game.id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {getGameIcon(game.name)}
                      </Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {game.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          (📊) DAU: {formatNumber(game.dau || 0)}
                          {filters.platform !== 'Web' && (
                            <> • Installs: {formatNumber(game.installs || 0)}k • CPI: ${(game.cpi || 0).toFixed(2)}</>
                          )}
                        </Typography>
                      </Box>
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
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        {expandedGames.has(game.id) ? 'Hide Reports' : 'Show Reports'}
                      </Typography>
                      <Tooltip title="View Reports">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReportsNavigation(game.name);
                          }}
                          color="primary"
                        >
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Reports Accordion Row */}
                <TableRow>
                  <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} sx={{ p: 0 }}>
                    <Collapse in={expandedGames.has(game.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 3, backgroundColor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}>
                          📊 Developer Reports - {game.name}
                        </Typography>
                        
                        {/* Reports with Data Tables */}
                        {getDeveloperReports().map((report) => (
                          <Card key={report.id} sx={{ mb: 3, border: `2px solid ${report.color}30` }}>
                            <CardContent sx={{ p: 3 }}>
                              {/* Report Header */}
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                <Box display="flex" alignItems="center">
                                  <Box sx={{ color: report.color, mr: 2, fontSize: '1.5rem' }}>
                                    {report.icon}
                                  </Box>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: report.color }}>
                                      {report.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Type: {report.type} • Last Run: {report.lastRun}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip 
                                  label={report.status} 
                                  size="medium" 
                                  color="success" 
                                  variant="outlined"
                                />
                              </Box>

                              {/* KPI Summary */}
                              <Box sx={{ mb: 3, p: 2, backgroundColor: `${report.color}10`, borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  KPI Summary
                                </Typography>
                                <Box display="flex" gap={3} flexWrap="wrap">
                                  {Object.entries(report.data.kpi).map(([key, value]) => (
                                    <Box key={key} textAlign="center">
                                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: report.color }}>
                                        {value}
                                      </Typography>
                                      <Typography variant="caption" color="textSecondary">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>

                              {/* Data Table */}
                              <Box sx={{ overflowX: 'auto' }}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ backgroundColor: `${report.color}20` }}>
                                      {Object.keys(report.data.table[0]).map((header) => (
                                        <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                                          {header.charAt(0).toUpperCase() + header.slice(1)}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {report.data.table.map((row, index) => (
                                      <TableRow key={index} hover>
                                        {Object.values(row).map((cell, cellIndex) => (
                                          <TableCell key={cellIndex}>
                                            {cell}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>

                              {/* Action Buttons */}
                              <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
                                <Button
                                  variant="contained"
                                  startIcon={<Visibility />}
                                  sx={{ backgroundColor: report.color }}
                                  onClick={() => onReportsNavigation(game.name)}
                                >
                                  Open Full Report
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<GetApp />}
                                  sx={{ borderColor: report.color, color: report.color }}
                                >
                                  Export CSV
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
