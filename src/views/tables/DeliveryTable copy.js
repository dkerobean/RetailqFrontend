import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TableHead,
  Avatar,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableFooter,
  IconButton,
  Paper,
  TableContainer,
  TextField,
  Button,
  Autocomplete,
  Stack,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import SearchIcon from '@mui/icons-material/Search';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import EditDelivery from 'src/components/material-ui/dialog/EditDelivery';
import DeleteDelivery from 'src/components/material-ui/dialog/DeleteDelivery';


import { format } from 'date-fns';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Deliveries',
  },
];

const TransactionTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deliveries, setDeliveries] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`${backendUrl}products/deliveries/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      setDeliveries(response.data);
      setTotalTransactions(response.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${backendUrl}/products/deliveries/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDeliveries(response.data);
        setTotalTransactions(response.data.length);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransactions();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event, value) => {
    setSearchTerm(value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const filteredDeliveries = deliveries
    .filter(
      (delivery) =>
        delivery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((delivery) => {
      if (!selectedDate) return true;

      const deliveryDate = new Date(delivery.created_at);
      return (
        deliveryDate >= selectedDate &&
        deliveryDate < new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

  return (
    <PageContainer title="Transactions" description="View and manage transactions">
      <Breadcrumb title="Transaction Table" items={BCrumb} />
      <ParentCard title="Transaction Table">
        <Paper variant="outlined">
          <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
            <Autocomplete
              options={['Location', 'Product']}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setSearchTerm(event.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              )}
              onInputChange={handleSearch}
            />
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              disableFuture
              shouldDisableDate={(date) => date.getDay() !== 0} // Disable Sundays
              renderDay={(day, _value, DayProps) => (
                <Box {...DayProps.sx} component="div">
                  {format(day, 'd')}
                </Box>
              )}
            />
          </Box>
          <TableContainer>
            <Table aria-label="Transaction table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Location</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Product</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Quantity</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Delivery Fee</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Contact Number</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Action</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Date</Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? deliveries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : deliveries
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                    <Typography variant="h6" fontWeight="600">
                        {row.location}
                    </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight="600">
                        {row.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.product.currency}{row.delivery_fee}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        455
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.contact_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                            row.status === 'Completed'
                                ? 'success'
                                : row.status === 'Pending'
                                    ? 'warning'
                                    : row.status === 'Cancelled'
                                        ? 'error'
                                        : 'error'
                        }
                        sx={{
                          borderRadius: '6px',
                        }}
                        size="small"
                        label={row.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <DeleteDelivery deliveryId={row.id} onDelete={fetchData}/>
                        <EditDelivery deliveryId={row.id} onEdit={fetchData} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {row.created_at && typeof row.created_at === 'string'
                              ? format(new Date(row.created_at), 'E, MMM d yyyy')
                              : 'Invalid Date'}
                    </TableCell>
                  </TableRow>
              ))}
                {Array.from({ length: rowsPerPage - deliveries.length }, (_, index) => (
                  <TableRow key={index} style={{ height: 53 }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={totalTransactions}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
};

export default TransactionTable;
