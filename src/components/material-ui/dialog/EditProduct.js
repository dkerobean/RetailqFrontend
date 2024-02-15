import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, IconButton, Box } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AlertDialog = ({ productId, onEdit }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        initial_quantity: ''
    });

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleClickOpen = async () => {
        try {
            const accessKey = localStorage.getItem('accessToken');
            const response = await axios.get(`${backendUrl}products/single/${productId}/`, {
                headers: {
                    Authorization: `Bearer ${accessKey}`,
                },
            });

            console.log(response.data.initial_quantity, 'here is the response')

            const productData = response.data;
            setFormData({
                name: productData.name,
                price: productData.price,
                quantity: productData.initial_quantity
            });

            setOpen(true);
        } catch (error) {
            console.error('Error fetching product data:', error);
            toast.error('Error fetching product data. Please try again.');
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleEditProduct = async () => {
        try {
            const accessKey = localStorage.getItem('accessToken');
            const formDataWithProductId = {
                ...formData,
                user: localStorage.getItem('user_id')
            };

            // Make a PUT request to update the product
            const response = await axios.put(
                `${backendUrl}products/list/${productId}/`,
                formDataWithProductId,
                {
                    headers: {
                        Authorization: `Bearer ${accessKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Show success alert
            toast.success('Product updated successfully');

            // Close the dialog
            handleClose();

            // Trigger the parent component callback to refresh the product list
            if (onEdit) {
                onEdit();
            }
        } catch (error) {
            console.error('Error updating product:', error);

            // Show error alert
            toast.error('Error updating product. Please try again.');
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
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details of the product.
                    </DialogContentText>
                    <Box mt={4}>
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="price"
                            label="Price"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="quantity"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={formData.quantity}
                            onChange={handleInputChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEditProduct}>Update</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
}

export default AlertDialog;
