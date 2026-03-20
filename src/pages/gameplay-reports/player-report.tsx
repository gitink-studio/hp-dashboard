import { CustomDialog } from "../../components/dialog.component";
import { useOpenPlayersReport, useSelectedEndDate, useSelectedGameId, useSelectedStartDate } from "../../store/gameplay-event-report/gameplay-event-report-store";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CustomDatagrid } from "../../components/data-grid.component";
import { GridColDef } from "@mui/x-data-grid";
import { ArrowBack, Visibility } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { formatTime, goToPage, sendGraphqlRequest } from "../../common/utils";
import { Queries } from "../../graphql/queries";
import { QueryNames } from "../../common/constants";
import { PlayerDetailedReportViewer } from "../../components/gameplay-report/player-detailed-report-viewer";
import { CustomSearch } from "../../components/search";
import { useDataGridPage, useDataGridPageSize } from "../../store/common/data-grid-store";
import { useLocation } from "react-router";

export const PlayerReport = () => {
    const location = useLocation();
    const isFetched = useRef(false);
    const canOpenPlayersReport = useOpenPlayersReport();
    const pageSize = useDataGridPageSize();
    const page = useDataGridPage();
    const selectedGameId = useSelectedGameId();
    const selectedStartDate = useSelectedStartDate();
    const selectedEndDate = useSelectedEndDate();
    const [playerDetails, setPlayerDetails] = useState([]);
    const [detailedReportData, setDetailedReportData] = useState<any>();
    const [canOpenDetailedView, setOpenDetailedView] = useState(false);
    const [filterData, setFilterData] = useState();
    const [lastRecordId, setLastRecordId] = useState("");
    const [isFetching, setFetching] = useState(true);

    const handleViewDetails = (params: any) => {
        // console.log(`Player detailed report: ${JSON.stringify(params.row)}`);
        setDetailedReportData(params.row)
        setOpenDetailedView(true);
    }

    const getReportGeneratedInfo = (_startDate: string, _endDate: string) => {
        let reportGeneratedInfo = `Report generated`;
        let startDate = _startDate.split('T')[0];
        let endDate = _endDate.split('T')[0];
        let startDateWithoutTime = new Date(_startDate).toLocaleDateString();
        if (startDate === endDate) {
            return reportGeneratedInfo + ` on ${startDateWithoutTime}`
        }

        return reportGeneratedInfo + ` from ${startDateWithoutTime} to ${new Date(_endDate).toLocaleDateString()}`
    }

    const columns: GridColDef[] = [
        {
            field: 'playerId',
            headerName: 'Id',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'avgGameplayTime',
            headerName: 'Average Gameplay Time',
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
        if (isFetched.current) return;
        isFetched.current = true;

        if (playerDetails.length > (page + 1) * pageSize) return;

        console.log(`Selected start date: ${selectedStartDate} end date: ${selectedEndDate} selectedGameId: ${selectedGameId} `);
        setFetching(true);
        // Fetching data from backend
        sendGraphqlRequest(QueryNames.GET_PLAYER_EVENT_REPORT_BY_DATE_RANGE, {
            query: Queries.GetPlayerEventReportByDateRange,
            variables: {
                gameId: selectedGameId,
                limit: pageSize + 1,
                lastRecordId: lastRecordId,
                dateRange: {
                    data: {
                        startDate: selectedStartDate,
                        endDate: selectedEndDate,
                    },
                }
            }
        }).then((responseData: any) => {
            // console.log(`Player details: ${JSON.stringify(responseData)}`);
            let playerDetailsList: any = [...playerDetails, ...responseData.data]
            setPlayerDetails(playerDetailsList);
            setFilterData(playerDetailsList);
            setLastRecordId(responseData.data[responseData.data.length - 1].id);
            setFetching(false);

        });
    }, [page, pageSize, location.pathname]);

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
                    <Stack p={2}>
                        <Typography variant="h6" > Player Details  </Typography>
                        <Typography variant="caption" > {getReportGeneratedInfo(selectedStartDate, selectedEndDate)}</Typography>
                    </Stack>
                </Stack>

                <CustomSearch data={{ label: 'Search by id', callback: handleSearch, param: playerDetails }} />
            </Stack>

            <CustomDatagrid
                data={{
                    rows: filterData,
                    columns: columns,
                    rowSelection: false,
                    isLoading: isFetching
                }}
            />

            {
                canOpenDetailedView && (
                    <CustomDialog data={{
                        title: `${detailedReportData?.name} detailed gameplay event data`,
                        caption: `Player Id: ${detailedReportData?.playerId}`,
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
