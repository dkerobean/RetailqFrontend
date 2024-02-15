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

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FormDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transaction_type: '',
    description: '',
    transaction_date: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
  });
  const [validationErrors, setValidationErrors] = useState({
    amount: false,
    transaction_type: false,
    description: false,
    transaction_date: false,
  });

  useEffect(() => {
    // Fetch any additional data or perform other setup if needed
  }, []);

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

  const handleProductChange = (event) => {
    setFormData({
      ...formData,
      transaction_type: event.target.value,
    });
  };

  const handleDateChange = (event) => {
    setFormData({
      ...formData,
      transaction_date: event.target.value,
    });
  };

  const handleAddTransaction = async () => {
    try {
      const isValid = validateForm();

      if (!isValid) {
        // Validation failed
        return;
      }

      const accessKey = localStorage.getItem('accessToken');

      // Make a POST request to add a transaction
      await axios.post(
        `${backendUrl}/sale/transactions/`,
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

      // Show error alert
      toast.error('Error adding transaction. Please try again.');
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
              <InputLabel id="transaction_type-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction_type-label"
                id="transaction_type"
                value={formData.transaction_type}
                onChange={handleProductChange}
                label="Transaction Type"
                error={validationErrors.transaction_type}
                required
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleInputChange}
              error={validationErrors.amount}
              helperText={validationErrors.amount && 'Amount is required'}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              error={validationErrors.description}
              helperText={validationErrors.description && 'Description is required'}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="transaction_date"
              label="Transaction Date"
              type="date"
              fullWidth
              value={formData.transaction_date}
              onChange={handleDateChange}
              error={validationErrors.transaction_date}
              helperText={validationErrors.transaction_date && 'Transaction Date is required'}
              required
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
