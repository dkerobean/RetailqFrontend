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
    delivery_fee: '30',
    total: 0,
    contact_number: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
  });
  const [productsList, setProductsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { setValue } = usePlacesAutocomplete();

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
  const selectedProduct = productsList.find(product => product.id === selectedProductId);

  setFormData({
    ...formData,
    product: selectedProductId,
    total: formData.quantity * (selectedProduct ? parseFloat(selectedProduct.price) : 0) + 30,
  });
};



const handleInputChange = (e) => {
  setFormData({
    ...formData,
    delivery_fee: e.target.id === 'quantity'
      ? parseInt(e.target.value, 10)
      : e.target.id === 'delivery_fee'
      ? parseInt(e.target.value, 10)
      : e.target.value,
    [e.target.id]: e.target.id === 'quantity' ? parseInt(e.target.value, 10) : e.target.id === 'delivery_fee' ? parseInt(e.target.value, 10) : e.target.value,
    total: e.target.id === 'quantity'
  ? (parseInt(e.target.value, 10) * formData.delivery_fee) +
    (parseInt(e.target.value, 10) * (formData.product ? parseFloat(productsList.find(product => product.id === formData.product)?.price || 0) : 0))
  : formData.total,

  });
};

// const handleInputChange = (e) => {
//   let updatedFormData = { ...formData };

//   if (e.target.id === 'quantity') {
//     updatedFormData.quantity = parseInt(e.target.value, 10);
//   } else if (e.target.id === 'delivery_fee') {
//     updatedFormData.delivery_fee = parseFloat(e.target.value) || ''; // Treat as number, allow decimals
//   } else {
//     updatedFormData[e.target.id] = e.target.value;
//   }

//   // Calculate total based on updated values
//   updatedFormData.total = updatedFormData.quantity * (updatedFormData.delivery_fee || 0) +
//     (updatedFormData.quantity * (updatedFormData.product ? parseFloat(productsList.find(product => product.id === updatedFormData.product)?.price || 0) : 0));

//   setFormData(updatedFormData);
// };






  const handleLocationChange = (value) => {
    setFormData({
      ...formData,
      location: value,
    });
  };

  const handleAddDelivery = async () => {
    try {
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
      delivery_fee: '',
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
            >
              {productsList.map(product => (
                <MenuItem key={product.id} value={product}>
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
            />
            <TextField
              autoFocus
              margin="dense"
              label="Delivery Fee"
              fullWidth
              value={formData.delivery_fee}
              onChange={handleInputChange}
              type="number"
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
