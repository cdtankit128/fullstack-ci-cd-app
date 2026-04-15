import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout({ uid, studentName, onLogout, appContext, error }) {
  return (
    <Box className="workspace-layout">
      <Sidebar uid={uid} studentName={studentName} onLogout={onLogout} />

      <Box className="workspace-content">
        <TopBar studentName={studentName} />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, pt: 1 }}>
          {error && <p className="error-text route-error">{error}</p>}
          <Outlet context={appContext} />
        </Box>
      </Box>
    </Box>
  );
}
