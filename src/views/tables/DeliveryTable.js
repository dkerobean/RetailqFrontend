import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
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
  Button,
  Grid,
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { Stack } from '@mui/system';
import EditDelivery from 'src/components/material-ui/dialog/EditDelivery';
import DeleteDelivery from 'src/components/material-ui/dialog/DeleteDelivery';
import AddDelivery from 'src/components/material-ui/dialog/AddDelivery';

function TablePaginationActions(props) {
  const theme = useTheme();
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
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
  const [totalDeliveries, setTotalDeliveries] = useState(0);

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
      setTotalDeliveries(response.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

return (
  <PageContainer title="Delivery" description="View and manage transactions">
    <Breadcrumb title="Delivery Table" items={BCrumb} />
    <ParentCard title="Delivery Table">
      <Paper variant="outlined">
      <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
          </Grid>
          <Grid item sx={{m:2}}>
              <AddDelivery onAdd={fetchData} />
          </Grid>
        </Grid>
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
                {/* Include the rest of your TableHead content here */}
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
              {Array.isArray(deliveries) && deliveries.length > 0 ? (
                (rowsPerPage > 0
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
                    {/* Continue with the rest of your TableCell elements */}
                    <TableCell>
                      <Typography variant="h6" fontWeight="600">
                        {row.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.product.currency}
                        {row.delivery_fee}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.total}
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
                        <DeleteDelivery deliveryId={row.id} onDelete={fetchData} />
                        <EditDelivery deliveryId={row.id} onEdit={fetchData} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {row.created_at && typeof row.created_at === 'string'
                        ? format(new Date(row.created_at), 'E, MMM d yyyy')
                        : 'Invalid Date'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No deliveries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={totalDeliveries}
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
