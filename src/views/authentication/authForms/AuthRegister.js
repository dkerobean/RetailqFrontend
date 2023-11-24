import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, Autocomplete, TextField, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';



const countries = [
  { code: 'GH', label: 'Ghana' },
  { code: 'NG', label: 'Nigeria' }
];

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formErrors, setFormErrors] = useState({
    organizationName: '',
    email: '',
    password: '',
    selectedCountry: ''
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const errors = {
      organizationName: '',
      email: '',
      password: '',
      selectedCountry: ''
    };

    if (!organizationName.trim()) {
      isValid = false;
      errors.organizationName = 'Organization Name is required';
    }

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

    if (!selectedCountry) {
      isValid = false;
      errors.selectedCountry = 'Please choose a country';
    }

    setFormErrors(errors);
    return isValid;
  };

  // snackbar variables
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = (message= 'failed') => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSuccess = (message= 'success') => {
    setSnackbarMessage(message);
    setOpenSnackbarSuccess(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };



  const handleSignUpClick = async () => {
    if (validateForm()) {
      try {
        const apiUrl = 'http://127.0.0.1:8000/user/register/';
        const data = {
          organization_name: organizationName,
          email: email,
          password: password,
          country: selectedCountry.label
        }
        const response = await axios.post(apiUrl, data);
        console.log(data);

        if (response.status === 201) {
          handleSuccess("Registration sucessfull");
        }

      } catch (error) {
        console.log(organizationName, email, password, selectedCountry.label);
        console.error('Error signing up:', error.response.data.email);
        handleClick(error.response.data.email);
      }
    } else {
      console.log('Form validation failed. Please fill in all the required fields.');
    }
  };

  // UseEffect to handle redirection after the Snackbar is closed
useEffect(() => {
  if (openSnackbarSuccess) {
    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 1000); 
    return () => clearTimeout(timer);
  }
}, [openSnackbarSuccess, navigate]);

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <AuthSocialButtons title="Sign up with" />
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
            or sign up with
          </Typography>
        </Divider>
      </Box>

      <Box>
        <Stack mb={3}>
          <Autocomplete
            sx={{ mt: 4 }}
            variant="outlined"
            fullWidth
            id="country"
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            onChange={(event, value) => setSelectedCountry(value)}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                error={!!formErrors.selectedCountry}
              helperText={formErrors.selectedCountry}
              />
            )}
          />
          <CustomFormLabel htmlFor="name">Organization Name</CustomFormLabel>
          <CustomTextField
            id="organization_name"
            variant="outlined"
            fullWidth
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            error={!!formErrors.organizationName}
            helperText={formErrors.organizationName}
          />
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
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          // component={Link}
          // to="/auth/login"
          onClick={handleSignUpClick}
        >
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
