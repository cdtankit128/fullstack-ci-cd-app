import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  ToggleButtonGroup, 
  ToggleButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Chip, 
  Paper, 
  Tooltip,
  Fade
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import { useState } from "react";

const getPriorityColor = (p) => {
  switch (p) {
    case 'High': return '#f87171';
    case 'Medium': return '#fbbf24';
    case 'Low': return '#34d399';
    default: return '#94a3b8';
  }
};

export default function Tasks() {
  const {
    uid,
    loading,
    newTask,
    setNewTask,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    filter,
    setFilter,
    stats,
    visibleTodos,
    editingTodoId,
    editingText,
    setEditingText,
    handleAddTask,
    handleToggle,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    clearCompleted,
  } = useOutletContext();

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ 
        maxWidth: 1000, 
        mx: 'auto', 
        py: { xs: 2, sm: 4 }, 
        px: { xs: 1, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.1em' }}>
            Core Work Area
          </Typography>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mt: 1 }}>
            Focus List
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            Manage your high-impact tasks and deadlines in one place.
          </Typography>
        </Box>

        {/* Input Section */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          borderRadius: '24px', 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <form onSubmit={handleAddTask}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                fullWidth
                variant="standard"
                placeholder="What objective are we tackling today?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={!uid || loading}
                sx={{
                  input: {
                    color: '#ffffff',
                    '&::placeholder': { 
                      color: 'rgba(255,255,255,0.6)', 
                      opacity: 1 
                    },
                    '&.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(255,255,255,0.6)',
                    }
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: { 
                    fontSize: '1.5rem', 
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.5 }}>Priority</Typography>
                    <ToggleButtonGroup
                      value={priority}
                      exclusive
                      onChange={(e, val) => val && setPriority(val)}
                      size="small"
                      sx={{ 
                        '& .MuiToggleButton-root': { 
                          color: '#dae2fd', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          px: 2,
                          '&.Mui-selected': { 
                            background: 'rgba(139, 92, 246, 0.4)', 
                            color: '#ffffff',
                            borderColor: '#8b5cf6'
                          } 
                        } 
                      }}
                    >
                      <ToggleButton value="Low">Low</ToggleButton>
                      <ToggleButton value="Medium">Med</ToggleButton>
                      <ToggleButton value="High">High</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.5 }}>Due Date</Typography>
                    <DateTimePicker 
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      value={dueDate ? dayjs(dueDate) : null}
                      onChange={(val) => setDueDate(val ? val.toISOString() : null)}
                      slotProps={{ 
                        textField: { 
                          variant: 'standard', 
                          size: 'small',
                          sx: {
                            input: { 
                              color: '#ffffff',
                              WebkitTextFillColor: '#ffffff'
                            },
                            '& .MuiInputBase-input::placeholder': { 
                              color: 'rgba(255,255,255,0.4)', 
                              opacity: 1 
                            },
                            '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' }
                          },
                          InputProps: { 
                            disableUnderline: true,
                            sx: { 
                              fontSize: '0.9rem'
                            }
                          }
                        } 
                      }}
                    />
                  </Box>
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={!uid || loading || !newTask.trim()}
                  sx={{ 
                    borderRadius: '12px', 
                    px: 4, 
                    py: 1,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
                    '&:hover': { transform: 'translateY(-2px)' },
                    '&.Mui-disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.4)',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Create Task
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        {/* List Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['all', 'active', 'completed'].map((f) => (
                <Chip 
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  onClick={() => setFilter(f)}
                  sx={{ 
                    bgcolor: filter === f ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: filter === f ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
                    border: '1px solid',
                    borderColor: filter === f ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                />
              ))}
            </Box>
            <Button 
              size="small" 
              onClick={clearCompleted} 
              disabled={!stats.completed || loading}
              sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none' }}
            >
              Clear Completed
            </Button>
          </Box>

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {visibleTodos.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No tasks found in this category.</Typography>
              </Box>
            )}
            {visibleTodos.map((todo) => {
              const isOverdue = todo.dueDate && dayjs(todo.dueDate).isBefore(dayjs(), 'day') && !todo.completed;
              
              return (
                <Paper
                  key={todo.id}
                  elevation={0}
                  onMouseEnter={() => setHoveredId(todo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{ 
                    borderRadius: '16px',
                    background: todo.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: hoveredId === todo.id ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <IconButton onClick={() => handleToggle(todo)} sx={{ color: todo.completed ? '#34d399' : 'rgba(255,255,255,0.2)' }}>
                        {todo.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                      </IconButton>
                    </ListItemIcon>

                    <ListItemText 
                      primary={
                        editingTodoId === todo.id ? (
                          <TextField 
                            fullWidth 
                            variant="standard" 
                            value={editingText} 
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={() => handleSaveEdit(todo.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                            autoFocus
                            InputProps={{ disableUnderline: true, sx: { color: '#fff' } }}
                          />
                        ) : (
                          <Typography sx={{ 
                            color: todo.completed ? 'rgba(255,255,255,0.4)' : '#fff',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            fontSize: '1rem',
                            fontWeight: 500
                          }}>
                            {todo.text}
                          </Typography>
                        )
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FlagIcon sx={{ fontSize: 14, color: getPriorityColor(todo.priority) }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{todo.priority}</Typography>
                          </Box>
                          {todo.dueDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarMonthIcon sx={{ fontSize: 14, color: isOverdue ? '#f87171' : 'rgba(255,255,255,0.4)' }} />
                              <Typography variant="caption" sx={{ color: isOverdue ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                                  {dayjs(todo.dueDate).format('MMM D, YYYY HH:mm')}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />

                    <Fade in={hoveredId === todo.id || editingTodoId === todo.id}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {editingTodoId === todo.id ? (
                          <>
                            <Button size="small" onClick={() => handleSaveEdit(todo.id)} sx={{ color: '#8b5cf6' }}>Save</Button>
                            <Button size="small" onClick={handleCancelEdit} sx={{ color: 'rgba(255,255,255,0.4)' }}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <IconButton size="small" onClick={() => handleStartEdit(todo)} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#8b5cf6' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(todo.id)} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#f87171' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Fade>
                  </ListItem>
                </Paper>
              );
            })}
          </List>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
