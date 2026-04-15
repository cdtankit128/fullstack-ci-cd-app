import { Box, Typography, Stack, Grid, Paper, Chip } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import useCountUp from "../../hooks/useCountUp";

function StatItem({ label, value, subLabel, icon, color }) {
  const animatedValue = useCountUp(value);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: 68, 
        height: 68, 
        borderRadius: '20px', 
        background: `rgba(${color}, 0.15)`, 
        border: `1px solid rgba(${color}, 0.3)`,
        color: `rgb(${color})`
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" fontSize="1.4rem">
          {animatedValue}
        </Typography>
        <Typography variant="h6" fontWeight="bold" fontSize="0.9rem" sx={{ mt: -0.5 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>{subLabel}</Typography>
      </Box>
    </Box>
  );
}

export default function OverviewCards({ uid = "Ankit", studentName, progressPercent, stats, consistencyStreak, consistencyData }) {
  // Format name: "SUMIT KUMAR" -> "Sumit"
  const formatName = (name) => {
    if (!name) return null;
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };
  const displayName = formatName(studentName) || uid || "Ankit";
  const animatedProgress = useCountUp(progressPercent);

  // AI Insights Logic
  const bestDayData = consistencyData && consistencyData.length > 0
    ? consistencyData.reduce((prev, current) => (prev.count > current.count ? prev : current), { count: 0 })
    : null;
  
  const bestDay = bestDayData && bestDayData.count > 0 ? bestDayData.day : "weekdays";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        backdropFilter: "blur(12px)",
        background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        color: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 30px 70px rgba(99,102,241,0.2)",
          borderColor: "rgba(255,255,255,0.2)"
        }
      }}
    >
      <Box sx={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", bottom: -80, left: 10, width: 200, height: 200, background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      
      <Grid container spacing={4} alignItems="center" position="relative" zIndex={1}>
        <Grid item xs={12} lg={5}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5, letterSpacing: "-0.02em" }}>
            Welcome back, {displayName} 👋
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
            <Chip 
              icon={<AutoAwesomeIcon sx={{ color: '#fbbf24 !important', fontSize: '1.1rem' }} />} 
              label={`Most productive on ${bestDay}s`} 
              sx={{ 
                background: 'rgba(251,191,36,0.15)', 
                color: '#fbbf24', 
                border: '1px solid rgba(251,191,36,0.3)',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                px: 1
              }} 
            />
            {stats.active > 0 && (
              <Chip 
                icon={<ElectricBoltIcon sx={{ color: '#38bdf8 !important', fontSize: '1.1rem' }} />} 
                label={`2 more for a streak boost!`} 
                sx={{ 
                  background: 'rgba(56,189,248,0.15)', 
                  color: '#38bdf8', 
                  border: '1px solid rgba(56,189,248,0.3)',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  px: 1
                }} 
              />
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} lg={7}>
          <Grid container spacing={4} justifyContent={{ lg: 'flex-end' }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box position="relative" display="inline-flex">
                  <svg width="68" height="68" viewBox="0 0 68 68">
                    <circle cx="34" cy="34" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4.5" />
                    <circle cx="34" cy="34" r="30" fill="none" stroke="#8b5cf6" strokeWidth="4.5" 
                      strokeDasharray="188.5" 
                      strokeDashoffset={188.5 - (188.5 * progressPercent) / 100} 
                      strokeLinecap="round" 
                      style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} 
                    />
                  </svg>
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" component="div" color="white" fontWeight="bold" fontSize="0.9rem">
                      {animatedProgress}%
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" fontSize="1.1rem">Efficiency</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Task success</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <StatItem 
                label="Active" 
                value={stats.active} 
                subLabel="Pending items" 
                icon={<ListAltIcon fontSize="medium" />} 
                color="56, 189, 248" // light blue
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StatItem 
                label="Streak" 
                value={consistencyStreak} 
                subLabel="Day streak" 
                icon={<WhatshotIcon fontSize="medium" />} 
                color="251, 191, 36" // amber
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
