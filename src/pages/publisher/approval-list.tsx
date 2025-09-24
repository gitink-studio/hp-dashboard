import {
  List,
  Datagrid,
  TextField,
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
import { Assignment, Schedule, CheckCircle, Warning, Cancel, Flag } from '@mui/icons-material';

const ApprovalListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const ApprovalCard = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'hold':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      case 'pending':
        return <Schedule />;
      case 'hold':
        return <Flag />;
      default:
        return <Warning />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'normal':
        return 'info';
      case 'low':
        return 'default';
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
            <Typography variant="h6">{record.itemName}</Typography>
          </Box>
          <Box display="flex" gap={1}>
            <MuiChip
              label={record.priority}
              color={getPriorityColor(record.priority)}
              size="small"
            />
            <MuiChip
              label={record.status}
              color={getStatusColor(record.status)}
              size="small"
              icon={getStatusIcon(record.status)}
            />
          </Box>
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Typography variant="body2" color="textSecondary">
            Type: {record.approvalType?.replace('_', ' ').toUpperCase()}
          </Typography>
          {record.assignedTo && (
            <Typography variant="body2" color="textSecondary">
              Assigned To: {record.assignedTo}
            </Typography>
          )}
        </Box>
        
        {record.reason && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Reason: {record.reason}
          </Typography>
        )}
        
        {record.notes && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Notes: {record.notes}
          </Typography>
        )}
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Typography variant="caption" color="textSecondary">
            Created: {new Date(record.createdAt).toLocaleDateString()}
          </Typography>
          {record.reviewedAt && (
            <Typography variant="caption" color="textSecondary">
              Reviewed: {new Date(record.reviewedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            ID: {record.id}
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

export const ApprovalList = () => (
  <List
    actions={<ApprovalListActions />}
    title="Approvals"
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid
      rowClick="show"
      expand={<ApprovalCard />}
    >
      <TextField source="itemName" label="Item" />
      <TextField source="approvalType" label="Type" />
      <TextField source="status" label="Status" />
      <TextField source="priority" label="Priority" />
      <TextField source="assignedTo" label="Assigned To" />
      <DateField source="createdAt" label="Created" />
    </Datagrid>
  </List>
);
