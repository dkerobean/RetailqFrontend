import {useEffect, useState, React} from 'react';
import { Box, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';

import welcomeImg from 'src/assets/images/backgrounds/welcome-bg2.png';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const WelcomeCard = () => {

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('accessToken');

        console.log(accessToken);

        if (!userId || !accessToken) {
          console.error('User ID or access token not found in local storage');
          return;
        }

        const response = await axios.get(`${backendUrl}/user/profile/view/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setUserData(response.data);
      } catch (error){
        console.error('Error fetching sales data', error);

      }
    };

    fetchSalesData();
  }, []);

  return (
    <Card elevation={0} sx={{ backgroundColor: (theme) => theme.palette.primary.light, py: 0 }}>
      <CardContent sx={{ py: 2 }}>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item sm={6} display="flex" alignItems="center">
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                },
              }}
            >
              <Typography variant="h5">Welcome back {userData.display_name}!</Typography>
              <Typography variant="subtitle2" my={2} color="textSecondary">
                You have earned 54% more than last month which is great thing.
              </Typography>
              <Button variant="contained" color="primary">
                Check
              </Button>
            </Box>
          </Grid>
          <Grid item sm={5}>
            <Box mb="-90px">
              <img src={welcomeImg} alt={welcomeImg} width={'300px'} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
