import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography
} from "@material-tailwind/react";

export function LogoutDialog() {
  const [open, setOpen] = useState(true); // Open the dialog immediately when this component loads
  const navigate = useNavigate(); // Use for redirection

  const handleLogout = () => {
    // Handle logout logic here, such as clearing authentication tokens, etc.
    // Redirect to sign-in page after confirming logout
    navigate('/sign-in');
  };

  const handleClose = () => {
    // If the user cancels, close the dialog and redirect back
    setOpen(false);
    navigate('/dashboard/home'); // Redirect back to the home page or dashboard
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <DialogHeader>
        <Typography variant="h6" color="blue-gray">
          Confirm Logout
        </Typography>
      </DialogHeader>
      <DialogBody divider>
        <Typography variant="body2" color="blue-gray">
          Are you sure you want to logout from your account?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={handleClose}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default LogoutDialog;
