import * as React from 'react';
import PropTypes from 'prop-types';
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
import EditTransaction from 'src/components/material-ui/dialog/EditTransaction';
import DeleteTransaction from 'src/components/material-ui/dialog/DeleteTranaction';
import AddTransaction from 'src/components/material-ui/dialog/AddTransaction';

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
    title: 'Transactions',
  },
];

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const TransactionTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [transactions, setTransactions] = React.useState([]);
  const [totalTransactions, setTotalTransactions] = React.useState(0);

  const fetchData = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`${backendUrl}sale/transactions/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      setTransactions(response.data);
      setTotalTransactions(response.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${backendUrl}sale/transactions/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(response.data);
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

  return (
    <PageContainer title="Transactions" description="View and manage transactions">
      <Breadcrumb title="Transaction Table" items={BCrumb} />
      <ParentCard title="Transaction Table">
        <Paper variant="outlined">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
          </Grid>
          <Grid item sx={{m:2}}>
              <AddTransaction onAdd={fetchData} />
          </Grid>
        </Grid>
          <TableContainer>
            <Table aria-label="Transaction table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Date</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">User</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Amount</Typography>
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
                  ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : transactions
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.created_at && typeof row.created_at === 'string'
                              ? format(new Date(row.created_at), 'E, MMM d yyyy')
                              : 'Invalid Date'}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={`${backendUrl}${row.user_profile_image}`}
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
                        {row.currency}{row.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          row.transaction_type === 'income'
                            ? 'success'
                            : row.transaction_type === 'expense'
                            ? 'error'
                            : 'error'
                        }
                        sx={{
                          borderRadius: '6px',
                        }}
                        size="small"
                        label={row.transaction_type}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <DeleteTransaction transactionId={row.id} onDelete={fetchData}/>
                        <EditTransaction transactionId={row.id} onEdit={fetchData} />
                      </Stack>
                    </TableCell>
                  </TableRow>
              ))}
                {Array.from({ length: rowsPerPage - transactions.length }, (_, index) => (
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
