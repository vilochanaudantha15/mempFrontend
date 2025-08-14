import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../../pages/Login/signinComponent/CustomIcons';
import axios from 'axios';

// Styled components
const Card = styled(MuiCard)({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: '32px',
  gap: '16px',
  margin: 'auto',
  boxShadow:
    '0px 5px 15px 0px rgba(15, 15, 20, 0.05), 0px 15px 35px -5px rgba(20, 20, 25, 0.05)',
  maxWidth: '450px',
});

const SignUpContainer = styled(Stack)({
  minHeight: '100vh',
  padding: '16px',
  position: 'relative',
  background: 'radial-gradient(ellipse at 50% 50%, #f0f8ff, #ffffff)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const API_BASE_URL = "/api"; // For office server with reverse proxy

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  const [serverError, setServerError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const validateInputs = (formData) => {
    let isValid = true;
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const mobile = formData.get('mobile');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (mobile && !/^\d{10,}$/.test(mobile.replace(/\D/g, ''))) {
      setMobileError(true);
      setMobileErrorMessage('Invalid mobile number (at least 10 digits required).');
      isValid = false;
    } else {
      setMobileError(false);
      setMobileErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setSuccessMessage('');
    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    if (!validateInputs(data)) {
      setIsLoading(false);
      return;
    }

    const userData = {
      name: data.get('name'),
      email: data.get('email'),
      mobile: data.get('mobile') || null,
      password: data.get('password'),
      userType: 'user', // Default as per controller
      isManager: 0, // Default as per controller
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/users/users`, userData);
      setSuccessMessage(response.data.message || 'Sign-up successful! Please sign in.');
      event.target.reset();
      setServerError('');
    } catch (error) {
      console.error('Sign-up error:', error);
      setServerError(
        error.response?.data?.error || 'Failed to sign up. Please check the server connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setServerError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      // Placeholder for social sign-up logic
      // In a real implementation, this would redirect to the provider's OAuth flow
      throw new Error(`Sign up with ${provider} is not implemented yet.`);
    } catch (error) {
      console.error(`Error with ${provider} sign-up:`, error);
      setServerError(error.message || `Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <SignUpContainer direction="column">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ textAlign: 'center' }}>
              {successMessage}
            </Alert>
          )}
          {serverError && (
            <Alert severity="error" sx={{ textAlign: 'center' }}>
              {serverError}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="mobile">Mobile Number (Optional)</FormLabel>
              <TextField
                fullWidth
                id="mobile"
                placeholder="1234567890"
                name="mobile"
                autoComplete="tel"
                variant="outlined"
                error={mobileError}
                helperText={mobileErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" disabled={isLoading} />}
              label="I want to receive updates via email."
            />
            <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: '#666' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialSignUp('Google')}
              startIcon={<GoogleIcon />}
              disabled={isLoading}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialSignUp('Facebook')}
              startIcon={<FacebookIcon />}
              disabled={isLoading}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/sign-in" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}