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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { roles } from "../utils/utils";
import { styled } from '@mui/material/styles';
import DatasetStyle from '../styles/Dataset';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AddProjectMembers = ({
  open,
  handleUserDialogClose,
  title,
  addBtnClickHandler,
  selectFieldValue,
  handleSelectField,
  managerNames
}) => {
    const classes = DatasetStyle()
   
  return (
    <Dialog open={open} onClose={handleUserDialogClose} close>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
      
        <FormControl size="large" className={classes.formControl}>
          <InputLabel
            id="mutiple-select-label"
            sx={{ fontSize: "16px", padding: "3px" }}
          >
          Add project members
          </InputLabel>
          <Select
            labelId="mutiple-select-label"
            label="mutiple-select-label"
            multiple
            value={selectFieldValue}
            onChange={(event) => handleSelectField(event.target.value)}
            renderValue={(selectFieldValue) => selectFieldValue?.map(el=>el.email).join(", ")}
            MenuProps={MenuProps}
          >
            {managerNames?.map((item, index) => (
              <MenuItem
                sx={{ textTransform: "capitalize" }}
                key={index}
                value={item}
              >
                {/* <ListItemIcon>
                  <Checkbox checked={taskStatus.indexOf(item.email) > -1} />
                </ListItemIcon> */}
                <ListItemText primary={item.email} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button onClick={handleUserDialogClose} size="small">
          Cancel
        </Button>

        <Button
          variant="contained"
          endIcon={<Add />}
          onClick={() => {
            addBtnClickHandler();
            handleUserDialogClose();
          }}
         // disabled={textFieldLabel && selectFieldValue ? false : true}
          sx={{ lineHeight: "0", height: "auto" }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectMembers;
