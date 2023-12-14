import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, Autocomplete, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';

const countries = [
  { code: 'GH', label: 'Ghana' },
  { code: 'NG', label: 'Nigeria' },
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
    selectedCountry: '',
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const errors = {
      organizationName: '',
      email: '',
      password: '',
      selectedCountry: '',
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

  const handleSuccess = (message = 'Success') => {
    toast.success(message, {
      onClose: () => {
      },
    });

    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleClick = (message = 'Failed') => {
    toast.error(message);
  };

  const handleSignUpClick = async () => {
    if (validateForm()) {
      try {
        const apiUrl = 'http://127.0.0.1:8000/user/register/';
        const data = {
          organization_name: organizationName,
          email: email,
          password: password,
          country: selectedCountry.label,
        };
        const response = await axios.post(apiUrl, data);

        if (response.status === 201) {
          handleSuccess('Registration successful, Login to continue');
        }
      } catch (error) {
        console.error('Error signing up:', error.response.data.email);
        handleClick("User With This Email Already Exist");
      }
    } else {
      console.log('Form validation failed. Please fill in all the required fields.');
    }
  };

//   useEffect(() => {
//   if (toast.isActive('success')) {
//     const timer = setTimeout(() => {
//       toast.dismiss(); // Dismiss the success toast
//       navigate('/auth/login');
//     }, 1000);
//     return () => clearTimeout(timer);
//   }
// }, [navigate]);


  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <AuthSocialButtons title="Sign up with" />

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
          onClick={handleSignUpClick}
        >
          Sign Up
        </Button>
      </Box>

      <ToastContainer />

      {subtitle}
    </>
  );
};

export default AuthRegister;
