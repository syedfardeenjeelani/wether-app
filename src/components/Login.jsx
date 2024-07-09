
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          {isRegistering ? "Create an account" : "Welcome back"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {isRegistering ? "Please register to continue" : "Please sign in to your account"}
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleAuth} style={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (isRegistering ? "Register" : "Sign In")}
          </Button>
        </form>
        
        <Link
          component="button"
          variant="body2"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
        </Link>
      </Paper>
    </Container>
  );
}

export default Login;