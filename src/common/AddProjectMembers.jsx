import React from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Checkbox,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddProjectMembers = ({
  open,
  handleUserDialogClose,
  title,
  addBtnClickHandler,
  selectFieldValue,
  handleSelectField,
  managerNames,
}) => {
  const filterOptions = (options, state) => {
    const newOptions = options.filter((user) => {
      const { first_name, last_name, email } = user;

      const searchValue = state.inputValue.toLowerCase();
      const fullName = `${first_name} ${last_name}`;

      return (
        first_name.toLowerCase().includes(searchValue) ||
        last_name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        fullName.toLowerCase().includes(searchValue)
      );
    });

    return newOptions;
  };

  return (
    <Dialog
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"sm"}
      fullWidth
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleUserDialogClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <FormControl fullWidth>
          <Autocomplete
            multiple
            id="add-project-member"
            options={managerNames}
            value={selectFieldValue}
            onChange={(_event, newValue) => {
              handleSelectField(newValue);
            }}
            disableCloseOnSelect
            getOptionLabel={(option) => option.email}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.email}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Select" />}
            filterOptions={filterOptions}
          />
        </FormControl>
      </DialogContent>

      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button onClick={handleUserDialogClose} sx={{ borderRadius: "8px" }}>
          Cancel
        </Button>

        <Button
          autoFocus
          variant="contained"
          sx={{ marginLeft: "10px", borderRadius: "8px" }}
          onClick={() => {
            addBtnClickHandler();
            handleUserDialogClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectMembers;
