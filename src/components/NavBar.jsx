import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(
    135deg,
    rgba(114, 133, 220, 0.9) 0%,
    rgba(25, 52, 124, 0.85) 100%
  )`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  borderRadius: '0 0 16px 16px',
  color: theme.palette.common.white,
}));

const LiquidBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(
    45deg,
    rgba(30, 39, 64, 0.7) 0%,
    rgba(45, 55, 72, 0.7) 50%,
    rgba(60, 70, 90, 0.7) 100%
  )`,
  zIndex: -1,
  borderRadius: 'inherit',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    right: '-50%',
    bottom: '-50%',
    background: `linear-gradient(
      45deg,
      rgba(30, 39, 64, 0.9) 0%,
      rgba(45, 55, 72, 0.9) 50%,
      rgba(60, 70, 90, 0.9) 100%
    )`,
    animation: 'liquidMove 15s infinite alternate',
    zIndex: -1,
    borderRadius: 'inherit',
  },
  '@keyframes liquidMove': {
    '0%': {
      transform: 'translate(-30%, -30%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(30%, 30%) rotate(360deg)',
    },
  },
});

const ModernSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  backdropFilter: 'blur(5px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid rgba(255, 255, 255, 0.08)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[300],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.grey[200],
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  color: theme.palette.grey[200],
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: theme.palette.grey[300],
    transform: 'scaleX(0)',
    transformOrigin: 'right',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'left',
  },
}));

const FloatingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${alpha(theme.palette.grey[900], 0.8)}`,
  },
}));

export default function DashboardNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  React.useEffect(() => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        setErrorMessage('');
      } else {
        setUserData(null);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Failed to access session storage:', error);
      setErrorMessage('Unable to access user data. Please try again or contact support.');
      setUserData(null);
    }
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    try {
      sessionStorage.clear();
      setUserData(null);
      setErrorMessage('');
      handleMenuClose();
    } catch (error) {
      console.error('Failed to clear session storage:', error);
      setErrorMessage('Failed to sign out. Please try again.');
    }
  };

  const handleReportsClick = () => {
    navigate('/rawmaterial');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          background: 'rgba(30, 39, 64, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          minWidth: 200,
          color: '#e2e8f0',
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            background: 'rgba(30, 39, 64, 0.95)',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Avatar src={userData?.avatar} /> Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Avatar src={userData?.avatar} /> My account
      </MenuItem>
      {userData ? (
        <MenuItem onClick={handleLogout}>
          <Avatar /> Sign Out
        </MenuItem>
      ) : (
        <MenuItem onClick={handleMenuClose}>
          <Avatar /> Login
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background: 'rgba(30, 39, 64, 0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          color: '#e2e8f0',
        },
      }}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <FloatingBadge badgeContent={4} color="error">
            <MailIcon sx={{ color: '#e2e8f0' }} />
          </FloatingBadge>
        </IconButton>
        <Typography>Messages</Typography>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <FloatingBadge badgeContent={17} color="error">
            <NotificationsIcon sx={{ color: '#e2e8f0' }} />
          </FloatingBadge>
        </IconButton>
        <Typography>Notifications</Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar src={userData?.avatar} sx={{ width: 32, height: 32 }} />
        </IconButton>
        <Typography>Profile</Typography>
      </MenuItem>
      {userData && (
        <MenuItem onClick={handleLogout}>
          <Typography>Sign Out</Typography>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {errorMessage && (
        <Typography
          variant="body2"
          sx={{
            color: 'error.main',
            textAlign: 'center',
            p: 1,
            background: alpha('#ff0000', 0.1),
            borderRadius: '8px',
            m: 1,
          }}
        >
          {errorMessage}
        </Typography>
      )}
      <GlassAppBar position="static">
        <LiquidBackground />
        <Toolbar sx={{ minHeight: '80px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 800,
                letterSpacing: '1px',
                mr: 4,
                background: 'linear-gradient(90deg, #6495ed, #a7c7ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 8px rgba(100, 149, 237, 0.4)',
              }}
            >
              MEMP
            </Typography>
          </motion.div>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <NavButton color="inherit">Overview</NavButton>
            <NavButton color="inherit">Analytics</NavButton>
            <NavButton color="inherit" onClick={handleReportsClick}>Reports</NavButton>
            <NavButton color="inherit">Settings</NavButton>
          </Box>

          <ModernSearch>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </ModernSearch>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FloatingBadge badgeContent={4} color="error">
                <MailIcon />
              </FloatingBadge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FloatingBadge badgeContent={17} color="error">
                <NotificationsIcon />
              </FloatingBadge>
            </IconButton>

            {userData ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileMenuOpen}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Avatar
                  alt={userData.name || userData.email}
                  src={userData.avatar}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 1,
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    mr: 2,
                    color: '#e2e8f0',
                    fontWeight: 500,
                    display: { xs: 'none', lg: 'block' },
                  }}
                >
                  {userData.name || userData.email?.split('@')[0] || 'User'}
                </Typography>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '50px',
                    px: 3,
                    borderWidth: '2px',
                    borderColor: '#e2e8f0',
                    color: '#e2e8f0',
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: alpha('#fff', 0.1),
                    },
                  }}
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.1),
                },
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </GlassAppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
