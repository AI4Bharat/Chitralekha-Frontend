import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const DeleteTaskDialog = ({
  openDialog,
  handleClose,
  submit,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to delete this task?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "0 20px 20px 20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => submit()}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;
