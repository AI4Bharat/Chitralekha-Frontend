import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { roles } from "../utils/utils";
import { styled } from "@mui/material/styles";
import DatasetStyle from "../styles/Dataset";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AddProjectMembers = ({
  open,
  handleUserDialogClose,
  title,
  addBtnClickHandler,
  selectFieldValue,
  handleSelectField,
  managerNames,
}) => {
  const classes = DatasetStyle();

  return (
    <Dialog
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
      fullWidth
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4">{title}</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="mutiple-select-label">Add project members</InputLabel>
          <Select
            labelId="mutiple-select-label"
            label="mutiple-select-label"
            multiple
            value={selectFieldValue}
            onChange={(event) => handleSelectField(event.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value, index) => {
                  return <Chip key={index} label={value.email} />;
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {managerNames?.map((item, index) => (
              <MenuItem key={index} value={item}>
                <Checkbox checked={selectFieldValue.indexOf(item) > -1} />
                <ListItemText primary={item.email} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button onClick={handleUserDialogClose} sx={{ borderRadius: "8px" }}>
          Close
        </Button>

        <Button
          autoFocus
          endIcon={<Add />}
          variant="contained"
          sx={{ marginLeft: "10px", borderRadius: "8px" }}
          onClick={() => {
            addBtnClickHandler();
            handleUserDialogClose();
          }}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectMembers;
