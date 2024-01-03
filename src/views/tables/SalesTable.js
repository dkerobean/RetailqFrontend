import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
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
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { Stack } from '@mui/system';
import FormDialog from 'src/components/material-ui/dialog/AddSale';
import EditSale from 'src/components/material-ui/dialog/EditSale';


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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Sales',
  },
];



const PaginationTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [salesData, setSalesData] = React.useState([]);
  const [totalSales, setTotalSales] = React.useState(0);

    const fetchData = async () => {
    try {
      // Retrieve access key from local storage
      const accessKey = localStorage.getItem('accessToken');

      const response = await axios.get('http://127.0.0.1:8000/sale/all/', {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      setSalesData(response.data);
      setTotalSales(response.data.length);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/sale/all/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalesData(response.data);
        setTotalSales(response.data.length);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer title="Sales" description="record a sale">
      <Breadcrumb title="Record Sales" items={BCrumb} />
      <Box sx={{ display: "flex-end", justifyContent: "space-between", alignItems: "center"}}>
        <FormDialog onAddSale={fetchData} />
      </Box>
      <ParentCard title="Sales Table">
        <Paper variant="outlined">
          <TableContainer>
            <Table
              aria-label="Record sales"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >

              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Product</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">User</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Quantity</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Date</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? salesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : salesData
                ).map((row) => (
                  <TableRow key={row.user.id}>
                    <TableCell>
                      <Typography variant="h6">{row.product_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={`http://127.0.0.1:8000${row.user_profile_image}`}
                          alt={'user_profile_image'}
                          width="30"
                        />
                        <Typography variant="h6" fontWeight="600">
                          {row.user_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.quantity_sold}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {row.currency}{row.total}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">{row.sale_date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          row.status === 'completed'
                            ? 'success'
                            : row.status === 'pending'
                            ? 'warning'
                            : row.status === 'canceled'
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
                        <EditSale  productId={row.id} onEditSale={fetchData} />
                    </TableCell>
                  </TableRow>
                ))}

                {Array.from({ length: rowsPerPage - salesData.length }, (_, index) => (
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
                    count={totalSales}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputprops: {
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

export default PaginationTable;
