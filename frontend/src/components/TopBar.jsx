import { Box, InputBase, IconButton, Avatar, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function TopBar({ studentName }) {
  const firstName = studentName ? (studentName.split(" ")[0].charAt(0).toUpperCase() + studentName.split(" ")[0].slice(1).toLowerCase()) : "User";

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      py: 3,
      px: 3,
      background: 'transparent',
      color: '#fff'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '12px',
        px: 2,
        py: 0.5,
        width: 300,
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} fontSize="small" />
        <InputBase 
          placeholder="Search" 
          sx={{ color: '#fff', fontSize: '0.9rem', width: '100%' }} 
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', p: 1 }}>
          <NotificationsNoneIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight={600} color="#fff">{firstName}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: -0.5 }}>Member</Typography>
          </Box>
          <Avatar sx={{ bgcolor: '#a855f7', width: 38, height: 38, borderRadius: '12px' }}>
            {firstName.charAt(0)}
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
}