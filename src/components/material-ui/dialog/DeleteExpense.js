import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteProduct = ({ ExpenseId, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleDelete = async () => {
    try {
      const accessKey = localStorage.getItem('accessToken');

      // Make a DELETE request to your API
      const response = await axios.delete(`${backendUrl}sale/expenses/${ExpenseId}/`, {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      });

      // Show success alert
      toast.success('Expense deleted successfully');
      console.log(response.data);

      // Trigger parent component callback to refresh the product list
      onDelete();

      // Close the dialog
      handleClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
      handleClose();

      // Show error alert
      toast.error('Error deleting expense. Please try again.');
    }
  };

  return (
    <>
      <Tooltip title="Delete" onClick={handleClickOpen}>
        <IconButton>
          <IconTrash width="18" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Expense"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Expense?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default DeleteProduct;
