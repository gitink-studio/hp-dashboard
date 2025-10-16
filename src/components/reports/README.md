# Reports System

A comprehensive reporting system for the Hyper Rabbit dashboard with role-based access control and advanced filtering capabilities.

## Overview

The Reports System provides detailed analytics and reporting capabilities for both Developer and Publisher users, with different report types and access levels based on user roles.

## Features

### Role-Based Access Control
- **Developer Role**: Access to game-specific reports for their studio's games only
- **Publisher Role**: Access to reports across all studios with additional financial and compliance reports

### Report Types

#### Developer Reports
1. **CPI Trends** - Cost Per Install analysis over time
2. **ROAS Trends** - Return on Ad Spend for D1, D7, and D30 cohorts
3. **Retention** - User retention rates for D1, D7, and D30
4. **Revenue Summary** - Revenue breakdown by IAP and Ads
5. **Crash Rate** - Application crash rate analysis

#### Publisher Reports
1. **Revenue by Geo** - Revenue breakdown by geographical region
2. **Payout Summary** - Studio-level payout tracking and outstanding amounts
3. **eCPM & Fill Rate** - Ad monetization performance metrics
4. **Compliance & IVT** - Policy compliance and fraud detection metrics

### Filtering System
- **Platform Filter**: App Store, Play Store, Web
- **Sub-platform Filter**: Facebook, Microsoft, Poki, CrazyGames (for Web platform)
- **Studio Filter**: All Studios, Studio A, Studio B, Studio C (Publisher only)
- **Game Filter**: All Games, specific game selection
- **Region Filter**: All Regions, US, IN, BR, EU, APAC (Publisher only)
- **Date Range**: Today, Yesterday, Last 7/14/30/90 days, Custom
- **Currency**: USD, EUR, INR, GBP (Publisher only)

### Data Visualization
- Interactive charts using Recharts library
- Line charts for trend analysis
- Bar charts for revenue data
- Area charts for payout summaries
- Responsive design for all screen sizes

### Export Functionality
- CSV export for all report types
- Automatic filename generation with timestamps
- Data sanitization for CSV format
- Support for large datasets

## File Structure

```
src/components/reports/
├── reports-hub.tsx          # Main reports hub with filtering and navigation
├── developer-reports.tsx    # Developer-specific report components
├── publisher-reports.tsx    # Publisher-specific report components
├── reports-filter.tsx       # Advanced filtering component
└── README.md               # This documentation

src/pages/reports/
└── reports-page.tsx        # Main reports page with routing

src/common/
└── export-utils.ts         # CSV export utilities
```

## Usage

### Navigation
Reports can be accessed from:
1. Main navigation menu (Reports)
2. Dashboard game cards (click on game name)
3. Direct URL with parameters

### URL Parameters
```
/reports?game=GameName&platform=Web&subPlatform=Facebook&region=US&dateRange=Last30d&currency=USD
```

### Opening Reports
1. Navigate to Reports Hub
2. Apply desired filters
3. Click "Open" button on any report
4. View detailed analytics with charts and tables
5. Export data or save report configuration

## Components

### ReportsHub
Main component that displays the reports list with filtering capabilities.

**Props:**
- `gameName?: string` - Pre-selected game
- `filters?: any` - Initial filter values
- `onBack?: () => void` - Back navigation handler
- `onOpenReport?: (reportType: string, gameName: string, studioName?: string) => void` - Report opening handler

### DeveloperReports
Component for developer-specific reports with detailed analytics.

**Props:**
- `reportType: 'CPI' | 'ROAS' | 'Retention' | 'Revenue' | 'Crash Rate'`
- `gameName: string`
- `filters: any`
- `onBack: () => void`

### PublisherReports
Component for publisher-specific reports with financial and compliance data.

**Props:**
- `reportType: 'Revenue by Geo' | 'Payout Summary' | 'eCPM & Fill Rate' | 'Compliance & IVT'`
- `gameName: string`
- `studioName: string`
- `filters: any`
- `onBack: () => void`

### ReportsFilter
Advanced filtering component with role-based restrictions.

**Props:**
- `userRole: 'developer' | 'publisher'`
- `filters: any`
- `onFilterChange: (filters: any) => void`
- `onClearFilters: () => void`
- `onRefresh: () => void`

## Data Flow

1. **Initial Load**: Reports page loads with URL parameters or default filters
2. **Filter Changes**: User modifies filters, data refreshes automatically
3. **Report Selection**: User clicks on a report, navigates to detailed view
4. **Data Visualization**: Charts and tables render with mock/real data
5. **Export**: User can export data to CSV format
6. **Navigation**: User can return to hub or navigate between reports

## Mock Data

The system currently uses mock data for demonstration purposes. In production, this would be replaced with:
- GraphQL queries to backend services
- Real-time data from analytics platforms
- Cached data for performance optimization

## Dependencies

- **@mui/material**: UI components and theming
- **@mui/icons-material**: Icons
- **recharts**: Chart visualization library
- **react-admin**: Admin framework integration

## Future Enhancements

1. **Real-time Data**: Integration with live data sources
2. **Advanced Filtering**: More granular filter options
3. **Report Scheduling**: Automated report generation and delivery
4. **Custom Dashboards**: User-configurable dashboard layouts
5. **Data Drill-down**: Click-through analysis capabilities
6. **Mobile Optimization**: Enhanced mobile experience
7. **Report Sharing**: Share reports with team members
8. **Alert System**: Automated alerts for threshold breaches

## Security Considerations

- Role-based access control enforced at component level
- Data filtering based on user permissions
- Secure export functionality with data sanitization
- URL parameter validation and sanitization

## Performance Optimization

- Lazy loading of report components
- Data caching for frequently accessed reports
- Virtual scrolling for large datasets
- Optimized chart rendering with Recharts
- Debounced filter changes to reduce API calls















