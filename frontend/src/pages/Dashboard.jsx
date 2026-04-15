import { useOutletContext } from "react-router-dom";
import { Grid, Box, Skeleton } from "@mui/material";
import OverviewCards from "../components/dashboard/OverviewCards";
import ActiveTasks from "../components/dashboard/ActiveTasks";
import SideStats from "../components/dashboard/SideStats";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";

export default function Dashboard() {
  const { stats, progressPercent, consistencyData, consistencyStreak, uid, visibleTodos, handleToggle, loading, setFilter } = useOutletContext();

  // Skeleton Loader for production feel
  if (loading) {
    return (
      <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 }, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
        <Skeleton variant="rounded" width="100%" height={220} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.05)" }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.05)" }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.05)" }} />
          </Grid>
        </Grid>
        <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.05)" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 }, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 3, fontFamily: '"Inter", sans-serif' }}>
      <Grid container spacing={3}>
        {/* Top Section */}
        <Grid item xs={12}>
          <OverviewCards 
            uid={uid} 
            progressPercent={progressPercent} 
            stats={stats} 
            consistencyStreak={consistencyStreak}
            consistencyData={consistencyData}
          />
        </Grid>

        {/* Middle Section */}
        <Grid item xs={12} md={8}>
          <ActiveTasks 
            todos={visibleTodos} 
            onToggle={handleToggle}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SideStats 
            stats={stats} 
            progressPercent={progressPercent} 
            consistencyStreak={consistencyStreak} 
          />
        </Grid>

        {/* Bottom Section */}
        <Grid item xs={12}>
          <AnalyticsCharts 
            consistencyData={consistencyData} 
            stats={stats} 
            setFilter={setFilter}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
