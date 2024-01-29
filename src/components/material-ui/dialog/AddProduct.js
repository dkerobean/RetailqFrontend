import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import AddIcon from '@mui/icons-material/Add';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FormDialog = ({ onAddProduct }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    price: false,
    quantity: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // Clear validation errors when the user starts typing
    setValidationErrors({
      ...validationErrors,
      [e.target.id]: false,
    });
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = true;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    try {
      const isValid = validateForm();

      if (!isValid) {
        // Validation failed
        return;
      }

      const accessKey = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('user_id');

      const formDataWithUserId = {
        ...formData,
        user: userId,
      };

      // Make a POST request to your API
      const response = await axios.post(
        `${backendUrl}products/list/`,
        formDataWithUserId,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success alert
      toast.success('Product added successfully');
      console.log(response.data);

      // Close the dialog
      handleClose();

      // Trigger the parent component callback to refresh the product list
      if (onAddProduct) {
        onAddProduct();
      }
    } catch (error) {
      console.error('Error adding product:', error);

      // Show error alert
      toast.error('Error adding product. Please try again.');
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
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new product.
          </DialogContentText>
          <Box mt={4}>
            <CustomTextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              onChange={handleInputChange}
              error={validationErrors.name}
              helperText={validationErrors.name && 'Name is required'}
              required
            />
            <CustomTextField
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
              onChange={handleInputChange}
              error={validationErrors.price}
              helperText={validationErrors.price && 'Price is required'}
              required
            />
            <CustomTextField
              autoFocus
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              onChange={handleInputChange}
              error={validationErrors.quantity}
              helperText={validationErrors.quantity && 'Quantity is required'}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default FormDialog;