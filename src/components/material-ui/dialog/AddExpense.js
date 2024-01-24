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
  Select,
  MenuItem,
  TextField,
  InputLabel,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import AddIcon from '@mui/icons-material/Add';

const FormDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    user: '',
    expense_date: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from your API
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

    fetchCategories();
  }, []);

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
  } else if (e.target.id === 'expense_date') {
    setFormData({
      ...formData,
      expense_date: e.target.value,
    });
  } else {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
};

  const handleAddProduct = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('user_id');

      const formDataWithUserId = {
        ...formData,
        user: userId,
      };

      console.log("withuserid",formDataWithUserId)

      // Make a POST request to your API
      const response = await axios.post(
        'http://localhost:8000/sale/expenses/',
        formDataWithUserId,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success alert
      toast.success('Expense added successfully');
      console.log("with user id", formDataWithUserId);

      // Close the dialog
      handleClose();

      // Reset the form data after successfully adding an expense
      setFormData({
        amount: '',
        description: '',
        user: '',
        expense_date: '',
        category: '',
      });

      // Trigger the parent component callback to refresh the product list
      if (onAdd) {
        onAdd();
      }
    } catch (error) {
      console.error('Error adding Expense:', error);
      console.log(formData)

      // Show error alert
      toast.error('Error adding expense. Please try again.');
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>
        <IconButton color="inherit">
          <AddIcon />
        </IconButton>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details of the new expense.</DialogContentText>
          <Box mt={4}>
            <CustomTextField
              sx={{ my: 2 }}
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              onChange={handleInputChange}
            />
            <CustomTextField
              sx={{ my: 2 }}
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              fullWidth
              onChange={handleInputChange}
            />
            <Select
              sx={{ my: 2 }}
              id="category"
              label="category"
              fullWidth
              value={formData.category}
              onChange={(e) => handleInputChange({ target: { id: 'category', value: e.target.value } })}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              autoFocus
              margin="dense"
              id="expense_date"
              label=""
              type="date"
              fullWidth
              value={formData.expense_date}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct}>Add</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default FormDialog;
