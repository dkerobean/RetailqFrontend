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

const EditDialog = ({ expenseId, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    user: parseInt(localStorage.getItem('user_id'), 10),
    category: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the expense data when the component mounts
    fetchExpense();
    // Fetch categories from your API
    fetchCategories();
  }, [expenseId]);

  const fetchExpense = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8000/sale/expense/${expenseId}/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if response.data is an object before setting the state
      if (response.data && typeof response.data === 'object') {
        setFormData({
          amount: response.data.amount,
          description: response.data.description,
          user: response.data.user,
          category: response.data.category.id,
        });
      } else {
        console.error('Invalid data format for expense:', response.data);
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/sale/expenses-category/', {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error as needed
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    // Separate handling for 'category'
    if (e.target.id === 'category') {
      setFormData({
        ...formData,
        category: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleCategoryChange = (event) => {
    setFormData({
      ...formData,
      category: event.target.value,
    });
  };

  const handleEditExpense = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8000/sale/expenses/${expenseId}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Expense edited successfully');
      handleClose();
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      toast.error('Error editing expense. Please try again.');
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
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details of the expense.
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
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={formData.category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleEditExpense}>Save Changes</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default EditDialog;
