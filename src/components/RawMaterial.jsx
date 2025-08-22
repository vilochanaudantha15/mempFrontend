import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Grid, Card, CardContent, Typography, Container, Box, 
  CssBaseline, CircularProgress, Alert, Paper, AppBar, Toolbar,
  Chip, alpha, useMediaQuery
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';

// Define API base URL
const API_BASE_URL = "/api";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#0EA5E9', // Modern sky blue
    },
    background: {
      default: '#F8FAFC', // Light slate
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Slate-800
      secondary: '#64748B', // Slate-500
    },
    success: {
      main: '#10B981', // Modern emerald
      light: '#D1FAE5',
    },
    info: {
      main: '#0EA5E9',
      light: '#E0F2FE',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    grey: {
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '32px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '24px',
    },
    h6: {
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '24px',
    },
    subtitle1: {
      color: '#64748B',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
          borderRadius: '16px',
          border: 'none',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02)',
          background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        },
        rounded: {
          borderRadius: 16,
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8F0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const date = selectedDate.format('YYYY-MM-DD');
    fetchRawMaterialData(date);
    fetchAssembledItemsData(date);
  }, [selectedDate]);

  const fetchRawMaterialData = async (upToDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/production-shift/raw-material-averages?upToDate=${upToDate}`, {
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
      const response = await fetch(`${API_BASE_URL}/production-shift/received-averages?upToDate=${upToDate}`, {
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

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get a color based on value (for visual indicators)
  const getValueColor = (value) => {
    if (value === 0) return theme.palette.grey[400];
    if (value < 50) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        backgroundColor: 'background.default',
        minHeight: '100vh',
        pb: 3,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
      }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ py: 1.5 }}>
            <FactoryIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Production Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 3, px: { xs: 2, sm: 3 } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: 'linear-gradient(to right, ' + alpha(theme.palette.primary.main, 0.05) + ', ' + alpha(theme.palette.secondary.main, 0.05) + ')',
              border: '1px solid',
              borderColor: theme.palette.grey[200],
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Production Analytics
                </Typography>
                <Typography variant="subtitle1">
                  Track your production metrics and averages
                </Typography>
              </Box>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Calculate Averages Up To"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ 
                    width: isMobile ? '100%' : 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, alignItems: 'center' }}>
              <Chip 
                icon={<TrendingUpIcon />} 
                label={`Up to: ${rawMaterialData.upToDate || assembledItemsData.upToDate || 'No Data'}`} 
                variant="outlined"
                size="small"
                sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
              />
              <Chip 
                label={`Based on ${Math.max(rawMaterialData.numberOfDays, assembledItemsData.numberOfDays)} days of data`} 
                variant="outlined"
                size="small"
                sx={{ backgroundColor: alpha(theme.palette.info.main, 0.1) }}
              />
            </Box>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  width: '100%', 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: theme.palette.error.light
                }}
              >
                {error}
              </Alert>
            )}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, width: '100%' }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Paper>
          
          {!loading && (
            <>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: theme.palette.grey[200],
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 4, 
                      height: 24, 
                      bgcolor: 'primary.main', 
                      borderRadius: 4, 
                      mr: 2,
                      background: 'linear-gradient(to bottom, ' + theme.palette.primary.main + ', ' + theme.palette.primary.light + ')'
                    }} 
                  />
                  Raw Material Averages
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Raw Material PC', value: rawMaterialData.averages.rawMaterialPC, unit: 'kg/day' },
                    { label: 'Raw Material Crushed PC', value: rawMaterialData.averages.rawMaterialCrushedPC, unit: 'kg/day' },
                    { label: 'Raw Material MB', value: rawMaterialData.averages.rawMaterialMB, unit: 'kg/day' },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ 
                        height: '100%', 
                        background: index === 0 
                          ? 'linear-gradient(135deg, ' + alpha(theme.palette.primary.main, 0.05) + ' 0%, ' + alpha(theme.palette.primary.light, 0.1) + ' 100%)' 
                          : index === 1
                          ? 'linear-gradient(135deg, ' + alpha(theme.palette.info.main, 0.05) + ' 0%, ' + alpha(theme.palette.info.light, 0.1) + ' 100%)'
                          : 'linear-gradient(135deg, ' + alpha(theme.palette.success.main, 0.05) + ' 0%, ' + alpha(theme.palette.success.light, 0.1) + ' 100%)'
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <InventoryIcon sx={{ 
                              fontSize: 20, 
                              mr: 1, 
                              color: getValueColor(item.value) 
                            }} />
                            <Typography variant="subtitle2" color="text.secondary">
                              {item.label}
                            </Typography>
                          </Box>
                          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
                            {formatNumber(item.value)}
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5, fontWeight: 500 }}>
                              {item.unit}
                            </Typography>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: theme.palette.grey[200],
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 4, 
                      height: 24, 
                      bgcolor: 'secondary.main', 
                      borderRadius: 4, 
                      mr: 2,
                      background: 'linear-gradient(to bottom, ' + theme.palette.secondary.main + ', ' + theme.palette.info.light + ')'
                    }} 
                  />
                  Assembled Items Averages
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'CEB Covers', value: assembledItemsData.averages.cebCovers, unit: 'units/day' },
                    { label: 'LECO Covers', value: assembledItemsData.averages.lecoCovers, unit: 'units/day' },
                    { label: 'Base', value: assembledItemsData.averages.base, unit: 'units/day' },
                    { label: 'Shutters', value: assembledItemsData.averages.shutters, unit: 'units/day' },
                    { label: 'Cover Beading', value: assembledItemsData.averages.coverBeading, unit: 'units/day' },
                    { label: 'Shutter Beading', value: assembledItemsData.averages.shutterBeading, unit: 'units/day' },
                    { label: 'Springs', value: assembledItemsData.averages.springs, unit: 'units/day' },
                    { label: 'Corrugated Boxes', value: assembledItemsData.averages.corrugatedBoxes, unit: 'units/day' },
                    { label: 'Sellotapes', value: assembledItemsData.averages.sellotapes, unit: 'units/day' },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ 
                        height: '100%',
                        background: 'linear-gradient(135deg, ' + alpha(theme.palette.grey[100], 0.5) + ' 0%, ' + alpha(theme.palette.background.paper, 0.5) + ' 100%)'
                      }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {item.label}
                          </Typography>
                          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
                            {formatNumber(item.value)}
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5, fontWeight: 500 }}>
                              {item.unit}
                            </Typography>
                          </Typography>
                          <Box 
                            sx={{ 
                              height: 4,
                              width: `${Math.min(100, (item.value / 100) * 100)}%`,
                              backgroundColor: getValueColor(item.value),
                              borderRadius: 2,
                              mt: 1.5,
                              opacity: item.value > 0 ? 0.7 : 0
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RawMaterialDashboard;
