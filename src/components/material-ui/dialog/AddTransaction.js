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

const FormDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transaction_type: '',
    description: '',
    transaction_date: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
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
      [e.target.id]: e.target.id === 'transaction_type' ? parseInt(e.target.value, 10) : e.target.value,
    });
  };

  const handleProductChange = (event) => {
    setFormData({
      ...formData,
      transaction_type: event.target.value,
      user: formData.user
    });
  };

  const handleDateChange = (event) => {
    setFormData({
      ...formData,
      transaction_date: event.target.value,
      user: formData.user
    });
  };

  const handleAddTransaction = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');

      // Make a POST request to add a sale
      await axios.post(
        'http://localhost:8000/sale/transactions/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success alert
      toast.success('Transaction added successfully');

      // Close the dialog
      handleClose();

      // Reset the form data after successfully adding a transaction
      setFormData({
        amount: '',
        transaction_type: '',
        description: '',
        transaction_date: '',
        user: parseInt(localStorage.getItem('user_id'), 10),
      });

      // Trigger the parent component callback to refresh the transaction list
      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      console.log(formData);

      // Show error alert
      toast.error('Error adding transaction. Please try again.');
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
        <DialogTitle>Add transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new transaction.
          </DialogContentText>
          <Box mt={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction_type"
                id="transaction_type"
                value={formData.transaction_type}
                onChange={handleProductChange}
                label="Transaction Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="what was the transaction about"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              inputProps={{
              maxLength: 15,
            }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="transaction_date"
              label=""
              type="date"
              fullWidth
              value={formData.transaction_date}
              onChange={handleDateChange}
            />

          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddTransaction}>Add</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default FormDialog;
