import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";

export default function ConfirmDialog({
  button, // Button text
  title, // Dialog title
  text, // Dialog body text
  shop = false, // Optional boolean to show shopping cart icon
  disabled = false, // Optional boolean to disable button
  confirm, // Callback function to execute on confirmation
}: {
  button: string;
  title: string;
  text: string;
  shop?: boolean;
  disabled?: boolean;
  confirm: () => void;
}) {
  const [open, setOpen] = useState(false); // State to control dialog visibility

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle confirmation and close the dialog
  const handleYes = () => {
    confirm && confirm(); // Call the provided confirmation function
    setOpen(false);
  };

  return (
    <Box>
      {/* Button to trigger the dialog */}
      <Button variant="contained" onClick={handleClickOpen} disabled={disabled}>
        {shop && <ShoppingCartOutlined />} {button}
      </Button>

      {/* Dialog component */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* Dialog title */}
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

        {/* Dialog body text */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>

        {/* Dialog actions */}
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            NO
          </Button>
          <Button
            onClick={handleYes}
            autoFocus
            variant="contained"
            color="success"
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
