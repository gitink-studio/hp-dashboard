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

export const PlayerReport = () => {
    const canOpenPlayersReport = useOpenPlayersReport();
    const [playerDetails, setPlayerDetails] = useState([]);
    const selectedGameId = useSelectedGameId();
    const [canOpenDetailedView, setOpenDetailedView] = useState(false);

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
                <IconButton onClick={() => setOpenDetailedView(true)}>
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
        <>
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
                    <GameplayDetailedReport data={{
                        type: "Player Gameplay Data",
                        reportData: playerDetails,
                        callback: () => setOpenDetailedView(false),
                    }} />
                )
            }
        </>
    )
}
