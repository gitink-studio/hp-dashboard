import { Box, CircularProgress, FormControl, InputAdornment, MenuItem, Paper, Select, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import MobileGameSubmissionCreatives from "./mobile-game-submission-creatives"
import { SDKData } from "../sdk-data"
import { useState } from "react";
import { useMobileGameSubmissionFormActions, useGameTitle, useMinOSCompatibility, usePlayStoreDataFetch, useStoreStatus, usePlatform, useStoreUrl, useGenre, useControl, useMechanics, useOptionalTags, useGameType, useGamePlayVideoFile, useGameIconFile, } from "../../../store/mobile-game-submission/mobile-game-submission-form-store";
import { Button, useNotify } from "react-admin";
import { FetchData } from "../../../data-providers/data-provider";
import { getFilesInfo, sendFormDataRequest, slugify, waitForSeconds } from "../../../common/utils";
import { CREATE_MOBILE_GAME_SUBMISSION_DATA_URL, CREATIVES_ROOT_URL, PlayStoreDataFetchState, STUDIO_ID } from "../../../common/constants";
import { CheckCircleRounded } from "@mui/icons-material";
import { useActiveStep, useDataSending, useDisableComponents, useMobileGameSubmissionActions } from "../../../store/mobile-game-submission/sdk-details-store";
import { customStyle } from "../../../common/styles";
import { localStorageData } from "../../../common/localStorage";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    width: '100%',
    '& .MuiToggleButtonGroup-grouped': {
        '&.Mui-selected': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
}));

