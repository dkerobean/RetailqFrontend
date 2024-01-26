import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  LinearProgress,
  Stack,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import axios from 'axios';
import { IconFilter, IconSearch, IconTrash } from '@tabler/icons';
import ChildCard from 'src/components/shared/ChildCard';
import DeleteProduct from 'src/components/material-ui/dialog/DeleteProduct';
import EditProduct from 'src/components/material-ui/dialog/EditProduct';
import FormDialog from 'src/components/material-ui/dialog/AddProduct';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Products',
  },
  {
    id: 'SKU',
    numeric: false,
    disablePadding: false,
    label: 'SKU',
  },
  {
    id: 'pname',
    numeric: false,
    disablePadding: false,
    label: 'Date Created',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { handleSearch, search, fetchData } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Box sx={{ flex: '1 1 100%' }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
          placeholder="Search Product"
          size="small"
          onChange={handleSearch}
          value={search}
        />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <ChildCard>
          <FormDialog onAddProduct={fetchData} />
        </ChildCard>
      </Box>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};

const ProductTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Define fetchData function
  const fetchData = async () => {
    try {
      // Retrieve access key from local storage
      const accessKey = localStorage.getItem('accessToken');

      const response = await axios.get(`${backendUrl}products/list/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      setRows(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredRows = rows.filter((row) => {
      return row.name.toLowerCase().includes(searchTerm);
    });

    if (searchTerm === '') {
      // If the search term is empty, fetch all data again
      fetchData();
    } else {
      setRows(filteredRows);
    }
  };

  // This is for the sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for the single row select
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => false; // Since there is no selection now

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box>
      <EnhancedTableToolbar
        search={search}
        handleSearch={(event) => handleSearch(event)}
        fetchData={fetchData}
      />
      <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              ml: 2,
                            }}
                          >
                            <Typography variant="h6" fontWeight="600">
                              {row.name}
                            </Typography>
                            <Typography color="textSecondary" variant="subtitle2">
                              {row.product_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              ml: 2,
                            }}
                          >
                            <Typography variant="h6" fontWeight="600">
                              {row.initial_quantity - row.total_quantity_sold}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {row.created_at && typeof row.created_at === 'string'
                            ? format(new Date(row.created_at), 'E, MMM d yyyy')
                            : 'Invalid Date'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          <Typography variant="h6">
                            {row.remaining_percentage >= 75
                              ? 'High'
                              : row.remaining_percentage >= 25
                              ? 'Moderate'
                              : 'Low'}
                          </Typography>
                          <LinearProgress
                            value={row.remaining_percentage}
                            variant="determinate"
                            color={
                              row.remaining_percentage >= 75
                                ? 'success'
                                : row.remaining_percentage >= 25
                                ? 'warning'
                                : 'error'
                            }
                          />
                          <Typography color="textSecondary" variant="h6" fontWeight="400" whiteSpace="nowrap">
                            {row.remaining_percentage}% {' '}left
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="500" variant="h6">
                          {row.currency}{row.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <DeleteProduct productId={row.id} onDelete={() => fetchData()} />
                          <React.Fragment>
                            <EditProduct productId={row.id} onEdit={() => fetchData()} />
                          </React.Fragment>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box ml={2}>
        {/* The dense switch is removed as well */}
      </Box>
    </Box>
  );
};

export default ProductTableList;
