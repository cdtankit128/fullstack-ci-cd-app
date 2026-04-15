import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, IconButton, Button } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from "react-router-dom";

export default function ActiveTasks({ todos, onToggle }) {
  const activeTodos = todos.filter(t => !t.completed).slice(0, 5);
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        color: "#f8fafc",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
        "&:hover": { transform: "scale(1.02)", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Active Tasks</Typography>
        <Typography variant="body2" color="#8b5cf6" sx={{ cursor: 'pointer', "&:hover": { textDecoration: "underline" } }} onClick={() => navigate('/tasks')}>
          View All
        </Typography>
      </Box>

      {activeTodos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RocketLaunchIcon sx={{ fontSize: 48, color: '#fbbf24', mb: 2, opacity: 0.9 }} />
          <Typography variant="h6" mb={1} fontWeight={600}>🚀 Start your journey!</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 3, maxWidth: '250px' }}>
            Add your first task and build consistency today.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/tasks')}
            sx={{ 
              borderRadius: "12px", 
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
              "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 10px 25px rgba(99,102,241,0.4)" }
            }}
          >
            + Add Task
          </Button>
        </Box>
      ) : (
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 0 }}>
          {activeTodos.map((todo) => (
            <ListItem 
              key={todo.id}
              sx={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)", transform: "translateY(-2px)" }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <IconButton size="small" onClick={() => onToggle(todo)} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#22c55e", transform: "scale(1.1)" }, transition: 'all 0.2s ease'}}>
                  <RadioButtonUncheckedIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
              <ListItemText 
                primary={todo.text} 
                primaryTypographyProps={{ sx: { color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
