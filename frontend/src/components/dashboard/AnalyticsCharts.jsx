import { Box, Typography, Paper, Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const CustomTick = ({ x, y, payload }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const isToday = payload.value === today;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill={isToday ? "#fff" : "rgba(255,255,255,0.5)"} fontWeight={isToday ? 700 : 400}>
        {payload.value}
      </text>
      {isToday && <circle cx={0} cy={24} r={3} fill="#8b5cf6" />}
    </g>
  );
};

export default function AnalyticsCharts({ consistencyData, stats, setFilter }) {
  const navigate = useNavigate();
  const chartData = [...consistencyData].reverse();
  
  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#34d399' },
    { name: 'Active', value: stats.active, color: '#60a5fa' }
  ];

  const handlePieClick = (data) => {
    if (setFilter) {
      setFilter(data.name.toLowerCase());
      navigate('/tasks');
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff", height: 340, transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "scale(1.02)", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" } }}>
          <Typography variant="h6" fontWeight={600} mb={2}>Weekly Progress</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={<CustomTick />} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
                itemStyle={{ color: "#8b5cf6" }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="count" name="Tasks done" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: '#1e293b' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff", height: 340, display: "flex", flexDirection: "column", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", "&:hover": { transform: "scale(1.02)", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" } }}>
          <Typography variant="h6" fontWeight={600} mb={1}>Task Distribution</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", mt: -1, mb: 1, display: 'block' }}>Click slice to view tasks</Typography>
          
          {(stats.total === 0) ? (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Typography>No tasks yet.</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie 
                      data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none"
                      onClick={handlePieClick}
                      style={{ outline: "none" }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: "none", cursor: 'pointer', transition: 'all 0.2s', '&:hover': { filter: 'brightness(1.2)' } }} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                {pieData.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => handlePieClick(item)}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', "&:hover": { textDecoration: 'underline' } }}>{item.name} ({item.value})</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
