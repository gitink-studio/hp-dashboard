import React from 'react';
import { Box, Typography, Stack, Icon } from '@mui/material';
import { Facebook, FacebookRounded, Hub, HubRounded, Instagram } from '@mui/icons-material';

interface TestOverallValuesProps {
    cpi: string;
    gender: {
        male: number;
        female: number;
    };
    age: {
        range: string;
        percentage: number;
    };
    placements: {
        q: number;
        f: number;
        o: number;
    };
}

export const TestOverallValues: React.FC<TestOverallValuesProps> = ({
    cpi,
    gender,
    age,
    placements
}) => {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                p: 2,
                overflowX: 'auto'
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#e6f7ff',
                    color: 'primary.contrastText',
                    p: 1,
                    borderRadius: 1,
                    minWidth: 100,
                }}
            >
                <Typography variant="caption" color='grey'>CPI</Typography>
                <Typography fontWeight="bold" sx={{ color: "#44abff" }}>{cpi}</Typography>
            </Box>

            <Box sx={{
                backgroundColor: '#e6f7ff',
                color: 'primary.contrastText',
                p: 1,
                borderRadius: 1,
                minWidth: 100,
            }}>
                <Typography variant="caption" color='grey'>Gender</Typography>
                <Typography fontWeight="bold" sx={{ color: "#44abff" }}>
                    {gender.male}% M | {gender.female}% F
                </Typography>
            </Box>

            <Box sx={{
                backgroundColor: '#e6f7ff',
                color: 'primary.contrastText',
                p: 1,
                borderRadius: 1,
                minWidth: 100,
            }}>
                <Typography variant="caption" color='grey'>Age</Typography>
                <Typography fontWeight="bold" sx={{ color: "#44abff" }}>
                    {age.percentage}% {age.range}
                </Typography>
            </Box>

            <Box sx={{
                backgroundColor: '#e6f7ff',
                color: 'primary.contrastText',
                p: 1,
                borderRadius: 1,
                minWidth: 100,
            }}>
                <Typography variant="caption" color='grey'>Placements</Typography>
                <Typography fontWeight="bold" sx={{ display: "flex", alignItems: "center", color: "#44abff" }} >
                    {placements.q}% &nbsp;<HubRounded fontSize='small' /> &nbsp;|&nbsp; {placements.f}% &nbsp;<FacebookRounded fontSize='small' /> &nbsp;|&nbsp; {placements.o}% &nbsp;<Instagram fontSize='small' />
                </Typography>
            </Box>
        </Stack>
    );
};
