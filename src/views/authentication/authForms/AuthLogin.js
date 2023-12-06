import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Divider, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();

  // define fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // validate form
  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
    };

    if (!email.trim()) {
      isValid = false;
      errors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      isValid = false;
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return isValid;
  };

  // snackbar variables
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = (message = 'failed') => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSuccess = (message = 'success') => {
    setSnackbarMessage(message);
    setOpenSnackbarSuccess(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // on submit function
  const handleLoginClick = async () => {
    if (validateForm()) {
      try {
        const apiUrl = 'http://127.0.0.1:8000/user/api/token/';
        const data = {
          email: email,
          password: password,
        };
        const response = await axios.post(apiUrl, data);
        console.log(data);

        if (response.status === 200) {
          handleSuccess('Login success');
          const token = response.data.access;
          const refreshToken = response.data.refresh;
          const user_id = response.data.user_id;
          
          localStorage.setItem('accessToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user_id', user_id);

          console.log('Login successful:', response.data);
          navigate('/dashboards/modern');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        handleClick("Login failed; username or password doesnt match");
      }
    } else {
      console.log('Form validation failed. Please fill in all the required fields.');
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Sign in with" />
      <div className="error-alert-wrapper">
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
      <div className="error-alert-wrapper">
        <Snackbar open={openSnackbarSuccess} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box>

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Remember this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          onClick={handleLoginClick}
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
