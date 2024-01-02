import {React, useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';
import axios from 'axios';

const SalesOverview = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const primarylight = theme.palette.primary.light;
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  const [salesData, setSalesData] = useState({
    income: 0,
    expense: 0
  });

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

        setSalesData(response.data);
      } catch (error){
        console.error('Error fetching sales data', error);

      }
    };

    fetchSalesData();
  }, []);

  console.log('Fetching', salesData.income);
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",

      toolbar: {
        show: true,
      },
      height: 275,
    },
    labels: ["Income", "Expense"],
    colors: [primary, error],
    plotOptions: {
      pie: {

        donut: {
          size: '90%',
          background: 'transparent',

          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 7,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: textColor,
              fontSize: '20px',
              fontWeight: '600',
              label:'Income & Expense',
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [parseInt(salesData.income), parseInt(salesData.expense)];

  return (
    <DashboardCard title="Sales Overview" subtitle="This month">
      <>
        <Box mt={3}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height="275px"
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={7}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              width={38}
              height={38}
              bgcolor="primary.main"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconGridDots width={22} />
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                ${salesData.income}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Income
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              width={38}
              height={38}
              bgcolor="error.main"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconGridDots width={22} />
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600">
                ${salesData.expense}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Expense
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SalesOverview;
