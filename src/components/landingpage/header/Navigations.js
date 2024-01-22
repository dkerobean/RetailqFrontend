import React, { useState } from 'react';
import { Box, Button, Divider, Grid, styled, Paper } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import AppLinks from 'src/layouts/full/vertical/header/AppLinks';
import QuickLinks from 'src/layouts/full/vertical/header/QuickLinks';
import DemosDD from './DemosDD';

const Navigations = () => {
  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: '16px',
    color: theme.palette.text.secondary,
  }));

  const isLoggedIn = localStorage.getItem('accessToken') !== null;

  // demos
  const [open, setOpen] = useState(false);

  const handleOpen = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // pages

  const [open2, setOpen2] = useState(false);

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <>
      {/* <StyledButton
        color="inherit"
        variant="text"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          color: open ? 'primary.main' : (theme) => theme.palette.text.secondary,
        }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        endIcon={<IconChevronDown size="15" style={{ marginLeft: '-5px', marginTop: '2px' }} />}
      >
        Demos
      </StyledButton> */}
      {open && (
        <Paper
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: '55px',
            maxWidth: '1200px',
            width: '100%',
          }}
          elevation={9}
        >
          <DemosDD />
        </Paper>
      )}
      <StyledButton
        color="inherit"
        variant="text"
        href="/auth/login"
      >
        Blog
      </StyledButton>
      <StyledButton
        color="inherit"
        variant="text"
        href="/auth/login"
      >
        Contact us
      </StyledButton>
      <StyledButton
        color="inherit"
        variant="text"
        href="/auth/login"
      >
        Documentation
      </StyledButton>

      {isLoggedIn ? (
        <Button color="primary" variant="contained" href="/dashboards/ecommerce">
          Dashboard
        </Button>
      ) : (
        <>
        <StyledButton color="inherit" variant="text" href="/auth/login">
          Sign in
        </StyledButton>
        <Button color="primary" target="_blank" variant="contained" href="/auth/register">
          Get Started
        </Button>
        </>
      )}
    </>
  );
};

export default Navigations;
