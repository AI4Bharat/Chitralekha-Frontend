import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "utils";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

//APIs
import { APITransport, FetchUserRolesAPI } from "redux/actions";

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
  isAdmin,
}) => {
  const dispatch = useDispatch();

  const userRoles = useSelector((state) => state.getUserRoles.data);

  const getUserRolesList = () => {
    const userObj = new FetchUserRolesAPI();
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getUserRolesList();

    // eslint-disable-next-line
  }, []);

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
        <TextField
          label={textFieldLabel}
          fullWidth
          value={textFieldValue}
          onChange={(event) => handleTextField(event.target.value)}
          sx={{ mb: 3 }}
          type="email"
        />

        {!isAdmin ? (
          <FormControl fullWidth>
            <InputLabel id="select-role">Select Role</InputLabel>
            <Select
              labelId="select-role"
              id="select"
              value={selectFieldValue}
              label="Select Role"
              onChange={(event) => handleSelectField(event.target.value)}
              MenuProps={MenuProps}
            >
              {userRoles.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ) : (
          <></>
        )}
      </DialogContent>

      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button
          onClick={() => {
            handleUserDialogClose();
            handleTextField("");
            handleSelectField("");
          }}
          sx={{ borderRadius: "8px" }}
        >
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
          disabled={textFieldLabel || selectFieldValue ? false : true}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrganizationMember;
