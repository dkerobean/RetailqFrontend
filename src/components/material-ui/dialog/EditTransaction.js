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

const EditDialog = ({ transactionId, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transaction_type: '',
    description: '',
    user: ''
  });

  useEffect(() => {
    // Fetch the transaction data when the component mounts
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`${backendUrl}/sale/transaction/${transactionId}/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if response.data is an object before setting the state
      if (response.data && typeof response.data === 'object') {
        setFormData({
          amount: response.data.amount,
          transaction_type: response.data.transaction_type,
          description: response.data.description,
          user: response.data.user,
        });
      } else {
        console.error('Invalid data format for transaction:', response.data);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
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
        e.target.id === 'user'
          ? parseInt(e.target.value, 10)
          : e.target.value,
    });
  };

  const handleTransactionTypeChange = (event) => {
    setFormData({
      ...formData,
      transaction_type: event.target.value,
    });
  };

  const handleEditTransaction = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      await axios.put(`${backendUrl}/sale/transactions/${transactionId}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Transaction edited successfully');
      handleClose();
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error('Error editing transaction:', error);
      toast.error('Error editing transaction. Please try again.');
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
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details of the transaction.
          </DialogContentText>
          <Box mt={4}>
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction-type-label"
                id="transaction_type"
                value={formData.transaction_type}
                onChange={handleTransactionTypeChange}
                label="Transaction Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleEditTransaction}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditDialog;
