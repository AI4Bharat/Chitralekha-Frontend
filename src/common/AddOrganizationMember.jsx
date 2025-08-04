import { Fragment, useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "utils";

//Components
import {
  Autocomplete,
  Avatar,
  Button,
  Chip,
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
  Alert,
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
  userRole, // Add userRole prop to determine flow
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isManager, setIsManager] = useState(false);

  const userRoles = useSelector((state) => state.getUserRoles.data);

  useEffect(() => {
    // Check if current user is a project manager
    setIsManager(userRole === "PROJECT_MANAGER");
  }, [userRole]);

  const getUserRolesList = () => {
    const userObj = new FetchUserRolesAPI();
    dispatch(APITransport(userObj));
  };
  
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === ",") {
      event.preventDefault();
      if (inputValue.trim()) {
        handleTextField((prev) => [...prev, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    getUserRolesList();
    // eslint-disable-next-line
  }, []);

  const handleDelete = (chipToDelete) => {
    handleTextField((chips) => chips.filter((chip) => chip !== chipToDelete));
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
        {isManager && (
          <Alert severity="info" sx={{ mb: 2 }}>
            As a Project Manager, your user suggestions will be sent to organization admins for approval.
          </Alert>
        )}
        
        <Autocomplete
          multiple
          freeSolo
          id="add-members"
          value={textFieldValue}
          onChange={(event, newValue) => {
            console.log("Autocomplete onChange - newValue:", newValue);
            console.log("Autocomplete onChange - newValue type:", typeof newValue);
            handleTextField(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onKeyDown={handleKeyDown}
          options={[]}
          renderTags={(tagValue) => {
            return tagValue.map((option) => (
              <Fragment key={option}>
                {option.length ? (
                  <Chip
                    variant="outlined"
                    color="primary"
                    label={option}
                    avatar={<Avatar>{option.charAt(0).toUpperCase()}</Avatar>}
                    onDelete={() => handleDelete(option)}
                  />
                ) : null}
              </Fragment>
            ));
          }}
          sx={{ mb: 3 }}
          renderInput={(params) => (
            <TextField {...params} label={textFieldLabel} />
          )}
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
            handleSelectField && handleSelectField("");
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
            addBtnClickHandler()
            handleUserDialogClose()
          }}
          disabled={textFieldLabel || selectFieldValue ? false : true}
        >
          {isManager ? "Suggest Users" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrganizationMember;
