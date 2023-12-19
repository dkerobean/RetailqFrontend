import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography,  Avatar, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';

const RevenueUpdates = () => {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 320,
      offsetX: -20,
      stacked: true,
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: true,
      }
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: true,
    },
  };
  const seriescolumnchart = [
    {
      name: 'Income',
      data: [212455.5, 3.7, 3.2, 2.6, 1.9,2.5, 3.7, 3.2, 2.6, 1.9, 5.0],
    },
    {
      name: 'Expense',
      data: [-245.8, -1.1, -3.0, -1.5, -1.9],
    },
  ];

  return (
    <DashboardCard
      title="Cash Flow"
      subtitle="Overview of cash">
      <>
        <Stack direction="row" spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
            ></Avatar>
            <Box>
              <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
                Income
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{ width: 9, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
            ></Avatar>
            <Box>
              <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
                Expense
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="320px" />
      </>
    </DashboardCard>
  );
};

export default RevenueUpdates;
