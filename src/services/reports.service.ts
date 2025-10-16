/**
 * Reports Service
 * Handles API calls to the backend reports endpoints
 * Implements Group 2 Reports specification
 */

export interface ReportFilters {
  studio?: string;
  platform?: string;
  subPlatform?: string;
  game?: string;
  region?: string;
  dateRange?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
}

export interface CPITrendsData {
  kpiSummary: {
    installs: number;
    adSpend: number;
    cpi: number;
  };
  chartData: Array<{
    date: string;
    installs: number;
    spend: number;
    cpi: number;
  }>;
}

export interface ROASTrendsData {
  kpiSummary: {
    roasD1: number;
    roasD7: number;
    roasD30: number;
  };
  chartData: Array<{
    d0Date: string;
    spend: number;
    revAtD1: number;
    roas1: number;
    revAtD7: number;
    roas7: number;
    revAtD30: number;
    roas30: number;
  }>;
}

export interface RetentionData {
  kpiSummary: {
    d1: number;
    d7: number;
    d30: number;
  };
  chartData: Array<{
    day: string;
    retentionPercent: number;
  }>;
  cohortTable: Array<{
    cohortD0: string;
    installs: number;
    d1Users: number;
    d1Percent: number;
    d7Users: number;
    d7Percent: number;
    d30Users: number;
    d30Percent: number;
  }>;
}

export interface RevenueSummaryData {
  kpiSummary: {
    gross: number;
    iap: number;
    ads: number;
  };
  chartData: Array<{
    date: string;
    gross: number;
    iap: number;
    ads: number;
  }>;
}

export interface CrashRateData {
  kpiSummary: {
    sessions: number;
    crashes: number;
    crashRate: number;
  };
  chartData: Array<{
    date: string;
    sessions: number;
    crashes: number;
    crashRate: number;
  }>;
}

export interface RevenueByGeoData {
  kpiSummary: {
    gross: number;
    net: number;
    payoutDue: number;
  };
  countryBreakdown: Array<{
    country: string;
    installs: number;
    grossRev: number;
    revSharePercent: number;
    netRev: number;
    payoutDue: number;
  }>;
}

export interface PayoutSummaryData {
  kpiSummary: {
    totalNet: number;
    totalPaid: number;
    totalOutstanding: number;
  };
  studioBreakdown: Array<{
    studio: string;
    grossRev: number;
    netRev: number;
    paid: number;
    outstanding: number;
  }>;
}

export interface ECPMFillRateData {
  kpiSummary: {
    ecpm: number;
    fillRate: number;
    impressions: number;
  };
  dailyBreakdown: Array<{
    date: string;
    requests: number;
    filled: number;
    fillRatePercent: number;
    impressions: number;
    revenue: number;
    ecpm: number;
  }>;
}

export interface ComplianceIVTData {
  kpiSummary: {
    compliance: number;
    ivtFraudRate: number;
  };
  policyChecks: Array<{
    check: string;
    status: string;
    notes: string;
  }>;
}

export interface ReportsHubData {
  openReports: Array<{
    id: string;
    title: string;
    type: string;
    lastRun: string;
    status: 'Open' | 'Saved';
    game?: string;
    studio?: string;
  }>;
  savedReports: Array<{
    id: string;
    title: string;
    type: string;
    lastRun: string;
    status: 'Open' | 'Saved';
    game?: string;
    studio?: string;
  }>;
  filters: ReportFilters;
}

class ReportsService {
  private baseUrl = '/reports';

  private buildQueryParams(filters: ReportFilters): string {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  }

  private async fetchData<T>(endpoint: string, filters: ReportFilters): Promise<T> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${this.baseUrl}/${endpoint}?${queryParams}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} data: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Reports Hub
  async getReportsHub(filters: ReportFilters, userRole?: string): Promise<ReportsHubData> {
    const params = { ...filters, userRole };
    return this.fetchData<ReportsHubData>('hub', params);
  }

  // Developer Reports
  async getCPITrends(filters: ReportFilters): Promise<CPITrendsData> {
    return this.fetchData<CPITrendsData>('cpi-trends', filters);
  }

  async getROASTrends(filters: ReportFilters): Promise<ROASTrendsData> {
    return this.fetchData<ROASTrendsData>('roas-trends', filters);
  }

  async getRetentionReport(filters: ReportFilters): Promise<RetentionData> {
    return this.fetchData<RetentionData>('retention', filters);
  }

  async getRevenueSummary(filters: ReportFilters): Promise<RevenueSummaryData> {
    return this.fetchData<RevenueSummaryData>('revenue-summary', filters);
  }

  async getCrashRateReport(filters: ReportFilters): Promise<CrashRateData> {
    return this.fetchData<CrashRateData>('crash-rate', filters);
  }

  // Publisher Reports
  async getRevenueByGeo(filters: ReportFilters): Promise<RevenueByGeoData> {
    return this.fetchData<RevenueByGeoData>('revenue-by-geo', filters);
  }

  async getPayoutSummary(filters: ReportFilters): Promise<PayoutSummaryData> {
    return this.fetchData<PayoutSummaryData>('payout-summary', filters);
  }

  async getECPMFillRate(filters: ReportFilters): Promise<ECPMFillRateData> {
    return this.fetchData<ECPMFillRateData>('ecpm-fill-rate', filters);
  }

  async getComplianceIVT(filters: ReportFilters): Promise<ComplianceIVTData> {
    return this.fetchData<ComplianceIVTData>('compliance-ivt', filters);
  }

  // Export functionality
  async exportReportToCSV(reportType: string, filters: ReportFilters): Promise<void> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${this.baseUrl}/export/${reportType}?${queryParams}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to export ${reportType}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Save report configuration
  async saveReport(config: {
    reportType: string;
    filters: ReportFilters;
    name: string;
    userId: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save report: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Get saved reports
  async getSavedReports(userId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/saved?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get saved reports: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const reportsService = new ReportsService();
