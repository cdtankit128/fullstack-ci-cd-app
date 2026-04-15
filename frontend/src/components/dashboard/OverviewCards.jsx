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
        width: 56, 
        height: 56, 
        borderRadius: '16px', 
        background: `rgba(${color}, 0.15)`, 
        border: `1px solid rgba(${color}, 0.3)`,
        color: `rgb(${color})`
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" fontSize="1.3rem">
          {animatedValue}
        </Typography>
        <Typography variant="h6" fontWeight="bold" fontSize="0.85rem" sx={{ mt: -0.5 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", mt: -0.2 }}>{subLabel}</Typography>
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.02em", color: "#fff", mb: 0.5 }}>
            Welcome back, {displayName}!
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
            Your productivity is soaring this week. You've completed {animatedProgress}% of your targets so far.
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" sx={{ color: "#38bdf8", fontWeight: 700, letterSpacing: "0.1em", display: 'block', textTransform: 'uppercase' }}>
            NEW ACHIEVEMENT
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600, mt: 0.2 }}>
            Consistent {consistencyStreak || 1}-Day Streak!
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: "16px", 
            background: "rgba(255,255,255,0.02)", 
            backdropFilter: "blur(10px)",
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}>Efficiency</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#fff", mb: 1 }}>{animatedProgress}%</Typography>
              <Typography variant="caption" sx={{ color: "#38bdf8", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>↗</Box> +5% from yesterday
              </Typography>
            </Box>
            <Box position="relative" display="inline-flex">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#a855f7" strokeWidth="4" 
                  strokeDasharray="125.6" 
                  strokeDashoffset={125.6 - (125.6 * progressPercent) / 100} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} 
                />
              </svg>
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                <ElectricBoltIcon fontSize="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: "16px", 
            background: "rgba(255,255,255,0.02)", 
            backdropFilter: "blur(10px)",
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}>Active Tasks</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#fff", mb: 1 }}>{stats.active}</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                {Math.min(3, stats.active)} Tasks due soon
              </Typography>
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <ListAltIcon />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: "16px", 
            background: "rgba(255,255,255,0.02)", 
            backdropFilter: "blur(10px)",
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}>Daily Streak</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: "#fff" }}>{consistencyStreak}</Typography>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#fbbf24" }}>days</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                Personal best: {Math.max(consistencyStreak, 28)} days
              </Typography>
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <WhatshotIcon />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
