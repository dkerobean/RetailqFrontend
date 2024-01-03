import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowDownRight } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';
import icon1Img from 'src/assets/images/svgs/icon-office-bag-2.svg';
import axios from 'axios';

const SalesProfit = () => {
  const theme = useTheme();
  const errorlight = theme.palette.error.light;

const [productSales, setProductSales] = useState({});

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

        const response = await axios.get('http://localhost:8000/dashboard/details/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setProductSales(response.data);
      } catch (error){
        console.error('Error fetching sales data', error);

      }
    };

    fetchSalesData();
  }, []);

  const currency = productSales.currency;


  return (
    <DashboardCard>
      <>
        <Avatar
          variant="rounded"
          sx={{ bgcolor: (theme) => theme.palette.error.light, width: 40, height: 40 }}
        >
          <Avatar src={icon1Img} alt={icon1Img} sx={{ width: 24, height: 24 }} />
        </Avatar>
        <Typography variant="subtitle2" color="textSecondary" mt={3}>
          Products Sold
        </Typography>
        <Typography variant="h4">{currency}{productSales.products_sold}</Typography>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 20, height: 20 }}>
            <IconArrowDownRight width={16} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            -9%
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SalesProfit;
