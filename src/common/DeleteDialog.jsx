import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";
import CustomButton from "./Button";
import Loader from "./Spinner";

const DeleteDialog = ({ openDialog, handleClose, submit, message, loading }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => submit()}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Delete
          {loading && <Loader size={20} margin="0 0 0 5px" color="secondary"/>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
