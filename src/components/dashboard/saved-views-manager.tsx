import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Box, 
  Typography,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import { Save, Delete, MoreVert, Visibility } from '@mui/icons-material';
import { GET_DASHBOARD_FILTERS } from '../../graphql/variables';

interface SavedView {
  id: string;
  name: string;
  filters: any;
  createdAt: string;
}

interface SavedViewsManagerProps {
  currentFilters: any;
  onLoadView: (filters: any) => void;
  onSaveView: (name: string, filters: any) => void;
}

export const SavedViewsManager: React.FC<SavedViewsManagerProps> = ({
  currentFilters,
  onLoadView,
  onSaveView
}) => {
  const [open, setOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [viewName, setViewName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedView, setSelectedView] = useState<SavedView | null>(null);

  // Mock saved views - in real implementation, this would come from backend
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: '1',
      name: 'Last 7 Days - All Platforms',
      filters: { dateRange: 'Last 7d', platform: 'All', subPlatform: 'All', game: 'All' },
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Mobile Games - Last 30 Days',
      filters: { dateRange: 'Last 30d', platform: 'Mobile', subPlatform: 'All', game: 'All' },
      createdAt: new Date().toISOString()
    }
  ]);

  const handleSaveView = () => {
    if (viewName.trim()) {
      const newView: SavedView = {
        id: Date.now().toString(),
        name: viewName.trim(),
        filters: { ...currentFilters },
        createdAt: new Date().toISOString()
      };
      setSavedViews(prev => [...prev, newView]);
      onSaveView(viewName.trim(), currentFilters);
      setViewName('');
      setSaveDialogOpen(false);
    }
  };

  const handleDeleteView = (viewId: string) => {
    setSavedViews(prev => prev.filter(view => view.id !== viewId));
    setAnchorEl(null);
    setSelectedView(null);
  };

  const handleLoadView = (view: SavedView) => {
    onLoadView(view.filters);
    setOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, view: SavedView) => {
    setAnchorEl(event.currentTarget);
    setSelectedView(view);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedView(null);
  };

  const formatFilters = (filters: any) => {
    const filterChips = [];
    if (filters.platform && filters.platform !== 'All') filterChips.push(`Platform: ${filters.platform}`);
    if (filters.subPlatform && filters.subPlatform !== 'All') filterChips.push(`Sub-Platform: ${filters.subPlatform}`);
    if (filters.game && filters.game !== 'All') filterChips.push(`Game: ${filters.game}`);
    if (filters.dateRange) filterChips.push(`Date: ${filters.dateRange}`);
    return filterChips;
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Save />}
        onClick={() => setOpen(true)}
        size="small"
      >
        Saved Views
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Saved Views</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => setSaveDialogOpen(true)}
              fullWidth
            >
              Save Current View
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Saved Views ({savedViews.length})
          </Typography>

          <List>
            {savedViews.map((view) => (
              <ListItem key={view.id} divider>
                <ListItemText
                  primary={view.name}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {formatFilters(view.filters).map((chip, index) => (
                        <Chip
                          key={index}
                          label={chip}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => handleMenuClick(e, view)}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {savedViews.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No saved views yet. Save your current filter settings to create your first view.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Current View</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            fullWidth
            variant="outlined"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="Enter a name for this view"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Filters:
            </Typography>
            {formatFilters(currentFilters).map((chip, index) => (
              <Chip
                key={index}
                label={chip}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveView} variant="contained" disabled={!viewName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedView && handleLoadView(selectedView)}>
          <Visibility sx={{ mr: 1 }} />
          Load View
        </MenuItem>
        <MenuItem 
          onClick={() => selectedView && handleDeleteView(selectedView.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete View
        </MenuItem>
      </Menu>
    </>
  );
};
