import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ uid, studentName, onLogout, appContext, error }) {
  return (
    <Box className="workspace-layout">
      <Sidebar uid={uid} studentName={studentName} onLogout={onLogout} />

      <Box className="workspace-content">
        {error && <p className="error-text route-error">{error}</p>}
        <Outlet context={appContext} />
      </Box>
    </Box>
  );
}
