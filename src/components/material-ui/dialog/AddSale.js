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
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';

const FormDialog = ({ onAddSale }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity_sold: 1,
    sale_date: '',
    product: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
  });
  const [products, setProducts] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    product: false,
    quantity_sold: false,
    sale_date: false,
  });

  useEffect(() => {
    // Fetch the list of products when the component mounts
    fetchProducts();
  }, []);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');

      // Make a GET request to fetch products for the current user
      const response = await axios.get(
        `${backendUrl}products/list/`,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      [e.target.id]: e.target.id === 'quantity_sold' ? parseInt(e.target.value, 10) : e.target.value,
    });

    // Clear validation errors when the user starts typing
    setValidationErrors({
      ...validationErrors,
      [e.target.id]: false,
    });
  };

  const handleProductChange = (event) => {
    setFormData({
      ...formData,
      product: event.target.value,
    });

    // Clear validation errors when the product is selected
    setValidationErrors({
      ...validationErrors,
      product: false,
    });
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'user' && !formData[key]) {
        errors[key] = true;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSale = async () => {
    try {
      const isValid = validateForm();

      if (!isValid) {
        // Validation failed
        return;
      }

      const accessKey = localStorage.getItem('accessToken');

      // Make a POST request to add a sale
      await axios.post(
        `${backendUrl}sale/all/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success alert
      toast.success('Sale added successfully');

    // Reset the form
    setFormData({
      quantity_sold: 1,
      sale_date: '',
      product: '',
      user: parseInt(localStorage.getItem('user_id'), 10),
    });

      // Close the dialog
      handleClose();

      // Trigger the parent component callback to refresh the sale list
      if (onAddSale) {
        onAddSale();
      }
    } catch (error) {
      console.error('Error adding sale:', error);

      // Show error alert
      toast.warning('Quantity sold exceeds available qiantity', error);
      console.log(formData);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>
        <IconButton color='inherit'>
          <AddIcon />
        </IconButton>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new sale.
          </DialogContentText>
          <Box mt={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-label">Product</InputLabel>
              <Select
                labelId="product-label"
                id="product"
                value={formData.product}
                onChange={handleProductChange}
                label="Product"
                error={validationErrors.product}
                required
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
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
              error={validationErrors.quantity_sold}
              helperText={validationErrors.quantity_sold && 'Quantity Sold is required'}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="sale_date"
              label=""
              type="date"
              fullWidth
              value={formData.sale_date}
              onChange={handleInputChange}
              error={validationErrors.sale_date}
              helperText={validationErrors.sale_date && 'Sale Date is required'}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddSale}>Add</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default FormDialog;
