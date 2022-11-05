import { Add } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import CustomButton from "./Button";

const AddDialog = ({
  open,
  handleUserDialogClose,
  title,
  textFieldValue,
  handleTextField,
  addBtnClickHandler,
  textFieldLabel,
  isAddMember,
  selectFieldValue,
  handleSelectField,
}) => {
  return (
    <Dialog open={open} onClose={handleUserDialogClose} close>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <TextField
          label={textFieldLabel}
          fullWidth
          value={textFieldValue}
          onChange={(event) => handleTextField(event.target.value)}
          sx={{ mb: 3 }}
        />

        {isAddMember && (
          <FormControl fullWidth>
            <InputLabel id="select-role">Select Role</InputLabel>
            <Select
              labelId="select-role"
              id="select"
              value={selectFieldValue}
              label="Select Role"
              onChange={(event) => handleSelectField(event.target.value)}
            >
              <MenuItem value={"Annotator"}>Annotator</MenuItem>
              <MenuItem value={"Manager"}>Manager</MenuItem>
              <MenuItem value={"Admin"}>Admin</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button onClick={handleUserDialogClose} size="small">
          Cancel
        </Button>

        <CustomButton
          startIcon={<Add />}
          onClick={addBtnClickHandler}
          size="small"
          label="Add"
          disabled={!textFieldValue}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
