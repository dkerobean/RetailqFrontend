import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/profile/view/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setProfile(response.data);
      } catch (error) {
        navigate('/auth/login');
        console.error('Error fetching user profile:', error);
        console.log(localStorage.getItem('accessToken'));
      }
    };

    fetchUserProfile();
  }, []);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogout = async () => {
  try {
    const response = await axios.post(
      `${backendUrl}user/logout/`,
      { refresh_token: localStorage.getItem('refreshToken') }
    );

    console.log('Logout Response:', response.data);

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
    console.error('Error during logout:', error.response);
  }
};


  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu && profile ? (
        <>
          <Avatar alt="Remy Sharp" src={`${backendUrl}${profile.avatar}`} />

          <Box>
            <Typography variant="h6" color="textPrimary">
              {profile.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {profile.display_name}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
