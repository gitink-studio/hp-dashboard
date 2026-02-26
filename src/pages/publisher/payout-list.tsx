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
import { AttachMoney, Schedule, CheckCircle, Warning, Cancel } from '@mui/icons-material';

const PayoutListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const PayoutCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle />;
      case 'approved':
        return <CheckCircle />;
      case 'pending':
        return <Schedule />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Warning />;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              {record.currency} {record.amount?.toLocaleString()}
            </Typography>
          </Box>
          <MuiChip
            label={record.status}
            color={getStatusColor(record.status)}
            size="small"
            icon={getStatusIcon(record.status)}
          />
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Typography variant="body2" color="textSecondary">
            Type: {record.payoutType?.replace('_', ' ').toUpperCase()}
          </Typography>
          {record.paymentMethod && (
            <Typography variant="body2" color="textSecondary">
              Method: {record.paymentMethod}
            </Typography>
          )}
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Box display="flex" alignItems="center">
            <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              Scheduled: {new Date(record.scheduledDate).toLocaleDateString()}
            </Typography>
          </Box>
          {record.paidDate && (
            <Box display="flex" alignItems="center">
              <CheckCircle sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                Paid: {new Date(record.paidDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
        
        {record.notes && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Notes: {record.notes}
          </Typography>
        )}
        
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

export const PayoutList = () => (
  <List
    actions={<PayoutListActions />}
    title="Payouts"
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid
      rowClick="show"
      expand={<PayoutCard />}
    >
      <NumberField source="amount" label="Amount" />
      <TextField source="currency" label="Currency" />
      <TextField source="payoutType" label="Type" />
      <TextField source="status" label="Status" />
      <DateField source="scheduledDate" label="Scheduled" />
      <DateField source="paidDate" label="Paid Date" />
    </Datagrid>
  </List>
);
