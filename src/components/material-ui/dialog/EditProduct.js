import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, IconButton, Box } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const AlertDialog = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            {/* <Button variant="contained" color="secondary" fullWidth onClick={handleClickOpen}>
                Open Alert Dialog
            </Button> */}
        <Tooltip title="Edit" onClick={handleClickOpen}>
          <IconButton>
            <IconEdit width="18" />
          </IconButton>
        </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <Box mt={4}>
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="email"
                            fullWidth
                        />
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Price"
                            type="email"
                            fullWidth
                        />
                        <CustomTextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Quantity"
                            type="email"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialog;
