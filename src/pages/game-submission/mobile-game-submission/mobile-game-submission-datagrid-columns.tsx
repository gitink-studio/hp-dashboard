import { GridColDef } from "@mui/x-data-grid";
import { AuthenticationProvider } from "../../../auth-providers/auth-provider";
import { MobileGameSubmissionGameplayButton } from "./mobile-game-submission-gameplay-button";
import { MobileGameSubmissionStatusButton } from "./mobile-game-submission-status-button";
import { MobileGameSubmissionActionButtons } from "./mobile-game-submission-action-buttons";
import { Box, Stack, Tooltip, Typography } from "@mui/material";

export const mobileGameSubmissionDatagridColumns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Game',
        flex: 1,
        renderCell: (params: any) => {
            return <Stack direction={'row'} gap={2} alignItems={"center"} height={'100%'}>
                <Box
                    component={"img"}
                    src={params.row.androidOrIOSGameRequest.gameIconUrl}
                    width={25}
                    borderRadius={1}
                />
                <Tooltip title={params.value}>
                    <Typography
                        variant="body2"
                        sx={{
                            width: 150,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {params.value}
                    </Typography>
                </Tooltip>
            </Stack>
        }
    },
    ...(
        AuthenticationProvider.isRolePublisher() ?
            [{
                field: 'studio',
                headerName: 'Studio',
                flex: 1,
            }] : []
    ),
    {
        field: 'gameplayVideoUrl',
        headerName: 'Gameplay Video',
        flex: 1,
        renderCell: (params: any) => <MobileGameSubmissionGameplayButton data={{ value: params.value }} />
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => <MobileGameSubmissionStatusButton data={{
            status: params.value,
            gameSubmissionDetails: params.row
        }} />
    },
    {
        field: 'createdAt',
        headerName: 'Creation Date',
        flex: 1,
        renderCell: (params: any) => new Intl.DateTimeFormat("en-IN").format(new Date(params.value))
    },
    {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        renderCell: (params: any) => <MobileGameSubmissionActionButtons data={{
            gameSubmissionDetails: params.row
        }} />
    },
];
