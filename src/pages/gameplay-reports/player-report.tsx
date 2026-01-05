import { CustomDialog } from "../../components/dialog.component";
import { useGameEventReportActions, useOpenPlayersReport, useSelectedGameId } from "../../store/gameplay-event-report/gameplay-event-report-store";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CustomDatagrid } from "../../components/data-grid.component";
import { GridColDef } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { formatTime, sendGraphqlRequest } from "../../common/utils";
import { Queries } from "../../graphql/queries";
import { QueryNames } from "../../common/constants";
import { GameplayDetailedReport } from "./gameplay-detailed-report";
import { PlayerDetailedReportViewer } from "../../components/gameplay-report/player-detailed-report-viewer";

export const PlayerReport = () => {
    const canOpenPlayersReport = useOpenPlayersReport();
    const [playerDetails, setPlayerDetails] = useState([]);
    const selectedGameId = useSelectedGameId();
    const [detailedReportData, setDetailedReportData] = useState<any>();
    const [canOpenDetailedView, setOpenDetailedView] = useState(false);

    const handleViewDetails = (params: any) => {
        // console.log(`Params: ${JSON.stringify(params.row)}`);
        setDetailedReportData(params.row)
        setOpenDetailedView(true);
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'avgSessionTime',
            headerName: 'Average Session Time',
            flex: 1,
            renderCell: (params: any) => formatTime(params.value)
        },
        {
            field: 'tutorialCompleted',
            headerName: 'Tutorial Complete',
            flex: 1,
        },
        {
            field: 'totalErrorOccurred',
            headerName: 'Error Occurred',
            flex: 1,
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) => (
                <IconButton onClick={() => handleViewDetails(params)}>
                    <Visibility />
                </IconButton>
            )
        },
    ]

    useEffect(() => {
        sendGraphqlRequest(QueryNames.GET_PLAYER_EVENT_REPORT, {
            query: Queries.GetPlayerEventReport,
            variables: {
                gameId: selectedGameId,
                limit: 20,
            }
        }).then((responseData: any) => {
            setPlayerDetails(responseData.data)
        });

    }, []);

    return (
        canOpenPlayersReport &&
        <Stack p={4}>
            <Typography variant="h6" p={2}> Player Details  </Typography>
            <CustomDatagrid
                data={{
                    rows: playerDetails,
                    columns: columns,
                    rowSelection: false
                }}
            />

            {
                canOpenDetailedView && (
                    <CustomDialog data={{
                        title: `${detailedReportData?.name} (${detailedReportData?.id}) detailed gameplay event data`,
                        component: <PlayerDetailedReportViewer data={{
                            type: "Player Gameplay Data",
                            reportData: detailedReportData,
                            callback: () => setOpenDetailedView(false),
                        }} />,
                        callback: () => setOpenDetailedView(false),
                    }} />

                )
            }
        </Stack>
    )
}
