import { Box, Button, Dialog, Paper, Stack, Typography, useTheme } from "@mui/material"


export const CustomDialog = (props: any) => {
    const theme = useTheme();
    const { title, component = null, size: maxWidth = "xl", callback } = props.data;

    const handleClose = () => {
        callback();
    }

    return (
        <>
            <Dialog open={true} fullWidth maxWidth={maxWidth} key={title}>
                <Paper elevation={0}>
                    <Stack gap={2} display={"flex"}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            position: 'sticky',
                            top: 0,
                            height: "75px",
                            width: "100%",
                            backgroundColor: `${theme.palette.background.paper}`,
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                pl={4}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack overflow={"auto"}>
                        <Box p={4}> {component}</Box>
                    </Stack>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: "center",
                        pr: 4,
                        position: 'sticky',
                        bottom: 0,
                        height: "75px",
                        width: "100%",
                        backgroundColor: theme.palette.background.paper,
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderRadius: 20,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.disabled,
                                textTransform: "none",
                                fontSize: "14px",
                                height: "35px"
                            }}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Box>
                </Paper>
            </Dialog >
        </>
    )
}
