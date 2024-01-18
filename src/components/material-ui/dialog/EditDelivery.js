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
import EditIcon from '@mui/icons-material/Edit';
import usePlacesAutocomplete from 'use-places-autocomplete';

const EditDelivery = ({ deliveryId, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    product: '',
    status: 'Pending',
    quantity: 1,
    delivery_fee: 0,
    contact_number: '',
  });
  const [productsList, setProductsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { setValue } = usePlacesAutocomplete();

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryData();
      fetchProductsList();
    }
  }, [deliveryId]);

  const fetchProductsList = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/`
      );

      if (response.data && Array.isArray(response.data)) {
        setProductsList(response.data);
      } else {
        console.error('Invalid data format for products list:', response.data);
      }
    } catch (error) {
      console.error('Error fetching products list:', error);
    }
  };

  const fetchDeliveryData = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/delivery/${deliveryId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
          },
        }
      );

      console.log("here is the response data", response.data);

      if (response.data && typeof response.data === 'object') {
        setFormData({
          location: response.data.location,
          product: response.data.product,
          status: response.data.status,
          quantity: response.data.quantity,
          delivery_fee: response.data.delivery_fee || 0,
          contact_number: response.data.contact_number,
          total: response.data.total,
          user: response.data.user
        });
      } else {
        console.error('Invalid data format for delivery:', response.data);
      }
    } catch (error) {
      console.error('Error fetching delivery data:', error);
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
        e.target.id === 'quantity' || e.target.id === 'delivery_fee'
          ? parseInt(e.target.value, 10)
          : e.target.value,
    });
  };

  const handleProductChange = (event) => {
    const selectedProduct = productsList.find(
      (product) => product.id === event.target.value
    );
    setFormData({
      ...formData,
      product: selectedProduct ? selectedProduct.id : '',
      delivery_fee: selectedProduct ? selectedProduct.price : 0,
    });
  };

  const handleLocationChange = (value) => {
    setFormData({
      ...formData,
      location: value,
    });
  };

  const handleDeliveryStatusChange = (event) => {
    setFormData({
      ...formData,
      status: event.target.value,
    });
  };

  const handleEditDelivery = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}products/deliveries/${deliveryId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Delivery edited successfully');
      handleClose();
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error('Error editing delivery:', error);
      toast.error('Error editing delivery. Please try again.');
    }
  };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen}>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Delivery</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details of the delivery.
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
                {/* Map over productsList for product options */}
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
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleLocationChange(suggestion.description)}
                  >
                    {suggestion.description}
                  </li>
                ))}
            </ul>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={formData.status}
                onChange={handleDeliveryStatusChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                {/* Add more status options if needed */}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="delivery_fee"
              label="Delivery Fee"
              type="number"
              fullWidth
              value={formData.delivery_fee}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleEditDelivery}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditDelivery;
