import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  DateField,
  EditButton,
  DeleteButton,
  ShowButton,
  CreateButton,
  TopToolbar,
  FilterButton,
  ExportButton,
  useRecordContext
} from 'react-admin';
import { Card, CardContent, Typography, Box, Chip as MuiChip } from '@mui/material';
import { Business, LocationOn, Phone, Email } from '@mui/icons-material';

const StudioListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const StudioCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Business sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">{record.name}</Typography>
          </Box>
          <MuiChip
            label={record.isActive ? 'Active' : 'Inactive'}
            color={record.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        
        {record.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {record.description}
          </Typography>
        )}
        
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {record.contactEmail && (
            <Box display="flex" alignItems="center">
              <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {record.contactEmail}
              </Typography>
            </Box>
          )}
          {record.contactPhone && (
            <Box display="flex" alignItems="center">
              <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {record.contactPhone}
              </Typography>
            </Box>
          )}
          {record.country && (
            <Box display="flex" alignItems="center">
              <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {record.country}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            Created: {new Date(record.createdAt).toLocaleDateString()}
          </Typography>
          <Box>
            <ShowButton />
            <EditButton />
            <DeleteButton />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const StudioList = () => (
  <List
    actions={<StudioListActions />}
    title="Studios"
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid
      rowClick="show"
      expand={<StudioCard />}
    >
      <TextField source="name" label="Studio Name" />
      <EmailField source="contactEmail" label="Email" />
      <TextField source="country" label="Country" />
      <BooleanField source="isActive" label="Active" />
      <DateField source="createdAt" label="Created" showTime />
    </Datagrid>
  </List>
);
