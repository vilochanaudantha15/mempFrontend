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
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_BASE_URL = "/api"; // For office server with reverse proxy

// Floating animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Modern gradient backgrounds
const gradientBackgrounds = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  warning: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  error: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
};

// Custom IconWrapper with square styling
const IconWrapper = styled('span')(({ color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  background: alpha(color, 0.1),
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    color: `${color} !important`,
    fontSize: '1.3rem',
  },
  '&:hover': {
    background: alpha(color, 0.2),
    transform: 'scale(1.05)',
  },
}));

// Navigation configuration
const getNavigation = (userType) => [
  {
    kind: 'header',
    title: 'Galigamuwa Meter Manufacturing',
    sx: {
      padding: '16px',
      marginBottom: '16px',
      color: '#fff',
      background: gradientBackgrounds.primary,
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <IconWrapper color="#6366F1"><DashboardIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderLeft: '4px solid #6366F1',
        '& .MuiListItemIcon-root': { color: '#6366F1 !important' },
      },
    },
  },
  {
    segment: 'productionSummary',
    title: 'Production Summary',
    icon: <IconWrapper color="#10B981"><EventNoteIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderLeft: '4px solid #10B981',
        '& .MuiListItemIcon-root': { color: '#10B981 !important' },
      },
    },
  },
  {
    segment: 'assemblysummary',
    title: 'Assembly Line',
    icon: <IconWrapper color="#F59E0B"><BuildIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderLeft: '4px solid #F59E0B',
        '& .MuiListItemIcon-root': { color: '#F59E0B !important' },
      },
    },
  },
  {
    segment: 'defective',
    title: 'Defectives Crushing Summary',
    icon: <IconWrapper color="#EF4444"><WarningIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderLeft: '4px solid #EF4444',
        '& .MuiListItemIcon-root': { color: '#EF4444 !important' },
      },
    },
  },
  {
    segment: 'dispatchsummary',
    title: 'Dispatch Summary',
    icon: <IconWrapper color="#3B82F6"><LocalShippingIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderLeft: '4px solid #3B82F6',
        '& .MuiListItemIcon-root': { color: '#3B82F6 !important' },
      },
    },
  },
  {
    segment: 'delivernote',
    title: 'Delivery Note',
    icon: <IconWrapper color="#8B5CF6"><DescriptionIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderLeft: '4px solid #8B5CF6',
        '& .MuiListItemIcon-root': { color: '#8B5CF6 !important' },
      },
    },
  },
  {
    segment: 'calendar',
    title: 'Calendar',
    icon: <IconWrapper color="#64748B"><CalendarTodayIcon /></IconWrapper>,
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        borderLeft: '4px solid #64748B',
        '& .MuiListItemIcon-root': { color: '#64748B !important' },
      },
    },
  },
  ...(userType === 'admin'
    ? [
        {
          segment: 'profile',
          title: 'Employees',
          icon: <IconWrapper color="#F59E0B"><PeopleIcon /></IconWrapper>,
          sx: {
            '&.Mui-selected': {
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderLeft: '4px solid #F59E0B',
              '& .MuiListItemIcon-root': { color: '#F59E0B !important' },
            },
          },
        },
      ]
    : []),
];

// Modern theme
const demoTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: gradientBackgrounds.secondary,
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
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, letterSpacing: '-0.5px' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95) !important',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          color: '#1E293B',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.95) !important',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          width: 240,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          margin: '0 8px',
          padding: '8px 12px',
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.08) !important',
            borderLeft: '4px solid #6366F1',
            '& .MuiListItemIcon-root': { color: '#6366F1' },
          },
          '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 'auto', marginRight: 16 } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { '& .MuiBreadcrumbs-separator': { color: 'text.secondary' } },
      },
    },
  },
});

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
          borderRadius: '8px',
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
    <div style={{ background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', borderRadius: '8px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Total Assembled Products by Date
      </Typography>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cebQuantity" fill="#6366F1" name="CEB Quantity" />
            <Bar dataKey="leco1Quantity" fill="#10B981" name="LECO1 Quantity" />
            <Bar dataKey="leco2Quantity" fill="#F59E0B" name="LECO2 Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
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

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ mb: 3, '& .MuiBreadcrumbs-separator': { color: 'text.secondary' } }}
    >
      <Link
        underline="hover"
        color="inherit"
        href="/dashboard"
        onClick={(e) => {
          e.preventDefault();
          router.navigate('/dashboard');
        }}
        sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: 'primary.main' } }}
        aria-label="Navigate to Home"
      >
        Home
      </Link>
      {breadcrumbs}
    </Breadcrumbs>
  );
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
          borderRadius: '8px',
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
  const [userType, setUserType] = React.useState('user');
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const router = useDemoRouter(props.initialPath || '/dashboard', navigate);
  const demoWindow = window ? window() : undefined;

  React.useEffect(() => {
    const controller = new AbortController();
    const fetchUserType = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
          const { email } = JSON.parse(storedUserData);
          const response = await axios.post(
            `${API_BASE_URL}/users/get-user-type`,
            { email },
            { signal: controller.signal }
          );
          setUserType(response.data.userType || 'user');
          setErrorMessage('');
        } else {
          setUserType('user');
          setErrorMessage('');
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching userType:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch user type. Please check the server connection.');
        setUserType('user');
      } finally {
        setIsLoading(false);
      }
    };
    try {
      fetchUserType();
    } catch (error) {
      console.error('Error accessing session storage:', error);
      setErrorMessage('Unable to access user data. Please try again or contact support.');
      setUserType('user');
      setIsLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  }, []);

  const NAVIGATION = getNavigation(userType);

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
                borderRadius: '8px',
                mb: 2,
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <EfficiencyChart />
            </Grid>
            <Grid item xs={12} md={4}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '24px',
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
                aria-label="Recent Activities"
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                {[
                  'Production target achieved',
                  'New defect reported on Line 2',
                  'Maintenance scheduled for tomorrow',
                  'New order received from ABC Corp',
                ].map((activity, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      padding: '8px',
                      borderRadius: '4px',
                      background: i % 2 === 0 ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: ['#6366F1', '#8B5CF6', '#A5B4FC'][i % 3],
                        marginRight: '12px',
                      }}
                    />
                    <Typography variant="body2">{activity}</Typography>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '8px',
                }}
                aria-label="Quick Stats"
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Quick Stats
                </Typography>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {['Production', 'Defects', 'Efficiency', 'Orders', 'Inventory'].map((stat, i) => (
                    <div
                      key={stat}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '120px',
                        animation: `${floatAnimation} ${3 + i}s ease-in-out infinite`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                        {stat}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {Math.floor(Math.random() * 100)}
                        {stat === 'Efficiency' || stat === 'Defects' ? '%' : ''}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
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
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            borderRadius: '8px',
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
      <DashboardLayout>
        <PageContainer
          title={router.pathname.split('/').pop() || 'Dashboard'}
          sx={{ background: 'transparent' }}
        >
          <DynamicBreadcrumbs pathname={router.pathname} navigation={NAVIGATION} router={router} />
          {renderContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}