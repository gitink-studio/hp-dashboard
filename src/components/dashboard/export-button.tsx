import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download, TableChart, Assessment } from '@mui/icons-material';
import { formatNumber } from '../../common/utils';

interface ExportButtonProps {
    filter?: any;
    type?: 'portfolio' | 'publisher' | 'games';
}

export const ExportButton: React.FC<ExportButtonProps> = ({ filter, type = 'portfolio' }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const exportToCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Handle nested objects and arrays
                    if (typeof value === 'object' && value !== null) {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    return `"${String(value || '').replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportKPIs = () => {
        // This would typically call the backend export endpoint
        // For now, we'll show a placeholder
        alert('KPI export functionality will be implemented with backend integration');
        handleClose();
    };

    const handleExportGames = () => {
        // This would typically call the backend export endpoint
        // For now, we'll show a placeholder
        alert('Games list export functionality will be implemented with backend integration');
        handleClose();
    };

    const handleExportRawData = () => {
        // This would typically call the backend export endpoint
        // For now, we'll show a placeholder
        alert('Raw data export functionality will be implemented with backend integration');
        handleClose();
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleClick}
                sx={{ ml: 2 }}
            >
                Export
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleExportKPIs}>
                    <ListItemIcon>
                        <Assessment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export KPIs</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportGames}>
                    <ListItemIcon>
                        <TableChart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export Games List</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportRawData}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export Raw Data</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
