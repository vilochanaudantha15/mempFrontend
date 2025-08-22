import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid, Card, CardContent, Typography, Container, Box, CssBaseline, CircularProgress, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
  },
});

const RawMaterialDashboard = () => {
  const [rawMaterialData, setRawMaterialData] = useState({
    upToDate: '',
    numberOfDays: 0,
    averages: {
      rawMaterialPC: 0,
      rawMaterialCrushedPC: 0,
      rawMaterialMB: 0,
    },
  });
  const [assembledItemsData, setAssembledItemsData] = useState({
    upToDate: '',
    numberOfDays: 0,
    averages: {
      cebCovers: 0,
      lecoCovers: 0,
      base: 0,
      shutters: 0,
      coverBeading: 0,
      shutterBeading: 0,
      springs: 0,
      corrugatedBoxes: 0,
      sellotapes: 0,
    },
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const date = selectedDate.format('YYYY-MM-DD');
    fetchRawMaterialData(date);
    fetchAssembledItemsData(date);
  }, [selectedDate]);

  const fetchRawMaterialData = async (upToDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/production-shift/raw-material-averages?upToDate=${upToDate}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Frontend received raw material data:', JSON.stringify(result, null, 2));
      setRawMaterialData(result);
    } catch (error) {
      console.error('Error fetching raw material averages:', error);
      setError('Failed to load raw material data. Please check the server connection or try again later.');
      setRawMaterialData({
        upToDate,
        numberOfDays: 0,
        averages: {
          rawMaterialPC: 0,
          rawMaterialCrushedPC: 0,
          rawMaterialMB: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAssembledItemsData = async (upToDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/production-shift/received-averages?upToDate=${upToDate}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Frontend received assembled items data:', JSON.stringify(result, null, 2));
      setAssembledItemsData(result);
    } catch (error) {
      console.error('Error fetching assembled items averages:', error);
      setError('Failed to load assembled items data. Please check the server connection or try again later.');
      setAssembledItemsData({
        upToDate,
        numberOfDays: 0,
        averages: {
          cebCovers: 0,
          lecoCovers: 0,
          base: 0,
          shutters: 0,
          coverBeading: 0,
          shutterBeading: 0,
          springs: 0,
          corrugatedBoxes: 0,
          sellotapes: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Production Dashboard
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Calculate Averages Up To"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ width: '100%', maxWidth: 300, mx: 'auto', display: 'block' }}
            />
          </LocalizationProvider>
          <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
            Up to: {rawMaterialData.upToDate || assembledItemsData.upToDate || 'No Data'} | 
            Based on {Math.max(rawMaterialData.numberOfDays, assembledItemsData.numberOfDays)} days of data
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mx: 'auto', maxWidth: 600 }}>
              {error}
            </Alert>
          )}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
        {!loading && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Raw Material Averages
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Raw Material PC
                    </Typography>
                    <Typography variant="h5">
                      {rawMaterialData.averages.rawMaterialPC.toFixed(2)} kg/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Raw Material Crushed PC
                    </Typography>
                    <Typography variant="h5">
                      {rawMaterialData.averages.rawMaterialCrushedPC.toFixed(2)} kg/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Raw Material MB
                    </Typography>
                    <Typography variant="h5">
                      {rawMaterialData.averages.rawMaterialMB.toFixed(2)} kg/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Assembled Items Averages
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      CEB Covers
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.cebCovers.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      LECO Covers
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.lecoCovers.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Base
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.base.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Shutters
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.shutters.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Cover Beading
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.coverBeading.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Shutter Beading
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.shutterBeading.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Springs
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.springs.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Corrugated Boxes
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.corrugatedBoxes.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Sellotapes
                    </Typography>
                    <Typography variant="h5">
                      {assembledItemsData.averages.sellotapes.toFixed(2)} units/day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default RawMaterialDashboard;
