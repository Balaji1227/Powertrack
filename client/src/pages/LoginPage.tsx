import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Alert, Paper,
  CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, BoltOutlined } from '@mui/icons-material';
import { useAppDispatch, useAuth } from '../../hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: 'linear-gradient(135deg, #1F4E79 0%, #0a2540 100%)' }}
    >
      <Paper elevation={8} sx={{ p: 5, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <BoltOutlined sx={{ color: '#1F4E79', fontSize: 36 }} />
          <Typography variant="h5" fontWeight={700} color="#1F4E79">PowerTrack</Typography>
        </Box>

        <Typography variant="h6" mb={0.5}>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to your energy dashboard
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth label="Email" name="email" type="email"
            value={form.email} onChange={handleChange}
            margin="normal" required autoFocus
          />
          <TextField
            fullWidth label="Password" name="password"
            type={showPass ? 'text' : 'password'}
            value={form.password} onChange={handleChange}
            margin="normal" required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit" fullWidth variant="contained"
            disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1.4, fontSize: '1rem' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        {/* Demo credentials */}
        <Box mt={2} p={2} sx={{ background: '#f5f9ff', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            <strong>Demo Accounts:</strong>
          </Typography>
          {[
            { role: 'Admin', email: 'admin@powertrack.com' },
            { role: 'Analyst', email: 'analyst@powertrack.com' },
            { role: 'Viewer', email: 'viewer@powertrack.com' },
          ].map((a) => (
            <Typography key={a.role} variant="caption" display="block" color="text.secondary">
              {a.role}: {a.email} / <strong>Role@123</strong>
            </Typography>
          ))}
        </Box>

        <Typography variant="body2" mt={2} textAlign="center">
          No account?{' '}
          <RouterLink to="/register" style={{ color: '#1F4E79' }}>Register</RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
