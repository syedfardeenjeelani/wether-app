

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Autocomplete,
  AppBar,
  Toolbar,
  Alert,
  Box
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_KEY = '5fd2b2caa6e558054ced9a6d41012c4e'; // Replace with your actual API key

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const fetchSuggestions = async () => {
    
    setSuggestions(['New York', 'London', 'Tokyo', 'Paris', 'Sydney'].filter(c => c.toLowerCase().includes(city.toLowerCase())));
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('Invalid city name or API key.');
      }
      const data = await response.json();
      setWeatherData(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
      }
      const data = await response.json();
      setForecast(data.daily);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWeatherData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Weather Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Autocomplete
              freeSolo
              options={suggestions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter city"
                  variant="outlined"
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {weatherData && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5">{weatherData.name}</Typography>
              <Typography variant="h6">{Math.round(weatherData.main.temp)}°C</Typography>
              <Typography>{weatherData.weather[0].description}</Typography>
              <Typography>Humidity: {weatherData.main.humidity}%</Typography>
              <Typography>Wind Speed: {weatherData.wind.speed} m/s</Typography>
            </CardContent>
          </Card>
        )}

        {forecast && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>7-Day Forecast</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast}>
                  <XAxis dataKey="dt" tickFormatter={timeStr => new Date(timeStr * 1000).toLocaleDateString()} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip labelFormatter={timeStr => new Date(timeStr * 1000).toLocaleDateString()} />
                  <Line type="monotone" dataKey="temp.day" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default WeatherDashboard;
