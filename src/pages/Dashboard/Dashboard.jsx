import * as React from 'react';
import { createTheme, styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Analytics from '../../pages/Dashboard/Analytics';
import { keyframes } from '@emotion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';

const API_BASE_URL = "/api";

// Floating animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// iOS-style gradient backgrounds
const gradientBackgrounds = {
  primary: 'linear-gradient(135deg, rgba(120, 119, 216, 0.85) 0%, rgba(81, 69, 205, 0.85) 100%)',
  secondary: 'linear-gradient(135deg, rgba(245, 247, 250, 0.85) 0%, rgba(195, 207, 226, 0.85) 100%)',
  success: 'linear-gradient(135deg, rgba(67, 233, 123, 0.85) 0%, rgba(56, 249, 215, 0.85) 100%)',
  warning: 'linear-gradient(135deg, rgba(246, 211, 101, 0.85) 0%, rgba(253, 160, 133, 0.85) 100%)',
  error: 'linear-gradient(135deg, rgba(255, 117, 140, 0.85) 0%, rgba(255, 126, 179, 0.85) 100%)',
  sidebar: 'linear-gradient(180deg, rgba(251, 251, 254, 0.95) 0%, rgba(247, 247, 250, 0.95) 100%)',
  header: 'linear-gradient(90deg, rgba(251, 251, 254, 0.95) 0%, rgba(247, 247, 250, 0.95) 100%)',
};

// iOS-style blur effect
const glassEffect = {
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
};

// Custom IconWrapper with iOS-style design
const IconWrapper = styled('span')(({ color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 7,
  background: alpha(color, 0.1),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    color: `${color} !important`,
    fontSize: '1.1rem',
  },
  '&:hover': {
    background: alpha(color, 0.2),
    transform: 'scale(1.1)',
  },
}));

// iOS-style navigation configuration
const getNavigation = () => [
  {
    kind: 'header',
    title: 'Galigamuwa Meter Manufacturing',
    sx: {
      padding: '16px',
      marginBottom: '8px',
      color: '#5F5F7F',
      fontSize: '0.9rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      background: 'transparent',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
  },
  {
    
    title: 'Dashboard',
    icon: <IconWrapper color="#6366F1"><DashboardIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderLeft: '0px solid #6366F1',
        '& .MuiListItemIcon-root': { color: '#6366F1 !important' },
      },
    },
  },
  {
    segment: 'productionSummary',
    title: 'Production Summary',
    icon: <IconWrapper color="#10B981"><EventNoteIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderLeft: '0px solid #10B981',
        '& .MuiListItemIcon-root': { color: '#10B981 !important' },
      },
    },
  },
  {
    segment: 'assemblysummary',
    title: 'Assembly Line Summary',
    icon: <IconWrapper color="#F59E0B"><BuildIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderLeft: '0px solid #F59E0B',
        '& .MuiListItemIcon-root': { color: '#F59E0B !important' },
      },
    },
  },
  {
    segment: 'defective',
    title: 'Defectives Crushing Summary',
    icon: <IconWrapper color="#EF4444"><WarningIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderLeft: '0px solid #EF4444',
        '& .MuiListItemIcon-root': { color: '#EF4444 !important' },
      },
    },
  },
  {
    segment: 'dispatchsummary',
    title: 'Dispatch Summary',
    icon: <IconWrapper color="#3B82F6"><LocalShippingIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        borderLeft: '0px solid #3B82F6',
        '& .MuiListItemIcon-root': { color: '#3B82F6 !important' },
      },
    },
  },
  {
    segment: 'delivernote',
    title: 'Delivery Note',
    icon: <IconWrapper color="#8B5CF6"><DescriptionIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(139, 92, 246, 0.12)',
        borderLeft: '0px solid #8B5CF6',
        '& .MuiListItemIcon-root': { color: '#8B5CF6 !important' },
      },
    },
  },
  {
    segment: 'calendar',
    title: 'Calendar',
    icon: <IconWrapper color="#64748B"><CalendarTodayIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(100, 116, 139, 0.12)',
        borderLeft: '0px solid #64748B',
        '& .MuiListItemIcon-root': { color: '#64748B !important' },
      },
    },
  },
  {
    segment: 'profile',
    title: 'Employees',
    icon: <IconWrapper color="#F59E0B"><PeopleIcon /></IconWrapper>,
    sx: {
      margin: '4px 8px',
      borderRadius: '12px',
      '&.Mui-selected': {
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderLeft: '0px solid #F59E0B',
        '& .MuiListItemIcon-root': { color: '#F59E0B !important' },
      },
    },
  },
];

