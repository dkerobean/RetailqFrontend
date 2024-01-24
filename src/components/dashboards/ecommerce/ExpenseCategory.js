import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Grid, MenuItem, Select } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Chart from 'react-apexcharts';

const ExpenseDashboard = () => {
  const [expenseData, setExpenseData] = useState({});
  const [viewType, setViewType] = useState('this_month');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${backendUrl}dashboard/expense/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Full data:', data);
          setExpenseData(data);
        } else {
          console.error('Failed to fetch expense data');
        }
      } catch (error) {
        console.error('Error fetching expense data', error);
      }
    };

    fetchData();
  }, []);
  // Chart color
  const theme = useTheme();
  const categoryColors = theme.palette.expenseColors || []; // Ensure categoryColors is an array

  // Prepare data for the pie chart
  const seriesData = expenseData[viewType]?.map((category) => category.total_amount || 0) || [];
  const categories = expenseData[viewType]?.map((category) => category.category__name) || [];

  // Options for the pie chart
  const optionsPieChart = {
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        customScale: 1.1,
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        radius: 12,
        width: 16,
        height: 16,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
      labels: {
        colors: theme.palette.text.primary,
        useSeriesColors: true, // Set to true to use the same colors as the series
      },
        formatter: function (seriesName, opts) {
    // Use the category names as legend names
    return categories[opts.seriesIndex];
  },
    },
  };

  return (
    <PageContainer title="Expense Dashboard" description="This is the expense dashboard page">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          <ParentCard title={<Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h5">Expenses</Typography>
            <Select value={viewType} onChange={(e) => setViewType(e.target.value)} variant="outlined">
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="last_month">Last Month</MenuItem>
              <MenuItem value="this_year">This Year</MenuItem>
              <MenuItem value="this_quarter">This Quarter</MenuItem>
            </Select>
          </Stack>}>
            {seriesData.length > 0 ? (
              <>
                <Chart options={optionsPieChart} series={seriesData} type="pie" height={330} />
              </>
            ) : (
              <Typography variant="body2">No data available for the selected view type.</Typography>
            )}
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ExpenseDashboard;
