import { Box, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineRounded';

export default function Sidebar({ uid, studentName, onLogout }) {
  const SIDEBAR_ITEMS = [
    { label: "Dashboard", icon: <HomeOutlinedIcon />, path: "/" },
    { label: "Tasks", icon: <CheckCircleOutlineIcon />, path: "/tasks" },
    { label: "Analytics", icon: <BarChartOutlinedIcon />, path: "/analytics" },
    { label: "Projects", icon: <FolderOutlinedIcon />, path: "/projects" },
    { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
  ];

  return (
    <Box className="workspace-sidebar">
      <Box>
        <Box className="sidebar-brand" sx={{ mb: 4, px: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(168,85,247,0.4)' }}>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>P</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>Productivity</Typography>
        </Box>

        <Box sx={{ px: 2, mb: 4 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            fullWidth
            sx={{ 
              background: '#a855f7', 
              color: '#fff', 
              borderRadius: '12px',
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(168,85,247,0.4)',
              '&:hover': {
                background: '#9333ea',
                boxShadow: '0 6px 20px rgba(168,85,247,0.6)',
              }
            }}
          >
            New Task
          </Button>
        </Box>

        <Box className="sidebar-nav">
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', px: 2, mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', px: 1 }}>
            {SIDEBAR_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1 }}>
        <Button 
          fullWidth
          startIcon={<HelpOutlineIcon />}
          sx={{ 
            justifyContent: 'flex-start', 
            color: 'rgba(255,255,255,0.5)', 
            textTransform: 'none',
            py: 1.2,
            px: 2,
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#fff' }
          }}
        >
          Help & Support
        </Button>
        <Button 
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={onLogout}
          sx={{ 
            justifyContent: 'flex-start', 
            color: '#ef4444', 
            textTransform: 'none',
            py: 1.2,
            px: 2,
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': { background: 'rgba(239,68,68,0.1)' }
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
}
