import { CustomDialog } from "../../components/dialog.component";
import { useOpenPlayersReport, useSelectedGameId } from "../../store/gameplay-event-report/gameplay-event-report-store";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CustomDatagrid } from "../../components/data-grid.component";
import { GridColDef } from "@mui/x-data-grid";
import { ArrowBack, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { formatTime, goToPage, sendGraphqlRequest } from "../../common/utils";
import { Queries } from "../../graphql/queries";
import { QueryNames } from "../../common/constants";
import { PlayerDetailedReportViewer } from "../../components/gameplay-report/player-detailed-report-viewer";
import { CustomSearch } from "../../components/search";
import { useDataGridPage, useDataGridPageSize } from "../../store/common/data-grid-store";

export const PlayerReport = () => {
    const canOpenPlayersReport = useOpenPlayersReport();
    const pageSize = useDataGridPageSize();
    const page = useDataGridPage();
    const [playerDetails, setPlayerDetails] = useState([]);
    const selectedGameId = useSelectedGameId();
    const [detailedReportData, setDetailedReportData] = useState<any>();
    const [canOpenDetailedView, setOpenDetailedView] = useState(false);
    const [filterData, setFilterData] = useState();
    const [lastRecordId, setLastRecordId] = useState("");

    const handleViewDetails = (params: any) => {
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
        // Checking the page already contains the data or not
        if (playerDetails.length > (page + 1) * pageSize) return;

        // Fetching data from backend
        sendGraphqlRequest(QueryNames.GET_PLAYER_EVENT_REPORT, {
            query: Queries.GetPlayerEventReport,
            variables: {
                gameId: selectedGameId,
                limit: pageSize + 1,
                lastRecordId: lastRecordId
            }
        }).then((responseData: any) => {
            let playerDetailsList: any = [...playerDetails, ...responseData.data]
            setPlayerDetails(playerDetailsList);
            setFilterData(playerDetailsList);
            setLastRecordId(responseData.data[responseData.data.length - 1].id);
        });
    }, [page, pageSize]);

    const handleSearch = (value: string, playerDetails: any) => {
        if (value === "") {
            setFilterData(playerDetails);
            return;
        }

        const filterData = playerDetails.filter((data: any) => data.id === value);
        console.log(`filterData value : ${JSON.stringify(playerDetails)} ${value} `);
        setFilterData(filterData);
    }

    const handleBack = () => goToPage('/gameplay-reports');

    return (
        canOpenPlayersReport &&
        <Stack p={4}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconButton size="small" sx={{ width: 50, height: 50 }} onClick={handleBack}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" p={2}> Player Details  </Typography>
                </Stack>

                <CustomSearch data={{ label: 'Search by id', callback: handleSearch, param: playerDetails }} />
            </Stack>

            <CustomDatagrid
                data={{
                    rows: filterData,
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