// iOS-inspired theme
const demoTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F5F7FA',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    primary: { main: '#6366F1' },
    secondary: { main: '#8B5CF6' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, letterSpacing: '-0.5px' },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...glassEffect,
          background: gradientBackgrounds.header,
          color: '#1E293B',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          background: gradientBackgrounds.sidebar,
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          width: 260,
          overflow: 'hidden',
          '&.MuiDrawer-docked': {
            width: '72px',
          },
          '&::-webkit-scrollbar': {
            width: '0px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassEffect,
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '18px',
          transition: 'all 0.4s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          padding: '10px 14px',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.12) !important',
            '& .MuiListItemIcon-root': { color: '#6366F1' },
          },
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.06)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#1E293B',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 12,
          padding: '10px 20px',
          overflow: 'hidden',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          '& .MuiBreadcrumbs-separator': { color: 'text.secondary' },
          padding: '12px 0',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
          paddingLeft: '16px !important',
          paddingRight: '16px !important',
          margin: '0 auto',
          '@media (min-width: 600px)': {
            paddingLeft: '24px !important',
            paddingRight: '24px !important',
          },
        },
      },
    },
  },
});

// Styled DashboardLayout to handle minimized sidebar
const CustomDashboardLayout = styled(DashboardLayout)(({ theme }) => ({
  '& .MuiDrawer-docked + .MuiContainer-root': {
    marginLeft: '72px',
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  '& .MuiDrawer-docked.MuiDrawer-open + .MuiContainer-root': {
    marginLeft: '260px',
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  '& .MuiContainer-root': {
    width: 'calc(100% - 16px) !important',
    maxWidth: 'none !important',
    padding: '8px !important',
    '@media (min-width: 600px)': {
      padding: '16px !important',
    },
  },
  '& .MuiDrawer-docked:not(.MuiDrawer-open)': {
    '& .MuiListItemText-root': {
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
    '& .MuiListItemIcon-root': {
      marginRight: 0,
      justifyContent: 'center',
    },
    '& .MuiListItem-root': {
      justifyContent: 'center',
      padding: '14px 16px',
      margin: '4px 12px',
    },
    '& .MuiListItemButton-root': {
      justifyContent: 'center',
    },
  },
}));

// Apple-style header component
const AppleHeader = styled('div')({
  ...glassEffect,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 24px',
  borderRadius: '14px',
  marginBottom: '24px',
});

// Metric Card Component
const MetricCard = ({ title, value, change, icon, color }) => (
  <Card sx={{
    height: '100%',
    background: gradientBackgrounds[color] || gradientBackgrounds.primary,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      right: '-50%',
      width: '100%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
      transform: 'rotate(30deg)',
    },
  }}>
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
          {title}
        </Typography>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          p: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
      <Chip
        label={change}
        size="small"
        sx={{
          background: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontWeight: 500,
          fontSize: '0.75rem',
        }}
      />
    </CardContent>
  </Card>
);

// Chart Component
function EfficiencyChart() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await axios.get(`${API_BASE_URL}/assemblyLine/assembled/total`, {
          signal: controller.signal,
        });
        const data = response.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(),
          cebQuantity: item.cebQuantity,
          leco1Quantity: item.leco1Quantity,
          leco2Quantity: item.leco2Quantity,
        }));
        setChartData(data);
        setErrorMessage('');
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching total assembled products:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch chart data. Please check the server connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  if (errorMessage) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'error.main',
          textAlign: 'center',
          p: 2,
          background: alpha('#ff0000', 0.1),
          borderRadius: '14px',
        }}
      >
        {errorMessage}
      </Typography>
    );
  }

  if (loading) {
    return <Typography>Loading chart data...</Typography>;
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Total Assembled Products by Date
      </Typography>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip
              contentStyle={{
                ...glassEffect,
                borderRadius: '12px',
                border: 'none',
              }}
            />
            <Legend />
            <Bar dataKey="cebQuantity" fill="#6366F1" name="CEB Quantity" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leco1Quantity" fill="#10B981" name="LECO1 Quantity" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leco2Quantity" fill="#F59E0B" name="LECO2 Quantity" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function useDemoRouter(initialPath, navigate) {
  const [pathname, setPathname] = React.useState(initialPath || '/dashboard');

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        const fullPath = path.startsWith('/') ? path : `/${path}`;
        setPathname(fullPath);
        navigate(fullPath);
      },
    }),
    [pathname, navigate],
  );

  return router;
}

// Modern Breadcrumbs Component
function DynamicBreadcrumbs({ pathname, navigation, router }) {
  const segments = pathname.split('/').filter((segment) => segment);
  const navItems = navigation.filter((item) => item.segment);

  const breadcrumbs = segments.map((segment, index) => {
    const navItem = navItems.find((item) => item.segment === segment);
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;

    return isLast ? (
      <Typography key={segment} sx={{ color: 'text.primary', fontWeight: 600 }}>
        {navItem?.title || segment}
      </Typography>
    ) : (
      <Link
        key={segment}
        underline="hover"
        color="inherit"
        href={path}
        onClick={(e) => {
          e.preventDefault();
          router.navigate(path);
        }}
        sx={{ '&:hover': { color: 'primary.main' } }}
        aria-label={`Navigate to ${navItem?.title || segment}`}
      >
        {navItem?.title || segment}
      </Link>
      
    );
  });

}

