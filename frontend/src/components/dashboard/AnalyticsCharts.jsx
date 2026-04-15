import { Box, Typography, Paper, Grid } from "@mui/material";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        background: "rgba(15, 23, 42, 0.9)", 
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)", 
        borderRadius: "12px", 
        p: 1.5,
        color: "#fff"
      }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: 'block', mb: 0.5 }}>{label}</Typography>
        <Typography variant="body2" fontWeight="bold">
          <Box component="span" sx={{ color: "#a855f7", mr: 1 }}>●</Box>
          {payload[0].value} Tasks Completed
        </Typography>
      </Box>
    );
  }
  return null;
};

const CustomTick = ({ x, y, payload }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const isToday = payload.value.toUpperCase() === today;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill={isToday ? "#fff" : "rgba(255,255,255,0.4)"} fontWeight={isToday ? 700 : 500} fontSize="11">
        {payload.value.substring(0, 3).toUpperCase()}
      </text>
    </g>
  );
};

export default function AnalyticsCharts({ consistencyData, stats, setFilter }) {
  const navigate = useNavigate();
  // Using consistency data and ensuring we have 7 days for the bar chart
  const chartData = [...consistencyData].reverse().map(item => ({
    ...item,
    day: item.day.substring(0, 3).toUpperCase()
  }));
  
  const pieData = [
    { name: 'To Do', value: Math.max(stats.active - 3, 0), color: '#38bdf8' },
    { name: 'In Progress', value: Math.min(stats.active, 3), color: '#a855f7' },
    { name: 'Completed', value: stats.completed, color: '#d946ef' }
  ];

  const handlePieClick = (data) => {
    if (setFilter) {
      // Map back to our simple statuses if needed
      setFilter(data.name === 'Completed' ? 'completed' : 'active');
      navigate('/tasks');
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12} md={7}>
        <Paper elevation={0} sx={{ 
          p: 3, 
          borderRadius: "20px", 
          background: "rgba(255,255,255,0.015)", 
          border: "1px solid rgba(255,255,255,0.03)", 
          color: "#fff", 
          height: 320,
          display: "flex",
          flexDirection: "column"
        }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>Weekly Progress</Typography>
          
          <Box sx={{ flexGrow: 1, width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={<CustomTick />} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} 
                  axisLine={false} 
                  tickLine={false} 
                  allowDecimals={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorCount)" 
                  radius={[6, 6, 6, 6]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Paper elevation={0} sx={{ 
          p: 3, 
          borderRadius: "20px", 
          background: "rgba(255,255,255,0.015)", 
          border: "1px solid rgba(255,255,255,0.03)", 
          color: "#fff", 
          height: 320, 
          display: "flex", 
          flexDirection: "column"
        }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Task Distribution</Typography>
          
          {(stats.total === 0) ? (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Typography>No activities recorded yet.</Typography>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ height: 170, width: "100%", position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={4} 
                      dataKey="value" 
                      stroke="none"
                      onClick={handlePieClick}
                      style={{ outline: "none", cursor: 'pointer' }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 3, px: 1 }}>
                {pieData.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => handlePieClick(item)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>{item.name}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
