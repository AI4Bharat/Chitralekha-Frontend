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
} from "@mui/material";
import { useEffect, useState } from "react";
import { roles } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import APITransport from "../redux/actions/apitransport/apitransport";
import FetchUserRolesAPI from "../redux/actions/api/User/FetchUsersRoles";


const AddOrganizationMember = ({
  open,
  handleUserDialogClose,
  title,
  textFieldValue,
  handleTextField,
  addBtnClickHandler,
  textFieldLabel,
  selectFieldValue,
  handleSelectField,
}) => {
  const dispatch = useDispatch();
  const {id} = useParams();

  const userRoles = useSelector((state) => state.getUserRoles.data);

  const getUserRolesList = () => {
    const userObj = new FetchUserRolesAPI();
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getUserRolesList()
  }, []);

  return (
    <Dialog open={open} onClose={handleUserDialogClose} close >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <TextField
          label={textFieldLabel}
          fullWidth
          value={textFieldValue}
          onChange={(event) => handleTextField(event.target.value)}
          sx={{ mb: 3 }}
          type="email"
        />
        <FormControl fullWidth>
          <InputLabel id="select-role">Select Role</InputLabel>
          <Select
            labelId="select-role"
            id="select"
            value={selectFieldValue}
            label="Select Role"
            onChange={(event) => handleSelectField(event.target.value)}
          >
            {userRoles.map((item) => {
              return <MenuItem value={item.value}>{item.label}</MenuItem>;
            })}
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
          disabled={(textFieldLabel && selectFieldValue) ? false : true}
          sx={{lineHeight: "0", height: "auto"}}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrganizationMember;