export const MobileGameSubmissionForm = () => {
    const submissionName = "test-submission";
    const storeStatus = useStoreStatus();
    const storeUrl = useStoreUrl();
    const gameTitle = useGameTitle();
    const minOSCompatibility = useMinOSCompatibility();
    const playStoreDataFetchState = usePlayStoreDataFetch();
    const canDisableAllComponents = useDisableComponents();
    const platform = usePlatform();
    const genre = useGenre();
    const controls = useControl();
    const mechanics = useMechanics();
    const optionalTags = useOptionalTags();
    const gameIconFile = useGameIconFile();
    const gamePlayVideoFile = useGamePlayVideoFile();
    const gameType = useGameType();
    const activeStep = useActiveStep();
    const isDataSending = useDataSending();
    const { setDisableComponents, isStepCompleted, setDataSending, setCurrentGameSetupDetails } = useMobileGameSubmissionActions();

    const {
        setStoreStatus,
        setStoreUrl,
        setGameTitle,
        setMinOSCompatibility,
        setGameIconFile,
        setStoreUrlDisabled,
        setPlayStoreDataFetch,
        setPlatform,
        setGenre,
        setControl,
        setMechanics,
        setOptionalTags,
        setGameType,
        resetGameSubmissionData
    } = useMobileGameSubmissionFormActions();

    const notify = useNotify();
    const isValidPlayStoreURL = (value: string) => {
        const playStorePattern = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9.]+(?:&[a-zA-Z0-9._=]+)*$/;
        let isValid = playStorePattern.test(value);

        if (!isValid) {
            notify("Invalid Play Store URL!", { type: "error" });
        }

        return isValid;
    }

    const handleStoreURLChange = async (event: any) => {
        try {
            const value = event.target.value;
            setPlayStoreDataFetch(PlayStoreDataFetchState.INPROGRESS);
            setDisableComponents(true);

            console.log(value);
            await waitForSeconds(1);
            if (value !== null) {
                if (isValidPlayStoreURL(value)) {
                    setStoreUrl(value);
                    let response = await FetchData.getPlayStoreGameDetails(value);
                    console.log("Store response:", response);
                    if (response != null && response.data != null) {
                        setGameTitle(response.data.gameTitle);
                        setMinOSCompatibility(response.data.minOSCompatibility);
                        setGameIconFile(response.data.icon);
                        setStoreUrlDisabled(true);

                        setPlayStoreDataFetch(PlayStoreDataFetchState.COMPLETED);
                        setDisableComponents(false);
                    } else {
                        notify("Something went wrong!", { type: "error" });
                        setPlayStoreDataFetch('');
                        setDisableComponents(false);
                    }
                } else {
                    setPlayStoreDataFetch('');
                    setDisableComponents(false);
                }
            }
        } catch (err) {
            console.error(err);
            notify('Something went wrong!', { type: 'error' });
        }
    }

    const submitData = async (data: any) => {
        try {
            setDisableComponents(true);
            setDataSending(true);

            const commonFilePath = `${CREATIVES_ROOT_URL}/${localStorageData.studioId}/${platform.toLowerCase()}/${slugify(gameTitle)}/${submissionName}`;
            let fileList = [];

            fileList.push(gamePlayVideoFile);
            if (gameIconFile instanceof File) {
                fileList.push(gameIconFile);
            }

            let fileInfoList = getFilesInfo(commonFilePath, fileList as File[]);
            let response = await sendFormDataRequest('game-submission-data', CREATE_MOBILE_GAME_SUBMISSION_DATA_URL, fileList, { ...data, fileInfoList: fileInfoList });
            console.log(`Response: ${response}`);
            setCurrentGameSetupDetails(response.data.data);
            resetGameSubmissionData();
            setDisableComponents(false);
            setDataSending(false);
            window.location.href = '/#/getAllGameRequests'
        } catch (err) {
            notify('Something went wrong', { type: 'error' });
            console.error(err);
            setDisableComponents(false);
            setDataSending(false);
        }
    }

    const handleNext = async () => {
        if (isAllRequiredInputsEntered()) {
            await submitData({
                studioId: localStorage.getItem(STUDIO_ID),
                gameTitle: gameTitle,
                platform: platform,
                storeStatus: storeStatus,
                storeUrl: storeUrl,
                minOSCompatibility: minOSCompatibility,
                genre: genre,
                controls: controls,
                mechanics: mechanics,
                optionalTags: optionalTags,
                gameType: gameType,
                gameIconUrl: gameIconFile,
                emailId: localStorage.getItem('userName')
            })

        }
    };

    const isAllRequiredInputsEntered = () => {
        if (storeStatus === "Live") {
            if (storeUrl === '') {
                notify("Store URL is required when Store Status is Live!", { type: "error" });
                return false;
            }

            if (minOSCompatibility === '') {
                notify("Minimum OS Compatibility is required!", { type: "error" });
                return false;
            }
        } else if (storeStatus === "Not Live") {
            if (gameTitle === '') {
                notify("Game Title is required when Store Status is Not Live!", { type: "error" });
                return false;
            }
        }

        if (genre === '') {
            notify("Genre is required!", { type: "error" });
            return false;
        }

        if (controls.length === 0) {
            notify("At least one control is required!", { type: "error" });
            return false;
        }

        if (mechanics.length === 0) {
            notify("At least one mechanic is required!", { type: "error" });
            return false;
        }

        if (gameType === '') {
            notify("Game Type is required!", { type: "error" });
            return false;
        }

        if (gameIconFile === null) {
            notify("Game Icon is required!", { type: "error" });
            return false;
        }

        if (gamePlayVideoFile === null) {
            notify("Game Play Video is required!", { type: "error" });
            return false;
        }

        return true;
    }

    return (
        <Box>
            <Stack gap={5}>
                <Paper elevation={1} sx={customStyle.paperStyle}>
                    <Typography fontWeight='bold' mb={3}> Game Details</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Store Status</Typography>
                            <StyledToggleButtonGroup
                                value={storeStatus}
                                exclusive
                                onChange={(e, value) => {
                                    resetGameSubmissionData();
                                    return value !== null && setStoreStatus(value)
                                }}
                                fullWidth
                            >
                                <ToggleButton value="Live" sx={customStyle.leftRounded} disabled={canDisableAllComponents || isStepCompleted(activeStep)}>Live</ToggleButton>
                                <ToggleButton value="Not Live" sx={customStyle.rightRounded} disabled={canDisableAllComponents || isStepCompleted(activeStep)}>Not Live</ToggleButton>
                            </StyledToggleButtonGroup>
                        </Stack>
                        {storeStatus === "Live" ?
                            <Stack direction="row" sx={customStyle.stackStyle}>
                                <Typography width={250}>Store URL</Typography>
                                <TextField
                                    fullWidth
                                    name="storeUrl"
                                    variant="outlined"
                                    placeholder="Insert Store URL"
                                    onChange={handleStoreURLChange}
                                    // value={storeUrl}
                                    disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                    sx={customStyle.textFieldStyle}
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

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Game Title</Typography>
                            <TextField
                                fullWidth
                                name="gameTitle"
                                variant="outlined"
                                placeholder="Enter game title here"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                required
                                sx={customStyle.textFieldStyle}
                                disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Platform</Typography>
                            <StyledToggleButtonGroup
                                value={platform}
                                exclusive
                                onChange={(e, value) => value !== null && setPlatform(value)}
                                fullWidth
                            >
                                <ToggleButton value="Android" sx={customStyle.leftRounded}>Android</ToggleButton>
                                <ToggleButton value="iOS" sx={customStyle.rightRounded} disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}>iOS</ToggleButton>
                            </StyledToggleButtonGroup>
                        </Stack>

                        {storeStatus === "Live" ?
                            <FormControl fullWidth variant="outlined" >
                                <Stack direction="row" sx={customStyle.stackStyle}>
                                    <Typography width={250}>Min OS Compatibility</Typography >
                                    <Select
                                        name="minOSCompatibility"
                                        value={minOSCompatibility}
                                        onChange={(e) => setMinOSCompatibility(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                        sx={customStyle.selectStyle}
                                        disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                                    >
                                        <MenuItem value="" disabled>Please Select</MenuItem>
                                        {storeStatus === 'Live' && minOSCompatibility !== '' ? (
                                            <MenuItem key={minOSCompatibility} value={minOSCompatibility} selected>{minOSCompatibility}</MenuItem>
                                        ) : (SDKData.minOSCompatibility.map((version) => (
                                            <MenuItem key={version} value={version}>{version}</MenuItem>
                                        )))}
                                    </Select>
                                </Stack>
                            </FormControl> : null
                        }

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Tags</Typography >
                            <Stack direction="row" sx={{ ...customStyle.stackStyle, display: "flex", justifyContent: "space-between" }}>
                                <FormControl variant="outlined">
                                    <Select
                                        name="genre"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        displayEmpty
                                        sx={{
                                            ...customStyle.selectStyle,
                                            ...customStyle.selectGroupStyle
                                        }}
                                        renderValue={(selected) => selected === '' ? 'Genre' : selected}
                                        disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                    >
                                        {SDKData.genre.map((genre) => (
                                            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined">
                                    <Select
                                        name="control"
                                        value={controls}
                                        multiple
                                        onChange={(e) => setControl(e.target.value as string[])}
                                        displayEmpty
                                        renderValue={(selected): any => selected.length === 0 ? 'Control' : selected.join(', ')}
                                        sx={{
                                            ...customStyle.selectStyle,
                                            ...customStyle.selectGroupStyle
                                        }}
                                        disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                    >
                                        {SDKData.control.map((control) => (
                                            <MenuItem key={control} value={control}>{control}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined">
                                    <Select
                                        name="mechanic"
                                        value={mechanics}
                                        multiple
                                        onChange={(e) => setMechanics(e.target.value as string[])}
                                        displayEmpty
                                        renderValue={(selected): any => selected.length === 0 ? 'Mechanic' : selected.join(', ')}
                                        sx={{
                                            ...customStyle.selectStyle,
                                            ...customStyle.selectGroupStyle
                                        }}
                                        disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                    >
                                        {SDKData.mechanic.map((mechanic) => (
                                            <MenuItem key={mechanic} value={mechanic}>{mechanic}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Tags (Optional )</Typography >
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    name="optionalTags"
                                    value={optionalTags}
                                    onChange={(e) => setOptionalTags(e.target.value as string[])}
                                    displayEmpty
                                    sx={customStyle.selectStyle}
                                    multiple
                                    renderValue={(selected): any => selected.length === 0 ? 'Please Select' : selected.join(', ')}
                                    disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    {SDKData.optionalTags.map((optionalTag) => (
                                        <MenuItem key={optionalTag} value={optionalTag}>{optionalTag}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Game Type</Typography >
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    name="gameType"
                                    value={gameType}
                                    onChange={(e) => setGameType(e.target.value)}
                                    displayEmpty
                                    sx={customStyle.selectStyle}
                                    disabled={canDisableAllComponents || isStepCompleted(activeStep)}
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
                <MobileGameSubmissionCreatives />
                <Box display='flex' justifyContent={'flex-end'}>
                    {
                        isDataSending ?
                            (<Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ px: 2, py: 1, textTransform: "none", borderRadius: 20 }}
                                disabled={isStepCompleted(activeStep) || isDataSending}
                                endIcon={<CircularProgress size={20} />}
                            >
                                Processing
                            </Button>) :
                            (<Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ px: 2, py: 1, textTransform: "none", borderRadius: 20 }}
                                disabled={isStepCompleted(activeStep) || isDataSending}
                            >
                                Add Game
                            </Button>)
                    }
                </Box>
            </Stack>
        </Box>
    )
}
