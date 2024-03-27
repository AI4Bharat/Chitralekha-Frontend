import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MenuProps } from "utils";
import {
  APITransport,
  CreateMemberAPI,
  FetchOrganizationListAPI,
  FetchUserRolesAPI,
  setSnackBar,
} from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import CustomizedSnackbars from "./Snackbar";
import Loader from "./Spinner";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AddNewMember = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState({
    orgName: "",
    email: "",
    roles: [],
  });
  const [loading, setLoading] = useState(false);

  const snackbar = useSelector((state) => state.commonReducer.snackbar);
  const userRoles = useSelector((state) => state.getUserRoles.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const orgList = useSelector((state) => state.getOrganizationList.data);

  const getUserRolesList = () => {
    const userObj = new FetchUserRolesAPI();
    dispatch(APITransport(userObj));
  };

  const getOrgList = () => {
    const apiObj = new FetchOrganizationListAPI();
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "CREATE_MEMBER") {
          setLoading(false);
          handleClose();

          const apiObj = new FetchOrganizationListAPI();
          dispatch(APITransport(apiObj));
        }
      } else {
        if (apiType === "CREATE_MEMBER") {
          handleClose();
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    getUserRolesList();
    getOrgList();

    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "orgName") {
      setFormFields((prev) => {
        return {
          ...prev,
          email: value.organization_owner.email,
        };
      });
    }

    setFormFields((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleClear = () => {
    setFormFields({
      orgName: "",
      email: "",
      roles: [],
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { orgName, email, roles } = formFields;

    const apiObj = new CreateMemberAPI(orgName.title, email, roles);
    dispatch(APITransport(apiObj));
  };

  const disableForm = () => {
    const { orgName, email, roles } = formFields;

    if (orgName === "" || email === "" || roles.length === 0) {
      return true;
    }

    return false;
  };

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

  return (
    <>
      {renderSnackBar()}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"sm"}
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4" display="flex" alignItems={"center"}>
          <Typography variant="h4">Create New Members</Typography>{" "}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ paddingTop: "20px" }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="org-name-select">Organization Name*</InputLabel>
                <Select
                  labelId="org-name-select"
                  label="Organization Name*"
                  name="orgName"
                  value={formFields.orgName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Organization Name*" />}
                  MenuProps={MenuProps}
                >
                  {orgList.map((org) => (
                    <MenuItem key={org.value} value={org}>
                      {org.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Org Owner Email*"
                value={formFields.email}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-select">
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 1 }}>Roles</Box>
                    <Tooltip
                      arrow
                      title={"Accounts for selected roles will be created"}
                      placement="top"
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </Box>
                </InputLabel>

                <Select
                  labelId="role-select"
                  name="roles"
                  value={formFields.roles}
                  onChange={handleChange}
                  multiple
                  input={
                    <OutlinedInput
                      label={
                        <>
                          Roles <InfoOutlinedIcon />
                        </>
                      }
                    />
                  }
                  renderValue={(selected) =>
                    selected.map((obj) => obj.label).join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  {userRoles.map((role) => (
                    <MenuItem
                      key={role.value}
                      value={role}
                      disabled={role.value === "ORG_OWNER"}
                    >
                      <Checkbox
                        checked={
                          formFields.roles
                            .map((obj) => obj.value)
                            .indexOf(role.value) > -1 ||
                          role.value === "ORG_OWNER"
                        }
                      />
                      <ListItemText primary={role.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: "20px" }}>
          <Button
            variant="text"
            onClick={handleClear}
            sx={{ lineHeight: "1", borderRadius: "6px" }}
          >
            Clear
          </Button>

          <Button
            autoFocus
            variant="contained"
            sx={{ lineHeight: "1", marginLeft: "10px", borderRadius: "8px" }}
            onClick={handleSubmit}
            disabled={disableForm()}
          >
            Create{" "}
            {loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddNewMember;
