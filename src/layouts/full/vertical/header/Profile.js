import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import * as dropdownData from './data';

import { IconMail } from '@tabler/icons';
import { Stack } from '@mui/system';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import unlimitedImg from 'src/assets/images/backgrounds/unlimited-bg.png';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${backendUrl}user/profile/view/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                setProfile(response.data);

            } catch (error) {
                navigate('/landingpage');
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}user/logout/`,
          { refresh_token: localStorage.getItem('refreshToken') }
        );

        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redirect to login page
        toast.success("Loggedd out", {
          onClose: () => {
          },
        });

        const timer = setTimeout(() => {
          navigate('/auth/login');
        }, 100);

        return () => clearTimeout(timer);

      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    // check if user is logged in
    if (!profile) {
        navigate('/auth/login');
    }else{
      console.log(profile.avatar);


  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={`${backendUrl}${profile.avatar}`}
          alt={profile.name}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar src={`${backendUrl}${profile.avatar}`} alt={ProfileImg} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {profile.display_name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {profile.organization_id}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {/* <IconMail width={15} height={15} /> */}
                {profile.name}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            {dropdownData.profile.map((profile) => (
              <Box key={profile.title}>
                <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                  <Link to={profile.href}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        width="45px"
                        height="45px"
                        bgcolor="primary.light"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          src={profile.icon}
                          alt={profile.icon}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="textPrimary"
                          className="text-hover"
                          noWrap
                          sx={{
                            width: '240px',
                          }}
                        >
                          {profile.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            width: '240px',
                          }}
                          noWrap
                        >
                          {profile.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </Box>
            ))}
            <Box mt={2}>
              <Box bgcolor="primary.light" p={3} mb={3} overflow="hidden" position="relative">
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" mb={2}>
                      {profile.subscription.plan} <br />
                      Plan
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/pages/pricing')}
                    >
                      Upgrade
                    </Button>
                  </Box>
                  <img src={unlimitedImg} alt="unlimited" className="signup-bg"></img>
                </Box>
              </Box>
              <Button
                to="/auth/login"
                onClick={handleLogout}
                variant="outlined"
                color="primary"
                component={Link}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};
}

export default Profile;
