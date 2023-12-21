import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Grid, MenuItem, Select, Chip } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Chart from 'react-apexcharts';

const ExpenseDashboard = () => {
  const [expenseData, setExpenseData] = useState({});
  const [viewType, setViewType] = useState('this_month'); // Default view type is this month

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/dashboard/expense/', {
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
        customScale: 0.8, // Adjust the size of the pie chart
        donut: {
          size: '70px',
        },
      },
    },
    // legend: {
    //   show: true,
    //   position: 'bottom',
    //   width: '50px',
    //   formatter: function (seriesName, opts) {
    //     const index = opts.seriesIndex;
    //     const categoryName = expenseData[viewType][index]?.category__name || '';
    //     return `<div class="legend-item"><span class="legend-color" style="background-color:${categoryColors[index % categoryColors.length]}"></span>${categoryName}</div>`;
    //   },
    // },
    // colors: categoryColors,
    // tooltip: {
    //   fillSeriesColor: true,
    // },
  };


  // Prepare data for the pie chart
  const seriesData = expenseData[viewType]?.map((category) => category.total_amount || 0) || [];
  const categories = expenseData[viewType]?.map((category) => category.category__name) || [];

  return (
    <PageContainer title="Expense Dashboard" description="This is the expense dashboard page">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h5">Expenses</Typography>
            <Select value={viewType} onChange={(e) => setViewType(e.target.value)} variant="outlined">
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="last_month">Last Month</MenuItem>
              <MenuItem value="this_year">This Year</MenuItem>
              <MenuItem value="this_quarter">This Quarter</MenuItem>
            </Select>
          </Stack>
          <ParentCard title={`Expense Distribution - ${viewType.charAt(0).toUpperCase() + viewType.slice(1)}`}>
            {seriesData.length > 0 ? (
              <>
                <Chart options={optionsPieChart} series={seriesData} type="pie" height={300} />
                {categories.length > 0 && (
                  <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                    {categories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        style={{ backgroundColor: categoryColors[index % categoryColors.length], color: 'white' }}
                      />
                    ))}
                  </Stack>
                )}
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