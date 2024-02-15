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
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import AddIcon from '@mui/icons-material/Add';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
  const [validationErrors, setValidationErrors] = useState({
    amount: false,
    description: false,
    category: false,
    expense_date: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessKey = localStorage.getItem('accessToken');
        const response = await axios.get(`${backendUrl}/sale/expenses-category/`, {
          headers: {
            Authorization: `Bearer ${accessKey}`,
          },
        });

        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
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

    // Clear validation errors when the user starts typing
    setValidationErrors({
      ...validationErrors,
      [e.target.id]: false,
    });
  };

  const validateForm = () => {
  const errors = {};
  Object.keys(formData).forEach((key) => {
    // Exclude 'user' from validation
    if (key !== 'user' && !formData[key]) {
      errors[key] = true;
    }
  });
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};


  const handleAddProduct = async () => {
    try {
      const isValid = validateForm(validationErrors);

      if (!isValid) {
        // Validation failed
        console.log();
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
        `${backendUrl}/sale/expenses/`,
        formDataWithUserId,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Expense added successfully');

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
              error={validationErrors.amount}
              helperText={validationErrors.amount && 'Amount is required'}
              required
            />
            <CustomTextField
              sx={{ my: 2 }}
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              fullWidth
              onChange={handleInputChange}
              error={validationErrors.description}
              helperText={validationErrors.description && 'Description is required'}
              required
            />
            <Select
              sx={{ my: 2 }}
              id="category"
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) => handleInputChange({ target: { id: 'category', value: e.target.value } })}
              error={validationErrors.category}
              required
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
              label="Expense Date"
              type="date"
              fullWidth
              value={formData.expense_date}
              onChange={handleInputChange}
              error={validationErrors.expense_date}
              helperText={validationErrors.expense_date && 'Expense Date is required'}
              required
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
