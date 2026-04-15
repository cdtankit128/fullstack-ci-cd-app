import { Box, Typography, Paper } from "@mui/material";

export default function SideStats({ stats, progressPercent, consistencyStreak }) {
  // Mock calendar view for the design
  const week1 = [
    { day: "MO", date: 25, active: false },
    { day: "TU", date: 26, active: false },
    { day: "WE", date: 27, active: false },
    { day: "TH", date: 28, active: false },
    { day: "FR", date: 29, active: false },
    { day: "SA", date: 30, active: false },
    { day: "SU", date: 1, active: true },
  ];
  
  const week2 = [
    { day: "MO", date: 2, active: true },
    { day: "TU", date: 3, active: true },
    { day: "WE", date: 4, active: true },
    { day: "TH", date: 5, active: true },
    { day: "FR", date: 6, active: true },
    { day: "SA", date: 7, active: true },
    { day: "SU", date: 8, active: false },
  ];

  return (
    <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: "20px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)", color: "#fff" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>Streak Tracker</Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>October 2023</Typography>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', mb: 2, gap: '4px' }}>
          {week1.map((item, i) => (
            <Typography key={`day-${i}`} variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: '0.65rem', fontWeight: 600 }}>{item.day}</Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '4px', mb: '8px' }}>
          {week1.map((item, i) => (
            <Box key={`date1-${i}`} sx={{ 
              width: 32, height: 32, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: '8px', 
              background: item.active ? 'rgba(168,85,247,0.2)' : 'transparent',
              border: item.active ? '1px solid rgba(168,85,247,0.5)' : 'none',
              color: item.active ? '#fff' : 'rgba(255,255,255,0.2)'
            }}>
              <Typography variant="caption" fontWeight={item.active ? 600 : 400}>{item.date}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '4px' }}>
          {week2.map((item, i) => (
            <Box key={`date2-${i}`} sx={{ 
              width: 32, height: 32, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: '8px', 
              background: item.active ? 'rgba(168,85,247,0.1)' : 'transparent',
              border: item.active ? '1px solid rgba(168,85,247,0.3)' : 'none',
              color: item.active ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>
              <Typography variant="caption" fontWeight={item.active ? 600 : 400}>{item.date}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Progress Bars */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Consistency</Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: "#38bdf8" }}>98%</Typography>
        </Box>
        <Box sx={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <Box sx={{ width: '98%', height: '100%', background: '#38bdf8', borderRadius: 3 }} />
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Focus Hours</Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: "#d946ef" }}>34.5h</Typography>
        </Box>
        <Box sx={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <Box sx={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #d946ef)', borderRadius: 3 }} />
        </Box>
      </Box>
    </Paper>
  );
}
