import {
    InfiniteList,
    useListController,
} from "react-admin";
import { QueryNames } from "../../common/constants";
import { Stack, Typography, Box } from "@mui/material";
import { PlatformFilter } from "../../components/dashboard/platform-filter";
import { SubPlatformFilter } from "../../components/dashboard/sub-platform-filter";
import { GamesFilter } from "../../components/dashboard/games-filter";
import { AdvancedDateFilter } from "../../components/dashboard/advanced-date-filter";
import { StudioFilter } from "../../components/dashboard/studio-filter";
import { RegionFilter } from "../../components/dashboard/region-filter";
import { CurrencyFilter } from "../../components/dashboard/currency-filter";
import { SavedViewFilter } from "../../components/dashboard/saved-view-filter";
import { PublishKPIs } from "../../components/dashboard/publisher-kpis";
import { ApprovalQueue } from "../../components/dashboard/approvals-queue";
import { StudiosGamesList } from "../../components/dashboard/studios-games-list";
import { AdvancedExport } from "../../components/dashboard/advanced-export";
import { SavedViewsManager } from "../../components/dashboard/saved-views-manager";
import { RealTimeUpdates } from "../../components/dashboard/real-time-updates";
import { NotificationSystem } from "../../components/dashboard/notification-system";
import { KPICCharts } from "../../components/dashboard/kpi-charts";
import { PerformanceOptimizer } from "../../components/dashboard/performance-optimizer";

export const AdminDashboard = () => {
    // Check user role for access control
    const userRole = localStorage.getItem("userRole");
    
    // Redirect non-admin users
    if (userRole && userRole !== 'admin') {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Access Denied: This dashboard is only available for admin users.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Your role: {userRole}
                </Typography>
            </Box>
        );
    }

    const listController = useListController({ resource: QueryNames.STUDIOS_GAMES, });

    const filters = [
        <StudioFilter />,
        <PlatformFilter />,
        <SubPlatformFilter />,
        <RegionFilter />,
        <GamesFilter />,
        <AdvancedDateFilter />,
        <CurrencyFilter />,
        <SavedViewFilter />,
    ];

    return (
        <>
            <InfiniteList 
                resource={QueryNames.STUDIOS_GAMES}
                filters={filters}
                filterDefaultValues={{ 
                    studio: "All",
                    platform: "All", 
                    subPlatform: "All", 
                    game: "All",
                    region: "All",
                    currency: "USD",
                    dateRange: "Last 30d"
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6">
                        Publisher KPIs
                    </Typography>
                    <Box display="flex" gap={1}>
                        <RealTimeUpdates onDataUpdate={(data) => console.log('Data updated:', data)} />
                        <SavedViewsManager 
                            currentFilters={listController.filterValues}
                            onLoadView={(filters) => console.log('Load view:', filters)}
                            onSaveView={(name, filters) => console.log('Save view:', name, filters)}
                        />
                        <AdvancedExport filter={listController.filterValues} type="publisher" />
                        <NotificationSystem onNotificationClick={(notification) => console.log('Notification clicked:', notification)} />
                    </Box>
                </Box>
                <Stack direction="row">
                    <PublishKPIs filter={listController.filterValues} />
                </Stack>
                
                <KPICCharts filter={listController.filterValues} />
                
                <PerformanceOptimizer onOptimize={(settings) => console.log('Performance optimized:', settings)} />
                
                <ApprovalQueue filter={listController.filterValues} />
                <StudiosGamesList filter={listController.filterValues} />
            </InfiniteList>
        </>
    );
};
