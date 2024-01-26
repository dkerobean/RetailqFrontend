import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const ColumnChart = () => {
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${backendUrl}dashboard/income-expenses/?year=${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data);
        console.log("this is the data", response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;

  const optionscolumnchart = {
    chart: {
      id: 'column-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary, error],
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data ? data.map(entry => getMonthName(entry.month)) : [],
    },
    yaxis: {
      title: {

      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val}`;
        },
      },
      theme: 'dark',
    },
    grid: {
      show: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '150px',
    },
  };

  if (!data) {
    return <div>Loading...</div>; // You might want to add a loading state while data is being fetched
  }

  const seriescolumnchart = [
    {
      name: 'Income',
      data: data.map(entry => parseFloat(entry.income)),
    },
    {
      name: 'Expense',
      data: data.map(entry => parseFloat(entry.expense)),
    },
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <PageContainer title="Dashboard" description="Main Dashboard">
      <ParentCard title={
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Typography variant="h6">Cashflow</Typography>
          <Select
            label="Select Year"
            value={selectedYear}
            onChange={handleYearChange}
            variant="outlined"
            style={{ minWidth: '150px' }}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <MenuItem key={index} value={new Date().getFullYear() - index}>
                {new Date().getFullYear() - index}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      }>
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          height="300px"
        />
      </ParentCard>
    </PageContainer>
  );
};

// Helper function to get month name from month number
const getMonthName = (monthNumber) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthNumber - 1] || '';
};

export default ColumnChart;
