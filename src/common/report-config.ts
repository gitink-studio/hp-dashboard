// Report Configuration Types and Constants
import { SDKType } from './sdk-report-config';

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  category: 'developer' | 'publisher';
  platforms: string[];
  subPlatforms: string[];
  enabled: boolean;
  requiredFields: string[];
  optionalFields: string[];
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'table';
  kpiFields: string[];
  exportFormats: ('csv' | 'pdf' | 'excel')[];
  refreshInterval: number; // in minutes
  dataRetention: number; // in days
  sdkType?: SDKType; // Optional: Specific SDK type for this report
}

export interface PlatformSubPlatformRule {
  platform: string;
  subPlatform: string;
  availableReports: string[];
  disabledReports: string[];
}

export interface ReportConfiguration {
  rules: PlatformSubPlatformRule[];
  globalSettings: {
    defaultRefreshInterval: number;
    defaultDataRetention: number;
    enableRealTimeData: boolean;
    enableScheduledReports: boolean;
  };
}

// Default report configurations matching group2.md specifications
export const DEFAULT_REPORT_CONFIGS: ReportConfig[] = [
  // Developer Reports (as per group2.md)
  {
    id: 'cpi-trends',
    name: 'CPI Trends',
    description: 'Cost Per Install trends over time',
    category: 'developer',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'cpi', 'installs', 'spend'],
    optionalFields: ['platform', 'subPlatform', 'game'],
    chartType: 'line',
    kpiFields: ['installs', 'spend', 'cpi'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'roas-trends',
    name: 'ROAS Trends',
    description: 'Return on Ad Spend trends (D1/D7/D30)',
    category: 'developer',
    platforms: ['iOS', 'Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'roasD1', 'roasD7', 'roasD30', 'revenue', 'spend'],
    optionalFields: ['platform', 'game'],
    chartType: 'line',
    kpiFields: ['d1', 'd7', 'd30'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'retention',
    name: 'Retention',
    description: 'User retention rates (D1/D7/D30)',
    category: 'developer',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'retentionD1', 'retentionD7', 'retentionD30', 'installs'],
    optionalFields: ['platform', 'subPlatform', 'game'],
    chartType: 'line',
    kpiFields: ['d1', 'd7', 'd30'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'revenue-summary',
    name: 'Revenue Summary',
    description: 'Revenue breakdown by IAP and Ads',
    category: 'developer',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'grossRevenue', 'iapRevenue', 'adRevenue'],
    optionalFields: ['platform', 'subPlatform', 'game'],
    chartType: 'bar',
    kpiFields: ['gross', 'iap', 'ads'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365
  },
  {
    id: 'crash-rate',
    name: 'Crash Rate',
    description: 'Application crash rate monitoring',
    category: 'developer',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'crashRate', 'sessions', 'crashes'],
    optionalFields: ['platform', 'subPlatform', 'game'],
    chartType: 'line',
    kpiFields: ['sessions', 'crashes', 'crashRate'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 30,
    dataRetention: 90
  },
  // Publisher Reports (as per group2.md)
  {
    id: 'revenue-by-geo',
    name: 'Revenue by Geo',
    description: 'Revenue breakdown by geographical region',
    category: 'publisher',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'country', 'grossRev', 'netRev', 'payoutDue', 'revShare'],
    optionalFields: ['platform', 'subPlatform', 'game', 'studio'],
    chartType: 'table',
    kpiFields: ['gross', 'net', 'payoutDue'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 120,
    dataRetention: 365
  },
  {
    id: 'payout-summary',
    name: 'Payout Summary',
    description: 'Summary of publisher payouts by studio',
    category: 'publisher',
    platforms: ['iOS', 'Android', 'Web'],
    subPlatforms: ['All', 'Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'studio', 'grossRev', 'netRev', 'paid', 'outstanding'],
    optionalFields: ['platform', 'subPlatform', 'game'],
    chartType: 'table',
    kpiFields: ['totalNet', 'paid', 'outstanding'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 240,
    dataRetention: 730
  },
  {
    id: 'ecpm-fill-rate',
    name: 'eCPM & Fill Rate',
    description: 'eCPM and fill rate performance metrics',
    category: 'publisher',
    platforms: ['Web'],
    subPlatforms: ['Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'eCPM', 'fillRate', 'requests', 'filled', 'impressions', 'revenue'],
    optionalFields: ['platform', 'subPlatform', 'game', 'studio'],
    chartType: 'line',
    kpiFields: ['eCPM', 'fillRate', 'impressions'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 60,
    dataRetention: 180
  },
  {
    id: 'compliance-ivt',
    name: 'Compliance & IVT',
    description: 'Compliance and Invalid Traffic monitoring',
    category: 'publisher',
    platforms: ['Web'],
    subPlatforms: ['Poki', 'CrazyGames'],
    enabled: true,
    requiredFields: ['date', 'compliance', 'ivt', 'validTraffic'],
    optionalFields: ['platform', 'subPlatform', 'game', 'studio'],
    chartType: 'table',
    kpiFields: ['compliance', 'ivt'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 120,
    dataRetention: 365
  },
  
  // ==================== HYPER RABBIT SDK REPORTS ====================
  {
    id: 'hr-engagement-android',
    name: 'Hyper Rabbit - Engagement (Android)',
    description: 'User engagement metrics using Hyper Rabbit SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'dau', 'mau', 'sessionLength', 'levelAttempts', 'winRate', 'newUsers'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['dau', 'mau', 'sessionLength', 'levelAttempts', 'winRate', 'newUsers'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-engagement-ios',
    name: 'Hyper Rabbit - Engagement (iOS)',
    description: 'User engagement metrics using Hyper Rabbit SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'dau', 'mau', 'sessionLength', 'levelAttempts', 'winRate', 'newUsers'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['dau', 'mau', 'sessionLength', 'levelAttempts', 'winRate', 'newUsers'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-monetization-android',
    name: 'Hyper Rabbit - Monetization (Android)',
    description: 'Monetization tracking using Hyper Rabbit SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'revenue', 'grossRevenue', 'cpi', 'roasDx', 'iapRevenue', 'adRevenue'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['revenue', 'grossRevenue', 'cpi', 'roasDx'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-monetization-ios',
    name: 'Hyper Rabbit - Monetization (iOS)',
    description: 'Monetization tracking using Hyper Rabbit SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'revenue', 'grossRevenue', 'cpi', 'roasDx', 'iapRevenue', 'adRevenue'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['revenue', 'grossRevenue', 'cpi', 'roasDx'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-retention-android',
    name: 'Hyper Rabbit - Retention (Android)',
    description: 'Retention metrics using Hyper Rabbit SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'retentionD1', 'retentionD7', 'retentionD30', 'dau', 'newUsers'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['retentionD1', 'retentionD7', 'retentionD30'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 120,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-retention-ios',
    name: 'Hyper Rabbit - Retention (iOS)',
    description: 'Retention metrics using Hyper Rabbit SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'retentionD1', 'retentionD7', 'retentionD30', 'dau', 'newUsers'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['retentionD1', 'retentionD7', 'retentionD30'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 120,
    dataRetention: 365,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-performance-android',
    name: 'Hyper Rabbit - Performance (Android)',
    description: 'Performance & technical metrics using Hyper Rabbit SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'crashRate', 'appBootTime', 'usersAffectedByErrors', 'fps', 'memoryUsage'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['crashRate', 'appBootTime', 'usersAffectedByErrors'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 30,
    dataRetention: 90,
    sdkType: 'hyper_rabbit'
  },
  {
    id: 'hr-performance-ios',
    name: 'Hyper Rabbit - Performance (iOS)',
    description: 'Performance & technical metrics using Hyper Rabbit SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'crashRate', 'appBootTime', 'usersAffectedByErrors', 'fps', 'memoryUsage'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['crashRate', 'appBootTime', 'usersAffectedByErrors'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 30,
    dataRetention: 90,
    sdkType: 'hyper_rabbit'
  },

  // ==================== GAME ANALYTICS SDK REPORTS ====================
  {
    id: 'ga-engagement-android',
    name: 'Game Analytics - Engagement (Android)',
    description: 'User engagement metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'dau', 'mau', 'wau', 'avgSessionLength', 'playtimePerSession', 'playtimePerUser', 'newUsers', 'numSessions'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['dau', 'mau', 'wau', 'avgSessionLength', 'playtimePerSession'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-engagement-ios',
    name: 'Game Analytics - Engagement (iOS)',
    description: 'User engagement metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'dau', 'mau', 'wau', 'avgSessionLength', 'playtimePerSession', 'playtimePerUser', 'newUsers', 'numSessions'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['dau', 'mau', 'wau', 'avgSessionLength', 'playtimePerSession'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-monetization-android',
    name: 'Game Analytics - Monetization (Android)',
    description: 'Monetization metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'revenue', 'arpdau', 'arppu', 'conversionRate', 'convertingUsers', 'payingUsers', 'transactions', 'revenuePerTransaction'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['revenue', 'arpdau', 'arppu', 'conversionRate', 'payingUsers'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-monetization-ios',
    name: 'Game Analytics - Monetization (iOS)',
    description: 'Monetization metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'revenue', 'arpdau', 'arppu', 'conversionRate', 'convertingUsers', 'payingUsers', 'transactions', 'revenuePerTransaction'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['revenue', 'arpdau', 'arppu', 'conversionRate', 'payingUsers'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-progression-android',
    name: 'Game Analytics - Progression (Android)',
    description: 'Level progression metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'starts', 'completes', 'fails', 'attempts', 'winPercentage', 'completeScore', 'failScore'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['starts', 'completes', 'fails', 'winPercentage'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-progression-ios',
    name: 'Game Analytics - Progression (iOS)',
    description: 'Level progression metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'starts', 'completes', 'fails', 'attempts', 'winPercentage', 'completeScore', 'failScore'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['starts', 'completes', 'fails', 'winPercentage'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-retention-android',
    name: 'Game Analytics - Retention (Android)',
    description: 'Retention metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'retention', 'returningUsers', 'dauNewVsReturning'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['retention', 'returningUsers', 'dauNewVsReturning'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 120,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-retention-ios',
    name: 'Game Analytics - Retention (iOS)',
    description: 'Retention metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'retention', 'returningUsers', 'dauNewVsReturning'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['retention', 'returningUsers', 'dauNewVsReturning'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 120,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-economy-android',
    name: 'Game Analytics - Virtual Economy (Android)',
    description: 'Virtual economy metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'flow', 'sink', 'source'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['flow', 'sink', 'source'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-economy-ios',
    name: 'Game Analytics - Virtual Economy (iOS)',
    description: 'Virtual economy metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'flow', 'sink', 'source'],
    optionalFields: ['game'],
    chartType: 'bar',
    kpiFields: ['flow', 'sink', 'source'],
    exportFormats: ['csv', 'pdf', 'excel'],
    refreshInterval: 60,
    dataRetention: 365,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-performance-android',
    name: 'Game Analytics - Performance (Android)',
    description: 'Performance & technical metrics using Game Analytics SDK for Android',
    category: 'developer',
    platforms: ['Android'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'errorCount', 'usersAffectedByErrors'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['errorCount', 'usersAffectedByErrors'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 30,
    dataRetention: 90,
    sdkType: 'game_analytics'
  },
  {
    id: 'ga-performance-ios',
    name: 'Game Analytics - Performance (iOS)',
    description: 'Performance & technical metrics using Game Analytics SDK for iOS',
    category: 'developer',
    platforms: ['iOS'],
    subPlatforms: ['All'],
    enabled: true,
    requiredFields: ['date', 'errorCount', 'usersAffectedByErrors'],
    optionalFields: ['game'],
    chartType: 'line',
    kpiFields: ['errorCount', 'usersAffectedByErrors'],
    exportFormats: ['csv', 'pdf'],
    refreshInterval: 30,
    dataRetention: 90,
    sdkType: 'game_analytics'
  }
];

// Platform and Sub-Platform combinations (as per group2.md)
export const PLATFORM_SUBPLATFORM_COMBINATIONS = [
  { platform: 'iOS', subPlatform: 'All' },
  { platform: 'Android', subPlatform: 'All' },
  { platform: 'Web', subPlatform: 'All' },
  { platform: 'Web', subPlatform: 'Poki' },
  { platform: 'Web', subPlatform: 'CrazyGames' },
  { platform: 'Web', subPlatform: 'Facebook' },
  { platform: 'Web', subPlatform: 'Microsoft' }
];

// Default configuration rules matching group2.md specifications
export const DEFAULT_CONFIGURATION: ReportConfiguration = {
  rules: [
    {
      platform: 'iOS',
      subPlatform: 'All',
      availableReports: [
        'cpi-trends', 'roas-trends', 'retention', 'revenue-summary', 'crash-rate',
        // Hyper Rabbit SDK Reports
        'hr-engagement-ios', 'hr-monetization-ios', 'hr-retention-ios', 'hr-performance-ios',
        // Game Analytics SDK Reports
        'ga-engagement-ios', 'ga-monetization-ios', 'ga-progression-ios', 'ga-retention-ios', 
        'ga-economy-ios', 'ga-performance-ios'
      ],
      disabledReports: ['revenue-by-geo', 'payout-summary', 'ecpm-fill-rate', 'compliance-ivt']
    },
    {
      platform: 'Android',
      subPlatform: 'All',
      availableReports: [
        'cpi-trends', 'roas-trends', 'retention', 'revenue-summary', 'crash-rate',
        // Hyper Rabbit SDK Reports
        'hr-engagement-android', 'hr-monetization-android', 'hr-retention-android', 'hr-performance-android',
        // Game Analytics SDK Reports
        'ga-engagement-android', 'ga-monetization-android', 'ga-progression-android', 'ga-retention-android',
        'ga-economy-android', 'ga-performance-android'
      ],
      disabledReports: ['revenue-by-geo', 'payout-summary', 'ecpm-fill-rate', 'compliance-ivt']
    },
    {
      platform: 'Web',
      subPlatform: 'All',
      availableReports: ['cpi-trends', 'retention', 'revenue-summary', 'revenue-by-geo', 'payout-summary'],
      disabledReports: ['roas-trends', 'crash-rate', 'ecpm-fill-rate', 'compliance-ivt']
    },
    {
      platform: 'Web',
      subPlatform: 'Poki',
      availableReports: ['cpi-trends', 'retention', 'revenue-summary', 'revenue-by-geo', 'payout-summary', 'ecpm-fill-rate', 'compliance-ivt'],
      disabledReports: ['roas-trends', 'crash-rate']
    },
    {
      platform: 'Web',
      subPlatform: 'CrazyGames',
      availableReports: ['cpi-trends', 'retention', 'revenue-summary', 'revenue-by-geo', 'payout-summary', 'ecpm-fill-rate', 'compliance-ivt'],
      disabledReports: ['roas-trends', 'crash-rate']
    },
    {
      platform: 'Web',
      subPlatform: 'Facebook',
      availableReports: ['cpi-trends', 'retention', 'revenue-summary', 'revenue-by-geo', 'payout-summary'],
      disabledReports: ['roas-trends', 'crash-rate', 'ecpm-fill-rate', 'compliance-ivt']
    },
    {
      platform: 'Web',
      subPlatform: 'Microsoft',
      availableReports: ['cpi-trends', 'retention', 'revenue-summary', 'revenue-by-geo', 'payout-summary'],
      disabledReports: ['roas-trends', 'crash-rate', 'ecpm-fill-rate', 'compliance-ivt']
    }
  ],
  globalSettings: {
    defaultRefreshInterval: 60,
    defaultDataRetention: 365,
    enableRealTimeData: true,
    enableScheduledReports: true
  }
};

// Utility functions
export const getAvailableReports = (
  platform: string,
  subPlatform: string,
  userRole: 'developer' | 'publisher',
  configuration: ReportConfiguration = DEFAULT_CONFIGURATION
): ReportConfig[] => {
  const rule = configuration.rules.find(
    r => r.platform === platform && r.subPlatform === subPlatform
  );
  
  if (!rule) {
    return [];
  }
  
  return DEFAULT_REPORT_CONFIGS.filter(config => 
    config.category === userRole && 
    rule.availableReports.includes(config.id) &&
    !rule.disabledReports.includes(config.id)
  );
};

export const isReportAvailable = (
  reportId: string,
  platform: string,
  subPlatform: string,
  userRole: 'developer' | 'publisher',
  configuration: ReportConfiguration = DEFAULT_CONFIGURATION
): boolean => {
  const availableReports = getAvailableReports(platform, subPlatform, userRole, configuration);
  return availableReports.some(report => report.id === reportId);
};
