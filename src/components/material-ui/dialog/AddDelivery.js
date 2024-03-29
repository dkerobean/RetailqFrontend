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
import usePlacesAutocomplete from 'use-places-autocomplete';

const DeliveryFormDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    product: '',
    status: 'Pending',
    quantity: 1,
    delivery_fee: 30,
    total: 0,
    contact_number: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
  });
  const [productsList, setProductsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { setValue } = usePlacesAutocomplete();
  const [validationErrors, setValidationErrors] = useState({
    location: false,
    product: false,
    quantity: false,
    contact_number: false,
    delivery_fee: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessKey = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}products/list/`,
          {
            headers: {
              Authorization: `Bearer ${accessKey}`,
            },
          }
        );
        setProductsList(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchLocationPredictions = async () => {
      try {
        const response = await axios.get(
          '/maps/api/place/autocomplete/json',
          {
            params: {
              input: formData.location,
              key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              components: 'country:GH',
            },
          }
        );

        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching location predictions:', error);
      }
    };

    fetchLocationPredictions();
  }, [formData.location]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    const selectedProduct = productsList.find((product) => product.id === selectedProductId);

    setFormData({
      ...formData,
      product: selectedProductId,
      total: calculateTotal(formData.quantity, formData.delivery_fee, selectedProduct),
    });

    // Clear validation errors when the user changes the product
    setValidationErrors({
      ...validationErrors,
      product: false,
    });
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const fieldName = e.target.id;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: fieldName === 'quantity' ? parseInt(inputValue, 10) : inputValue,
      total: calculateTotal(
        fieldName === 'quantity' ? parseInt(inputValue, 10) : prevFormData.quantity,
        prevFormData.delivery_fee,
        productsList.find((product) => product.id === prevFormData.product)
      ),
    }));

    // Clear validation errors when the user starts typing
    setValidationErrors({
      ...validationErrors,
      [fieldName]: false,
    });
  };

  const handleDeliveryPriceChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      delivery_fee: parseInt(e.target.value, 10),
      total: calculateTotal(
        prevFormData.quantity,
        parseInt(e.target.value, 10),
        productsList.find((product) => product.id === prevFormData.product)
      ),
    }));

    // Clear validation errors when the user changes the delivery fee
    setValidationErrors({
      ...validationErrors,
      delivery_fee: false,
    });
  };

  const handleLocationChange = (value) => {
    setFormData({
      ...formData,
      location: value,
    });

    // Clear validation errors when the user changes the location
    setValidationErrors({
      ...validationErrors,
      location: false,
    });
  };

  const handleAddDelivery = async () => {
    try {
      const isValid = validateForm();

      if (!isValid) {
        // Validation failed
        return;
      }

      const accessKey = localStorage.getItem('accessToken');

      // Make a POST request to add a delivery
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}products/deliveries/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success alert
      toast.success('Delivery added successfully');

      // Reset the form state
      setFormData({
        location: '',
        product: '',
        status: 'Pending',
        quantity: 1,
        delivery_fee: 30,
        total: 0,
        contact_number: '',
        user: parseInt(localStorage.getItem('user_id'), 10),
      });

      // Close the dialog
      handleClose();

      // Trigger the parent component callback to refresh the delivery list
      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error('Error adding delivery:', error);

      // Show error alert
      toast.error('Error adding delivery. Please try again.');
    }
  };

  const calculateTotal = (quantity, deliveryFee, product) => {
    const productPrice = product ? parseFloat(product.price) : 0;
    return quantity * productPrice + deliveryFee;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.location) {
      errors.location = true;
    }
    if (!formData.product) {
      errors.product = true;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = true;
    }
    if (!formData.contact_number) {
      errors.contact_number = true;
    }
    if (!formData.delivery_fee || formData.delivery_fee < 0) {
      errors.delivery_fee = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>
        <IconButton color='inherit'>
          <AddIcon />
        </IconButton>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Delivery</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new delivery.
          </DialogContentText>
          <Box mt={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-label">Product</InputLabel>
              <Select
                labelId="product"
                id="product"
                value={formData.product}
                onChange={handleProductChange}
                label="Product"
                error={validationErrors.product}
              >
                {productsList.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              error={validationErrors.quantity}
              helperText={validationErrors.quantity && 'Quantity is required and must be greater than 0'}
            />
            <TextField
              autoFocus
              margin="dense"
              id="contact_number"
              label="Contact Number"
              type="text"
              fullWidth
              value={formData.contact_number}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              error={validationErrors.contact_number}
              helperText={validationErrors.contact_number && 'Contact Number is required'}
            />
            <TextField
              autoFocus
              id="delivery_fee"
              margin="dense"
              label="Delivery Fee"
              fullWidth
              value={formData.delivery_fee}
              onChange={handleDeliveryPriceChange}
              type="number"
              error={validationErrors.delivery_fee}
              helperText={validationErrors.delivery_fee && 'Delivery Fee must be 0 or greater'}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => {
                setValue(e.target.value);
                handleLocationChange(e.target.value);
              }}
              error={validationErrors.location}
              helperText={validationErrors.location && 'Location is required'}
            />
            <ul>
              {Array.isArray(suggestions) &&
                suggestions.map((suggestion) => (
                  <li key={suggestion.place_id} onClick={() => handleLocationChange(suggestion.description)}>
                    {suggestion.description}
                  </li>
                ))}
            </ul>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddDelivery}>Add</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default DeliveryFormDialog;
