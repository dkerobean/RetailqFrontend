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

const EditDialog = ({ productId, onEditSale }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity_sold: 1,
    sale_date: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
    product_id: '',
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch the sale data when the component mounts
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8000/sale/${productId}/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if response.data is an object before setting the state
      if (response.data && typeof response.data === 'object') {
        setFormData({
          quantity_sold: response.data.quantity_sold,
          sale_date: response.data.sale_date,
          user: response.data.user,
          product_id: response.data.product_id,
          product: response.data.product,
          product_name: response.data.product_name,
        });
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

  const handleEditSale = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8000/sale/all/${productId}/`, formData, {
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
              <InputLabel id="product-label">Product</InputLabel>
              <Select
                labelId="product-label"
                id="product_id"
                value={formData.product_id}
                onChange={handleProductChange}
                label="Product"
                >
                {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                    {product.product_name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="quantity_sold"
              label="Quantity Sold"
              type="number"
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
