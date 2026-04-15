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
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: "20px",
        color: "#f8fafc",
        "&:hover": {}
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Active Tasks</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/tasks')}
          sx={{ 
            borderRadius: "8px", 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#a855f7",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            py: 0.5,
            boxShadow: "none",
            "&:hover": { background: "rgba(255,255,255,0.1)", boxShadow: "none" }
          }}
        >
          + Add Task
        </Button>
      </Box>

      {activeTodos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, position: 'relative'
          }}>
            <Box sx={{ position: 'absolute', top: 5, right: 10, width: 14, height: 14, borderRadius: '50%', background: '#a855f7', filter: 'blur(2px)' }} />
            <RocketLaunchIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.5)', transform: 'rotate(25deg)' }} />
          </Box>
          <Typography variant="h5" mb={1} fontWeight={600} color="#fff">No active tasks found</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 4, maxWidth: '320px', lineHeight: 1.6 }}>
            It looks like your slate is clean. This is the perfect moment to start your journey and conquer new goals!
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/tasks')}
            sx={{ 
              borderRadius: "12px", 
              background: "#9333ea",
              textTransform: "none",
              fontWeight: 500,
              px: 4,
              py: 1,
              boxShadow: "none",
              "&:hover": { background: "#7e22ce" }
            }}
          >
            Start your journey!
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