// Loading component with animation
function LoadingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: gradientBackgrounds.secondary,
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          animation: `${floatAnimation} 2s ease-in-out infinite`,
        }}
      >
        <svg width={40} height={40} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
              <stop stopColor="#6366F1" stopOpacity="0" offset="0%" />
              <stop stopColor="#6366F1" stopOpacity=".631" offset="63.146%" />
              <stop stopColor="#6366F1" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)">
              <path
                d="M36 18c0-9.94-8.06-18-18-18"
                id="Oval-2"
                stroke="url(#a)"
                strokeWidth="2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </path>
              <circle fill="#6366F1" cx="36" cy="18" r="1">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [stockData, setStockData] = React.useState({
    cebProducts: 0,
    leco1Products: 0,
    leco2Products: 0,
  });
  const router = useDemoRouter(props.initialPath || '/dashboard', navigate);
  const demoWindow = window ? window() : undefined;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assemblyLine/assembled/total`, {
          signal: controller.signal,
        });
        const latestData = response.data[response.data.length - 1] || {};
        setStockData({
          cebProducts: latestData.cebQuantity || 0,
          leco1Products: latestData.leco1Quantity || 0,
          leco2Products: latestData.leco2Quantity || 0,
        });
        setErrorMessage('');
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching stock data:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch stock data. Please check the server connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();

    return () => controller.abort();
  }, []);

  const NAVIGATION = getNavigation();

  const renderContent = () => {
    const normalizedPath = router.pathname.replace(/\/$/, '');
    if (normalizedPath === '/dashboard') {
      return (
        <div className="dashboard" role="region" aria-label="Dashboard Content">
          {errorMessage && (
            <Typography
              variant="body2"
              sx={{
                color: 'error.main',
                textAlign: 'center',
                p: 2,
                background: alpha('#ff0000', 0.1),
                borderRadius: '14px',
                mb: 2,
              }}
            >
              {errorMessage}
            </Typography>
          )}
          
          
          
          {/* Metrics Cards for Assembled Products */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="CEB Products"
                value={stockData.cebProducts}
                change="Updated 1 hr ago"
                icon={<InventoryIcon sx={{ color: 'white' }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="LECO1 Products"
                value={stockData.leco1Products}
                change="Updated 1 hr ago"
                icon={<InventoryIcon sx={{ color: 'white' }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="LECO2 Products"
                value={stockData.leco2Products}
                change="Updated 1 hr ago"
                icon={<InventoryIcon sx={{ color: 'white' }} />}
                color="warning"
              />
            </Grid>
          </Grid>
          
          {/* Main Content */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <EfficiencyChart />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                <Divider sx={{ my: 2 }} />
                {[
                  { text: 'Production target achieved', time: '2 hours ago', status: 'success' },
                  { text: 'New defect reported on Line 2', time: '5 hours ago', status: 'error' },
                  { text: 'Maintenance scheduled for tomorrow', time: '1 day ago', status: 'warning' },
                  { text: 'New order received from ABC Corp', time: '2 days ago', status: 'info' },
                ].map((activity, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 2,
                      p: 1,
                      borderRadius: '8px',
                      background: i % 2 === 0 ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background:
                          activity.status === 'success' ? '#10B981' :
                          activity.status == 'error' ? '#EF4444' :
                          activity.status == 'warning' ? '#F59E0B' : '#3B82F6',
                        mt: 0.5,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Analytics />
            </Grid>
          </Grid>
        </div>
      );
    }
    return (
      props.children || (
        <div
          style={{
            ...glassEffect,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            borderRadius: '14px',
          }}
          aria-label="No content available"
        >
          <Typography variant="h6" color="text.secondary">
            No content available for this route
          </Typography>
        </div>
      )
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{ title: 'Galigamuwa Meter Manufacturing', logo: '' }}
    >
      <CustomDashboardLayout>
      {/* Header with search and user profile */}
          <AppleHeader>
            <Box display="flex" alignItems="center">
              <Box sx={{
                position: 'relative',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'linear-gradient(to bottom, #6366F1, #8B5CF6)',
                  borderRadius: '1px',
                },
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, pl: 2 }}>
                  Dashboard
                </Typography>
              </Box>
            </Box>
            
           
          </AppleHeader>
        <PageContainer
       
          
        >
          <DynamicBreadcrumbs pathname={router.pathname} navigation={NAVIGATION} router={router} />
          {renderContent()}
        </PageContainer>
      </CustomDashboardLayout>
    </AppProvider>
  );
}
