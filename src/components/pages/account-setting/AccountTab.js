import React, { useEffect, useState } from 'react';
import { CardContent, Grid, Typography, MenuItem, Box, Avatar, Button, Stack, Snackbar, Autocomplete, TextField } from '@mui/material';
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


const locations = [
  {
    value: 'gh',
    label: 'Ghana',
  },
  {
    value: 'ng',
    label: 'Nigeria',
  }
];

const currencies = [
  {
    value: 'Retaile',
    label: 'Retaile',
  },
  {
    value: 'Manufacturing',
    label: 'Manufacturing',
  },
  {
    value: 'Food and Beverage',
    label: 'Food and Beverage',
  },
  {
    value: 'Automotive',
    label: 'Automotive',
  },
  {
    value: 'Healthcare',
    label: 'Healthcare',
  },
  {
    value: 'Construction and Home Improvement',
    label: 'Construction and Home Improvement',
  },
  {
    value: 'Services',
    label: 'Services',
  },
  {
    value: 'Entertainment and Leisure',
    label: 'Entertainment and Leisure',
  },
  {
    value: 'Transportation and Logistics',
    label: 'Transportation and Logistics',
  }
];


const AccountTab = () => {

  // snackbar variables
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // snackbar for sucess and error messages
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

  const navigate = useNavigate();

// UseEffect to handle redirection after the Snackbar is closed
useEffect(() => {
  if (openSnackbarSuccess) {
    const timer = setTimeout(() => {
      navigate('/dashboards/modern');
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [openSnackbarSuccess, navigate]);

  const [location, setLocation] = useState('gh'); // Set default location
  const [currency, setCurrency] = useState('services'); // Set default currency
  const [profileData, setProfileData] = useState({
    name: '',
    display_name: '',
    location: '',
    phone: '',
    address: '',
    avatar: '',
    business_type: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/user/profile/view/', {headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}}) // Corrected the API URL
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user profile data:', error);
        handleClick(error);
      });
  }, []);

  const handleChange1 = (event) => {
    setLocation(event.target.value);
  };

  const handleChange2 = (event) => {
    setCurrency(event.target.value);
  };

  const handleSave = () => {

    const formData = new FormData();

    // Check if a new avatar file is selected
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const updatedData = {
      name: profileData.name,
      display_name: profileData.display_name,
      location: profileData.location,
      mobile_number: profileData.mobile_number,
      address: profileData.address,
      business_type: profileData.business_type.value,
    };

    axios.put('http://127.0.0.1:8000/user/profile/view/', updatedData, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      'Content-Type': 'multipart/form-data',
    },
  })
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        console.log(updatedData);
        handleSuccess('Profile updated successfully')
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        console.log(updatedData);
      });
  };

  return (
    <Grid container spacing={3}>
      {/* Change Profile */}
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
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Profile
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Change your profile picture from here
            </Typography>
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <Avatar
                  src={`http://127.0.0.1:8000${profileData.avatar}`} // Use avatar from the API response
                  alt={profileData.avatar}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
                <Stack direction="row" justifyContent="center" spacing={2} my={3}>
                  <Button variant="contained" color="primary" component="label">
                    Upload
                    <input
                    hidden
                    accept="image/*"
                    multiple type="file"
                    id="avatar"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    />
                  </Button>
                  <Button variant="outlined" color="error">
                    Reset
                  </Button>
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" mb={4}>
                  Allowed JPG, GIF, or PNG. Max size of 800K
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>
      {/*  Change Password */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Password
            </Typography>
            <Typography color="textSecondary" mb={3}>
              To change your password please confirm here
            </Typography>
            <form>
              <CustomFormLabel
                sx={{
                  mt: 0,
                }}
                htmlFor="text-cpwd"
              >
                Current Password
              </CustomFormLabel>
              <CustomTextField
                id="text-cpwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 2 */}
              <CustomFormLabel htmlFor="text-npwd">New Password</CustomFormLabel>
              <CustomTextField
                id="text-npwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
              {/* 3 */}
              <CustomFormLabel htmlFor="text-conpwd">Confirm Password</CustomFormLabel>
              <CustomTextField
                id="text-conpwd"
                value="MathewAnderson"
                variant="outlined"
                fullWidth
                type="password"
              />
            </form>
          </CardContent>
        </BlankCard>
      </Grid>
      {/* Edit Details */}
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Personal Details
            </Typography>
            <Typography color="textSecondary" mb={3}>
              To change your personal detail, edit and save from here
            </Typography>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-name"
                  >
                    Your Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-name"
                    value={profileData.name}
                    variant="outlined"
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    name="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 2 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-store-name"
                  >
                    Store Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-store-name"
                    value={profileData.display_name}
                    variant="outlined"
                    onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                    name="display_name"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {/* 4 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-currency"
                  >
                    Business Type
                  </CustomFormLabel>
                  {/* <CustomSelect
                    fullWidth
                    id="business_type"
                    variant="outlined"
                    name="business_type"
                    value={currency}
                    onChange={handleChange2}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect> */}
                  <Autocomplete
                    disablePortal
                    id="business_type"
                    name="business_type"
                    options={currencies}
                    sx={{ width: 300 }}
                    value={profileData.business_type}
                    onChange={(event, newValue) => {
                      setProfileData({ ...profileData, business_type: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {/* 6 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-phone"
                  >
                    Phone
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    value={profileData.mobile_number}
                    variant="outlined"
                    onChange={(e) => setProfileData({ ...profileData, mobile_number: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* 7 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-address"
                  >
                    Address
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-address"
                    value={profileData.address}
                    variant="outlined"
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </BlankCard>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
          <Button size="large" variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button size="large" variant="text" color="error">
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
