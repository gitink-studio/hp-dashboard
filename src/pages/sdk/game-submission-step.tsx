import { Box, Button, CircularProgress, FormControl, InputAdornment, MenuItem, Paper, Select, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import GameAssetsForm from "./game-assets-form"
import { SDKData } from "./sdk-data"
import { SDKStyle } from "./sdk-style"
import { useEffect, useState } from "react";
import { useGameSubmissionActions, useGameTitle, useMinOSCompatibility, usePlayStoreDataFetch, useStoreStatus, useStoreUrlDisabled } from "../../store/sdk/game-submission-store";
import { useNotify } from "react-admin";
import { FetchData } from "../../data-providers/data-provider";
import { waitForSeconds } from "../../common/utils";
import { PlayStoreDataFetchState } from "../../common/constants";
import { CheckCircleRounded } from "@mui/icons-material";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    width: '100%',
    '& .MuiToggleButtonGroup-grouped': {
        '&.Mui-selected': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
        },
    },
    "&:hover": {
        backgroundColor: 'transparent',
    }
}));

export const GameSubmissionStep = () => {
    const storeStatus = useStoreStatus();
    const isStoreUrlDisabled = useStoreUrlDisabled();
    const gameTitle = useGameTitle();
    const minOSCompatibility = useMinOSCompatibility();
    const playStoreDataFetchState = usePlayStoreDataFetch();
    const {
        setStoreStatus,
        setStoreUrl,
        setGameTitle,
        setMinOSCompatibility,
        setGameIconUrl,
        setStoreUrlDisabled,
        setPlayStoreDataFetch
    } = useGameSubmissionActions();

    const notify = useNotify();

    const [gameDetails, setGameDetails] = useState({
        storeStatus: 'Live',
        storeUrl: '',
        gameTitle: '',
        platform: 'Android',
        minOSCompatibility: '',
        tags: {
            genre: [],
            control: [],
            mechanic: [],
            optionalTags: [],
        },
        gameType: '',
    });

    const isTagName = (name: string) => {
        return name === "genre" || name === "control" || name === "mechanic" || name === "optionalTags";
    }

    const handleGameDetailsChange = (event: any) => {
        const { name, value } = event.target;

        if (isTagName(name)) {
            setGameDetails((prev) => ({
                ...prev,
                tags: {
                    ...prev.tags,
                    [name]: typeof value === 'string' ? value.split(',') : value,
                }
            }));
        } else {
            setGameDetails((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleStoreStatusChange = (
        _event: React.MouseEvent<HTMLElement>,
        newStatus: string | null
    ) => {
        console.log("New platform: ", newStatus);

        if (newStatus !== null) {
            setGameDetails(prev => ({
                ...prev,
                storeStatus: newStatus
            }));

            setStoreStatus(newStatus);
        }
    };

    const handlePlatformChange = (
        _event: React.MouseEvent<HTMLElement>,
        newPlatform: string | null
    ) => {
        if (newPlatform !== null) {
            if (gameDetails.storeStatus === "Live") {
                setGameDetails(prev => ({
                    ...prev,
                    platform: 'Android'
                }));
            } else {
                setGameDetails(prev => ({
                    ...prev,
                    platform: newPlatform
                }));
            }
        }
    };

    const isValidPlayStoreURL = (value: string) => {
        const playStorePattern = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9.]+(?:&[a-zA-Z0-9._=]+)*$/;
        let isValid = playStorePattern.test(value);

        if (!isValid) {
            notify("Invalid Play Store URL!", { type: "error" });
        }

        return isValid;
    }

    const handleStoreURLChange = async (event: any) => {
        const value = event.target.value;
        setPlayStoreDataFetch(PlayStoreDataFetchState.INPROGRESS);
        console.log(value);
        await waitForSeconds(1);
        if (value !== null) {
            if (isValidPlayStoreURL(value)) {
                setStoreUrl(value);
                let response = await FetchData.getPlayStoreGameDetails(value);
                console.log(response.data.gameTitle)
                setGameTitle(response.data.gameTitle);
                setMinOSCompatibility(response.data.minOSCompatibility);
                setGameIconUrl(response.data.icon);
                setStoreUrlDisabled(true);
                setPlayStoreDataFetch(PlayStoreDataFetchState.COMPLETED);
            } else {
                setPlayStoreDataFetch('');
            }
        }
    }

    return (
        <Box>
            <Stack gap={5}>
                <Paper elevation={0} sx={SDKStyle.paperStyle}>
                    <Typography sx={{ fontWeight: 'bold', mb: 3, }}> Game Details</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Store Status</Typography>
                            <StyledToggleButtonGroup
                                value={gameDetails.storeStatus}
                                exclusive
                                onChange={handleStoreStatusChange}
                                fullWidth
                            >
                                <ToggleButton value="Live" sx={SDKStyle.leftRounded}>Live</ToggleButton>
                                <ToggleButton value="Not Live" sx={SDKStyle.rightRounded}>Not Live</ToggleButton>
                            </StyledToggleButtonGroup>
                        </Stack>
                        {gameDetails.storeStatus === "Live" ?
                            <Stack direction="row" sx={SDKStyle.stackStyle}>
                                <Typography width={250}>Store URL</Typography>
                                <TextField
                                    fullWidth
                                    name="storeUrl"
                                    variant="outlined"
                                    placeholder="Insert Store URL"
                                    onChange={handleStoreURLChange}
                                    // value={storeUrl}
                                    // disabled={isStoreUrlDisabled}
                                    sx={SDKStyle.textFieldStyle}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: false, // prevents label from shrinking automatically
                                        },
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {playStoreDataFetchState === PlayStoreDataFetchState.INPROGRESS && <CircularProgress size={20} />}
                                                    {playStoreDataFetchState === PlayStoreDataFetchState.COMPLETED && <CheckCircleRounded fontSize="medium" color="success" />}
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />
                            </Stack> : null}

                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Game Title</Typography>
                            <TextField
                                fullWidth
                                name="gameTitle"
                                variant="outlined"
                                placeholder="Enter game title here"
                                value={gameTitle}
                                onChange={handleGameDetailsChange}
                                required
                                sx={SDKStyle.textFieldStyle}
                                disabled={gameDetails.storeStatus === 'Live'}
                            />
                        </Stack>

                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Platform</Typography>
                            <StyledToggleButtonGroup
                                value={gameDetails.platform}
                                exclusive
                                onChange={handlePlatformChange}
                                fullWidth
                            >
                                <ToggleButton value="Android" sx={SDKStyle.leftRounded}>Android</ToggleButton>
                                <ToggleButton value="iOS" sx={SDKStyle.rightRounded} disabled={gameDetails.storeStatus !== "Live"}>iOS</ToggleButton>
                            </StyledToggleButtonGroup>
                        </Stack>

                        {gameDetails.storeStatus === "Live" ?
                            <FormControl fullWidth variant="outlined" >
                                <Stack direction="row" sx={SDKStyle.stackStyle}>
                                    <Typography width={250}>Min OS Compatibility</Typography >
                                    <Select
                                        name="minOSCompatibility"
                                        value={minOSCompatibility}
                                        onChange={handleGameDetailsChange}
                                        displayEmpty
                                        fullWidth
                                        sx={SDKStyle.selectStyle}
                                        disabled={gameDetails.storeStatus === 'Live'}
                                    >
                                        <MenuItem value="" disabled>Please Select</MenuItem>
                                        {gameDetails.storeStatus === 'Live' && minOSCompatibility !== '' ? (
                                            <MenuItem key={minOSCompatibility} value={minOSCompatibility} selected>{minOSCompatibility}</MenuItem>
                                        ) : (SDKData.minOSCompatibility.map((version) => (
                                            <MenuItem key={version} value={version}>{version}</MenuItem>
                                        )))}
                                    </Select>
                                </Stack>
                            </FormControl> : null
                        }

                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Tags</Typography >
                            <Stack direction="row" sx={SDKStyle.stackStyle} gap={3}>
                                <FormControl variant="outlined" fullWidth>
                                    <Select
                                        name="genre"
                                        value={gameDetails.tags.genre}
                                        onChange={handleGameDetailsChange}
                                        displayEmpty
                                        renderValue={(selected) =>
                                            selected.length === 0 ? 'Genre' : selected.join(', ')
                                        }
                                        sx={SDKStyle.selectStyle}
                                    >
                                        {SDKData.genre.map((genre) => (
                                            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <Select
                                        name="control"
                                        value={gameDetails.tags.control}
                                        multiple
                                        onChange={handleGameDetailsChange}
                                        displayEmpty
                                        renderValue={(selected): any => selected.length === 0 ? 'Control' : selected.join(', ')}
                                        sx={SDKStyle.selectStyle}
                                    >
                                        {SDKData.control.map((control) => (
                                            <MenuItem key={control} value={control}>{control}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <Select
                                        name="mechanic"
                                        value={gameDetails.tags.mechanic}
                                        multiple
                                        onChange={handleGameDetailsChange}
                                        displayEmpty
                                        renderValue={(selected): any => selected.length === 0 ? 'Mechanic' : selected.join(', ')}
                                        sx={{
                                            ...SDKStyle.selectStyle,
                                            width: "155px"
                                        }}
                                    >
                                        {SDKData.mechanic.map((mechanic) => (
                                            <MenuItem key={mechanic} value={mechanic}>{mechanic}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>

                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Tags (Optional )</Typography >
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    name="optionalTags"
                                    value={gameDetails.tags.optionalTags}
                                    onChange={handleGameDetailsChange}
                                    displayEmpty
                                    sx={SDKStyle.selectStyle}
                                    multiple
                                    renderValue={(selected): any => selected.length === 0 ? 'Please Select' : selected.join(', ')}
                                >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    {SDKData.optionalTags.map((optionalTag) => (
                                        <MenuItem key={optionalTag} value={optionalTag}>{optionalTag}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction="row" sx={SDKStyle.stackStyle}>
                            <Typography width={250}>Game Type</Typography >
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    name="gameType"
                                    value={gameDetails.gameType}
                                    onChange={handleGameDetailsChange}
                                    displayEmpty
                                    sx={SDKStyle.selectStyle}
                                >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    {SDKData.gameType.map((gameType) => (
                                        <MenuItem key={gameType} value={gameType}>{gameType}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </Paper>
                <GameAssetsForm />
            </Stack>
        </Box>
    )
}