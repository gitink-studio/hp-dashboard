import {
  List,
  Datagrid,
  TextField,
  NumberField,
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
import { Assignment, AttachMoney, CalendarToday, TrendingUp } from '@mui/icons-material';

const ContractListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const ContractCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'revenue_share':
        return 'primary';
      case 'minimum_guarantee':
        return 'secondary';
      case 'hybrid':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Assignment sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              {record.contractType?.replace('_', ' ').toUpperCase()}
            </Typography>
          </Box>
          <MuiChip
            label={record.isActive ? 'Active' : 'Inactive'}
            color={record.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {record.revenueShare && (
            <Box display="flex" alignItems="center">
              <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                Revenue Share: {record.revenueShare}%
              </Typography>
            </Box>
          )}
          {record.minimumGuarantee && (
            <Box display="flex" alignItems="center">
              <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                Min Guarantee: ${record.minimumGuarantee.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Box display="flex" alignItems="center">
            <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              Start: {new Date(record.startDate).toLocaleDateString()}
            </Typography>
          </Box>
          {record.endDate && (
            <Box display="flex" alignItems="center">
              <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                End: {new Date(record.endDate).toLocaleDateString()}
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

export const ContractList = () => (
  <List
    actions={<ContractListActions />}
    title="Contracts"
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid
      rowClick="show"
      expand={<ContractCard />}
    >
      <TextField source="contractType" label="Type" />
      <NumberField source="revenueShare" label="Revenue Share %" />
      <NumberField source="minimumGuarantee" label="Min Guarantee" />
      <DateField source="startDate" label="Start Date" />
      <DateField source="endDate" label="End Date" />
      <BooleanField source="isActive" label="Active" />
    </Datagrid>
  </List>
);
