import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import { MenuItem, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip, TableContainer, Stack, LinearProgress } from '@mui/material';
import axios from 'axios';

import img1 from 'src/assets/images/products/s6.jpg';
import img2 from 'src/assets/images/products/s9.jpg';
import img3 from 'src/assets/images/products/s7.jpg';
import img4 from 'src/assets/images/products/s4.jpg';


const ProductPerformances = () => {
  const [month, setMonth] = useState('1');
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const grey = theme.palette.grey[300];
  const primarylight = theme.palette.primary.light;
  const greylight = theme.palette.grey[100];

  const optionsrow1chart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [primarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };
  const seriesrow1chart = [
    {
      name: 'Customers',
      color: primary,
      data: [30, 25, 35, 20, 30],
    },
  ];

  const optionsrowChart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [primarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };

  const fetchProductData = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:8000/dashboard/details/products/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('API response:', response.data);
    setProductsData(response.data.top_selling_products);
    setLoading(false);
  } catch (error) {
    setError(error.message || 'An error occurred while fetching data');
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProductData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <DashboardCard
      title="Product Performance"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
        >
          <MenuItem value={1}>Jan 2023</MenuItem>
          <MenuItem value={2}>Dec 2022</MenuItem>
          <MenuItem value={3}>Nov 2022</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Product
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Units Sold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Product Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Sales Amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Growth
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>Error: {error}</TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              productsData.map((product, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ pl: 0 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.product__name}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                          {product.category}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {product.quantity_sold}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                            <Typography variant="h6">
                              {product.product__remaining_percentage >= 75
                                ? 'High'
                                : product.product__remaining_percentage >= 25
                                ? 'Moderate'
                                : 'Low'}
                            </Typography>
                            <LinearProgress
                              value={product.product__remaining_percentage}
                              variant="determinate"
                              color={
                                product.product__remaining_percentage >= 75
                                  ? 'success'
                                  : product.product__remaining_percentage >= 25
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                            <Typography color="textSecondary" variant="h6" fontWeight="400" whiteSpace="nowrap">
                              {product.product__remaining_percentage}% {' '}left
                            </Typography>
                          </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">${product.total}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chart
                      options={optionsrow1chart}
                      series={seriesrow1chart}
                      type="area"
                      height="35px"
                      width="100px"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default ProductPerformances;
