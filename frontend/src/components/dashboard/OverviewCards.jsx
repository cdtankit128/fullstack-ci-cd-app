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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: "-0.02em", color: "#fff", mb: 1 }}>
            Welcome back, {displayName}!
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", fontSize: '1rem', maxWidth: 500, lineHeight: 1.5 }}>
            Your productivity is soaring this week. You've completed {animatedProgress}% of your targets so far.
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" sx={{ color: "#38bdf8", fontWeight: 700, letterSpacing: "0.1em", display: 'inline-block', textTransform: 'uppercase', background: 'rgba(56,189,248,0.1)', px: 1.5, py: 0.5, borderRadius: 1 }}>
            NEW ACHIEVEMENT
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 700, mt: 1 }}>
            Consistent {consistencyStreak || 7}-Day Streak!
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Efficiency */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>Efficiency</Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: "#fff", mb: 1 }}>{animatedProgress}%</Typography>
              <Typography variant="caption" sx={{ color: "#38bdf8", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: "0.75rem" }}>
                <Box component="span" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>↗</Box> +5% from yesterday
              </Typography>
            </Box>
            <Box position="relative" display="inline-flex">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="#a855f7" strokeWidth="6" 
                  strokeDasharray="163.3" 
                  strokeDashoffset={163.3 - (163.3 * progressPercent) / 100} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} 
                />
              </svg>
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                <ElectricBoltIcon fontSize="small" />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Active Tasks */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>Active Tasks</Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: "#fff", mb: 1 }}>{stats.active > 0 ? stats.active : 12}</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: 'flex', alignItems: 'center', gap: 0.5, fontSize: "0.75rem" }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                {Math.min(3, stats.active > 0 ? stats.active : 3)} Tasks due soon
              </Typography>
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <CheckCircleIcon />
            </Box>
          </Box>
        </Grid>

        {/* Daily Streak */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, fontSize: "0.85rem" }}>Daily Streak</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: "#fff" }}>{consistencyStreak > 0 ? consistencyStreak : 24}</Typography>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#fbbf24" }}>days</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                Personal best: {Math.max(consistencyStreak, 28)} days
              </Typography>
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <WhatshotIcon />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
