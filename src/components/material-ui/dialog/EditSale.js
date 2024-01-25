import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Tooltip,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconEdit } from '@tabler/icons';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditDialog = ({ saleId, onEditSale }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity_sold: 1,
    sale_date: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
    product_id: '',
    status: '',
  });
  const [products, setProducts] = useState([]);

  const setSaleData = (data) => {
    setFormData({
      quantity_sold: data.quantity_sold,
      sale_date: data.sale_date,
      user: data.user,
      product_id: data.product.id,
      status: data.status,
      product_name: data.product.name
    });
  };

  useEffect(() => {
    // Fetch the sale data when the component mounts
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`${backendUrl}sale/${saleId}/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });

      setProducts(response.data.products || []);

      // Check if response.data is an object before setting the state
      if (response.data && typeof response.data === 'object') {
        setSaleData(response.data);
      } else {
        console.error('Invalid data format for sale:', response.data);
      }
    } catch (error) {
      console.error('Error fetching sale:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.id === 'quantity_sold'
          ? parseInt(e.target.value, 10)
          : e.target.value,
    });
  };

  const handleProductChange = (event) => {
    setFormData({
      ...formData,
      product_id: event.target.value,
    });
  };

  const handleStatusChange = (event) => {
    setFormData({
      ...formData,
      status: event.target.value,
    });
  };

  const handleEditSale = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      await axios.put(`${backendUrl}sale/all/${saleId}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });



      toast.success('Sale edited successfully');
      handleClose();
      if (onEditSale) {
        onEditSale();
      }
    } catch (error) {
      console.error('Error editing sale:', error);
      toast.error('Error editing sale. Please try again.');
    }
  };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen}>
        <IconButton>
          <IconEdit width="18" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details of the sale.
          </DialogContentText>
          <Box mt={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
              autoFocus
              margin="dense"
              id="product name"
              label="Product"
              type="text"
              fullWidth
              value={formData.product_name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
            />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-label">Product Status</InputLabel>
              <Select
                labelId="{formData.product_name}"
                id="status"
                value={formData.status}
                onChange={handleStatusChange}
                label="Product Status"
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="quantity_sold"
              label="Quantity Sold"
              type="text"
              fullWidth
              value={formData.quantity_sold}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="sale_date"
              label="Sale Date"
              type="date"
              fullWidth
              value={formData.sale_date}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleEditSale}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditDialog;
