import React, { useState } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { useAuthenticated } from 'react-admin';
import { ReportsHub } from '../../components/reports/reports-hub';
import { DeveloperReports } from '../../components/reports/developer-reports';
import { PublisherReports } from '../../components/reports/publisher-reports';
import { GameAnalyticsImportPage } from './game-analytics-import-page';

interface ReportsPageProps {
  gameName?: string;
  initialFilters?: any;
}

type ReportType = string; // Allow any string to support configuration-based report types

export const ReportsPage: React.FC<ReportsPageProps> = ({
  gameName,
  initialFilters
}) => {
  useAuthenticated();
  const rawUserRole = localStorage.getItem("userRole");
  console.log('🔍 Raw user role from localStorage:', rawUserRole);
  console.log('🔍 All localStorage values:', {
    userRole: localStorage.getItem("userRole"),
    userName: localStorage.getItem("userName"),
    userRoleId: localStorage.getItem("userRoleId"),
    userId: localStorage.getItem("userId"),
    userStudio: localStorage.getItem("userStudio")
  });
  
  // Normalize user role - handle different role names
  let userRole: 'developer' | 'publisher' | null = null;
  if (rawUserRole) {
    const roleLower = rawUserRole.toLowerCase();
    if (roleLower.includes('developer') || roleLower.includes('dev')) {
      userRole = 'developer';
    } else if (roleLower.includes('publisher') || roleLower.includes('pub')) {
      userRole = 'publisher';
    }
  }
  
  // Temporary fallback for testing - remove this in production
  if (!userRole) {
    console.log('🔍 No valid role found, setting default to developer for testing');
    userRole = 'developer';
  }
  
  console.log('🔍 Normalized user role:', userRole);
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlGame = urlParams.get('game');
  const urlPlatform = urlParams.get('platform');
  const urlSubPlatform = urlParams.get('subPlatform');
  const urlRegion = urlParams.get('region');
  const urlDateRange = urlParams.get('dateRange');
  const urlCurrency = urlParams.get('currency');
  
  // Navigation state
  const [currentView, setCurrentView] = useState<'hub' | 'report' | 'game-analytics-import'>('hub');
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>(urlGame || gameName || '');
  const [selectedStudio, setSelectedStudio] = useState<string>('');

  // Filter state
  const [filters] = useState({
    platform: urlPlatform || initialFilters?.platform || 'All',
    subPlatform: urlSubPlatform || initialFilters?.subPlatform || 'All',
    game: urlGame || gameName || 'All',
    studio: userRole === 'publisher' ? 'All' : 'Current Studio',
    region: urlRegion || 'All',
    dateRange: urlDateRange || initialFilters?.dateRange || 'Last 30d',
    currency: urlCurrency || 'USD'
  });

  if (!localStorage.getItem("userName")) return null;

  // Check user role and redirect if necessary
  if (!userRole) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Alert severity="error">
          Access Denied: Reports are only available for developer and publisher users.
        </Alert>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Your role: {rawUserRole || 'Not set'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please log in with a valid developer or publisher account.
        </Typography>
      </Box>
    );
  }

  const handleOpenReport = (reportType: string, gameName: string, studioName?: string) => {
    console.log('🔍 Opening report:', { reportType, gameName, studioName, userRole });
    setSelectedReport(reportType as ReportType);
    setSelectedGame(gameName);
    setSelectedStudio(studioName || '');
    setCurrentView('report');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedReport(null);
    setSelectedGame('');
    setSelectedStudio('');
  };

  const handleOpenGameAnalyticsImport = () => {
    setCurrentView('game-analytics-import');
  };


  // Render the appropriate view
  if (currentView === 'hub') {
    return (
      <ReportsHub
        gameName={selectedGame}
        filters={filters}
        onBack={undefined} // No back button on main hub
        onOpenReport={handleOpenReport}
        onOpenGameAnalyticsImport={handleOpenGameAnalyticsImport}
      />
    );
  }

  if (currentView === 'game-analytics-import') {
    return (
      <GameAnalyticsImportPage
        onBack={handleBackToHub}
      />
    );
  }

  if (currentView === 'report' && selectedReport) {
    console.log('🔍 Report matching:', { 
      currentView, 
      selectedReport, 
      userRole, 
      selectedGame, 
      selectedStudio 
    });
    
    // Developer reports - check if it's a developer report type
    const developerReportTypes = [
      'CPI Trends', 'ROAS Trends', 'Retention', 'Revenue Summary', 'Crash Rate'
    ];
    
    if (userRole === 'developer' && developerReportTypes.includes(selectedReport)) {
      console.log('🔍 Matched developer report:', selectedReport);
      return (
        <DeveloperReports
          reportType={selectedReport as any}
          gameName={selectedGame}
          filters={filters}
          onBack={handleBackToHub}
        />
      );
    }

    // Publisher reports - check if it's a publisher report type
    const publisherReportTypes = [
      'Revenue by Geo', 'Payout Summary', 'eCPM & Fill Rate', 'Compliance & IVT'
    ];
    
    if (userRole === 'publisher' && publisherReportTypes.includes(selectedReport)) {
      console.log('🔍 Matched publisher report:', selectedReport);
      return (
        <PublisherReports
          reportType={selectedReport as any}
          gameName={selectedGame}
          studioName={selectedStudio}
          filters={filters}
          onBack={handleBackToHub}
        />
      );
    }
    
    console.log('🔍 No report matched - falling back to error');
  }

  // Fallback - should not reach here
  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Alert severity="warning">
        Invalid report configuration. Please try again.
      </Alert>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Report: {selectedReport}, Game: {selectedGame}, Studio: {selectedStudio}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        User Role: {userRole}
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleBackToHub}
        sx={{ mt: 2 }}
      >
        Back to Reports Hub
      </Button>
    </Box>
  );
};
