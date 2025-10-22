import  { LinearProgress,LinearProgressProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box sx= {{ display: 'flex', alignItems: 'center' }
}>
  <Box sx={ { width: '100%', mr: 1 } }>
    <LinearProgress 
    variant="determinate" 
    sx={{
      "& .MuiLinearProgress-bar": {
            transition: "none", // disables animation
          },
    }}
    {...props } />
      </Box>
      < Box sx = {{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx = {{ color: 'text.secondary' }}
        > {`${Math.round(props.value)}%`}</Typography>
        </Box>
  </Box>
  );
}