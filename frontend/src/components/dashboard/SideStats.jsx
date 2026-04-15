import { Box, Typography, Paper, Grid } from "@mui/material";

export default function SideStats({ stats, progressPercent, consistencyStreak }) {
  const currentDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      date: d.getDate(),
      isToday: i === 3
    };
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: "20px", background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.05))", border: "1px solid rgba(99,102,241,0.2)", backdropFilter: "blur(10px)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "scale(1.04)" } }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">Completed</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{stats.completed}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: "20px", background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.05))", border: "1px solid rgba(236,72,153,0.2)", backdropFilter: "blur(10px)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "scale(1.04)" } }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">Pending</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{stats.active}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, flexGrow: 1, borderRadius: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff", display: 'flex', flexDirection: 'column', transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "scale(1.02)", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" } }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Productivity & Streak</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight={700} color="#fbbf24">{consistencyStreak}</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">Current Streak 🔥</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h3" fontWeight={700} color="#34d399">{progressPercent}%</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">Efficiency 🚀</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="rgba(255,255,255,0.6)" mb={1} display="block" textTransform="uppercase" letterSpacing="0.05em">Mini Calendar</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {currentDays.map((item, i) => (
              <Box key={i} sx={{ textAlign: 'center', p: "6px 4px", borderRadius: '10px', background: item.isToday ? 'rgba(99,102,241,0.5)' : 'transparent', border: item.isToday ? '1px solid #6366f1' : '1px solid transparent', minWidth: "32px", transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                <Typography variant="caption" sx={{ color: item.isToday ? '#fff' : 'rgba(255,255,255,0.5)', display: 'block', fontSize: "0.65rem", fontWeight: item.isToday ? 600 : 400 }}>{item.day}</Typography>
                <Typography variant="body2" fontWeight={item.isToday ? 700 : 400} sx={{ color: item.isToday ? '#fff' : 'rgba(255,255,255,0.8)', fontSize: "0.85rem" }}>{item.date}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
