import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';

const RevenueUpdates = () => {
  const [salesData, setSalesData] = useState(null);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${backendUrl}/dashboard/details/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSalesData(data);
        } else {
          console.error('Failed to fetch sales data');
        }
      } catch (error) {
        console.error('Error fetching sales data', error);
      }
    };

    fetchSalesData();
  }, []);

  const optionsColumnChart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 320,
      offsetX: -20,
      stacked: false,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: salesData?.top_selling_products?.map((product) => product.product__name) || [],
      axisTicks: {
        show: true,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: true,
    },
  };

  const seriesColumnChart = [
    {
      name: 'Income',
      data: salesData?.top_selling_products?.map((product) => product.total) || [],
    },
  ];

  return (
    <DashboardCard title="Product Sales" subtitle="Overview of cash">
      <>
        <Stack direction="row" spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}></Avatar>
            <Box>
              <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
                Income
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 9, height: 9, bgcolor: secondary, svg: { display: 'none' } }}></Avatar>
            <Box>
              <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
                Expense
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Chart options={optionsColumnChart} series={seriesColumnChart} type="bar" height="320px" />
      </>
    </DashboardCard>
  );
};

export default RevenueUpdates;
