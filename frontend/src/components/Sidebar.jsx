import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import AnalyticsIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ uid, studentName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Tasks", icon: <TaskIcon />, path: "/tasks" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box className="workspace-sidebar">
      <div>
        <div className="sidebar-brand">
          <img src="/cu-logo.svg" alt="TaskSphere logo" className="sidebar-logo" />
          <div>
            <p className="sidebar-eyebrow">TaskSphere</p>
            <h2>Workspace</h2>
          </div>
        </div>

        <List className="sidebar-nav">
          {menu.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              className={location.pathname === item.path ? "sidebar-link sidebar-link-active" : "sidebar-link"}
            >
              <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </div>

      <div className="sidebar-profile">
        {studentName && <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e2e8f0", marginBottom: 2 }}>{studentName}</p>}
        <p>Signed in as</p>
        <strong>{uid}</strong>
        <button type="button" className="logout-btn" onClick={onLogout}>
          <LogoutRoundedIcon fontSize="small" />
          Logout
        </button>
      </div>
    </Box>
  );
}
