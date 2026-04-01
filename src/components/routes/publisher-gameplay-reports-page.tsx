import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryNames } from "../../common/constants";
import { isPublisherRole, useUserRole } from "../../common/role-utils";
import { GameplayReportPage } from "../../pages/gameplay-reports/gameplay-report-page";

/** Registers route always; redirects non-publishers (menu hides link via CustomAppBar). */
export const PublisherGameplayReportsPage = () => {
  const userRole = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName && !isPublisherRole(userRole)) {
      navigate(`/${QueryNames.GET_DEVELOPER_DASHBOARD_DATA}`, { replace: true });
    }
  }, [userRole, navigate]);

  const userName = localStorage.getItem("userName");
  if (!userName) return null;
  if (!isPublisherRole(userRole)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  return <GameplayReportPage />;
};
