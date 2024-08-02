import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MenuProps, availability, roles } from "utils";
import { profileOptions } from "config";

//Styles
import { LoginStyle } from "styles";

//Components
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { AlertComponent, UpdateEmailDialog } from "common";
import EditIcon from "@mui/icons-material/Edit";

//APIs
import {
  APITransport,
  FetchLoggedInUserDetailsAPI,
  FetchOrganizationListAPI,
  FetchSupportedLanguagesAPI,
  FetchUserDetailsAPI,
  UpdateEmailAPI,
  UpdateProfileAPI,
  setSnackBar,
  UpdateUserRoleAPI,
  FetchUserRolesAPI,
} from "redux/actions";

const EditProfile = () => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    role: "",
    org: "",
    availability: "",
    languages: [],
  });
  const [canEdit, setCanEdit] = useState({
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    username: false,
    role: false,
    org: false,
    availability: false,
    languages: false,
  });
  const [roleIsEdited, setRoleIsEdited] = useState(false);
  const [alertData, setAlertData] = useState();
  const [alertColumn, setAlertColumn] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [orgOwnerId, setOrgOwnerId] = useState("");

  const userData = useSelector((state) => state.getUserDetails.data);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );
  const orgList = useSelector((state) => state.getOrganizationList.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );
  const apiStatus = useSelector((state) => state.apiStatus);
  const userRoles = useSelector((state) => state.getUserRoles.data);

  const getUserRolesList = () => {
    const userObj = new FetchUserRolesAPI();
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    if (loggedInUserData && loggedInUserData.id) {
      const {
        organization: { organization_owner },
      } = loggedInUserData;

      setOrgOwnerId(organization_owner.id);
    }
  }, [loggedInUserData]);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    if (!progress) {
      if (!success) {
        if (apiType === "UPDATE_USER_ROLE") {
          setOpenAlert(true);
          setAlertData(data);
          setAlertColumn("updateRoleAlertColumns");
        }
      }
    }
    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    orgList.forEach((element) => (element.label = element.title));
  }, [orgList]);

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDetailsAPI();
    dispatch(APITransport(loggedInUserObj));
  };

  const getOrgList = () => {
    const apiObj = new FetchOrganizationListAPI();
    dispatch(APITransport(apiObj));
  };

  const getUserData = () => {
    const userObj = new FetchUserDetailsAPI(id);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getUserData();
    getLoggedInUserData();
    getOrgList();
    getUserRolesList();

    const langObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(langObj));
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (userData?.email && userData?.role) {
      setUserDetails(userData);
      setOriginalEmail(userData.email);

      setUserDetails((prev) => ({
        ...prev,
        role: roles.filter((value) => value.value === userData.role)[0],
        org: orgList.filter(
          (value) => value.title === userData?.organization?.title
        )[0],
        availability: availability.filter(
          (value) => value.value === userData.availability_status
        )[0],
        languages: supportedLanguages.filter((item) =>
          userData.languages.includes(item.label)
        ),
      }));
    }
    // eslint-disable-next-line
  }, [userData, orgList, supportedLanguages]);

  const handleFieldChange = (event) => {
    event.preventDefault();

    const {
      target: { name, value },
    } = event;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "role") {
      setRoleIsEdited(true);
    }

    if (name === "email") {
      setEmail(value);
      value !== originalEmail
        ? setEnableVerifyEmail(true)
        : setEnableVerifyEmail(false);
    }
  };

  const handleFieldEdit = (key) => {
    setCanEdit((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleUpdateEmail = () => {
    const apiObj = new UpdateEmailAPI(email);
    dispatch(APITransport(apiObj));
  };

  const handleVerificationSuccess = () => {
    setEnableVerifyEmail(false);
    setOriginalEmail(email);
    dispatch(
      setSnackBar({
        open: true,
        message: "Email successfully updated",
        variant: "success",
      })
    );
  };

  const handleSubmit = () => {
    let updateProfileReqBody = {
      username: userDetails.username,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      phone: userDetails.phone,
      availability_status: userDetails?.availability?.value,
      enable_mail: true,
      role: userDetails?.role?.value,
      languages: userDetails.languages.map((item) => item.label),
    };

    if (loggedInUserData.role === "ADMIN") {
      updateProfileReqBody.organization = userDetails.org.id;
    }

    let apiObj;
    if (
      loggedInUserData.role === "ADMIN" ||
      loggedInUserData.id === orgOwnerId
    ) {
      apiObj = new UpdateProfileAPI(updateProfileReqBody, id);
    } else {
      apiObj = new UpdateProfileAPI(updateProfileReqBody);
    }

    dispatch(APITransport(apiObj));
  };

  const getDisabledOption = (name) => {
    const { id: userId, role } = loggedInUserData;
    
  if (userId === +id ||  loggedInUserData?.role=="ORG_OWNER") {
    if ( role === "ORG_OWNER") {
      return false; 
    } else if (role === "ADMIN" || role === "PROJECT_MANAGER") {
      return name === "org" || name === "availability";
    } else {
      return name === "role" || name === "org" || name === "availability";
    }
  } else {
    return name !== "role";
  }
  };

  const renderTextField = (name) => {
    return (
      <TextField
        fullWidth
        variant="outlined"
        name={name}
        value={userDetails?.[name]}
        onChange={handleFieldChange}
        disabled={!canEdit[name]}
        InputProps={{
          className: classes.inputProfile,
          endAdornment: name === "email" && enableVerifyEmail && (
            <InputAdornment position="end">
              <Button
                variant="text"
                color="primary"
                onClick={handleUpdateEmail}
                sx={{ gap: "4px" }}
              >
                {apiStatus.loading && (
                  <CircularProgress size="1rem" color="primary" />
                )}
                VERIFY EMAIL
              </Button>
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const renderSelect = (name, iterator, multiple) => {
    return (
      <FormControl fullWidth>
        <Select
          multiple={multiple}
          id={`${name}-type-select`}
          name={name}
          value={userDetails?.[name]}
          MenuProps={MenuProps}
          onChange={handleFieldChange}
          disabled={!canEdit[name]}
          sx={{
            "& .MuiSelect-select": {
              fontSize: "1rem !important",
            },
          }}
          renderValue={(selected) => {
            if (multiple) {
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    return <Chip key={value.value} label={value.label} />;
                  })}
                </Box>
              );
            } else {
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.label}
                </Box>
              );
            }
          }}
        >
          {iterator.map((item, index) => (
            <MenuItem key={index} name={name} value={item}>
              {multiple && (
                <Checkbox checked={userDetails?.[name].indexOf(item) > -1} />
              )}
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const profileLabels = useRef([]);
  profileLabels.current = [...profileOptions];

  profileLabels.current.push(
    {
      title: "Role",
      name: "role",
      type: "select",
      iterator: userRoles,
    },
    {
      title: "Organization",
      name: "org",
      type: "select",
      iterator: orgList,
    },
    {
      multiple: true,
      title: "Languages",
      name: "languages",
      type: "select",
      iterator: supportedLanguages,
    }
  );

  const onSubmitClick = () => {
    const { id: userId, role } = loggedInUserData;

    if (userId === +id || loggedInUserData?.role ==="ORG_OWNER" ) {
      if (
        role === "ADMIN" ||
        userId === orgOwnerId ||
        role === "PROJECT_MANAGER"
      ) {
        if (roleIsEdited) {
          updateRole();
        }

        handleSubmit();
      } else {
        handleSubmit();
      }
    } else {
      updateRole();
    }
  };

  const updateRole = async () => {
    setRoleIsEdited(false);

    const body = {

      user_id: id,
      role: userDetails?.role?.value,
    };

    const apiObj = new UpdateUserRoleAPI(body);
    dispatch(APITransport(apiObj));
  };

  return (
    <Fragment>
      <Card className={classes.editProfileParentCard}>
        {profileLabels.current.map((element) => {
          return (
            <Grid className={classes.editProfileParentGrid} container>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                  {element.title}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {element.type === "textField"
                  ? renderTextField(element.name)
                  : renderSelect(
                      element.name,
                      element.iterator,
                      element.multiple
                    )}
              </Grid>

              {(loggedInUserData.id === +id ||
                loggedInUserData.role === "ADMIN" ||
                loggedInUserData.id === orgOwnerId ||
                loggedInUserData.role === "PROJECT_MANAGER") && (
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <Button
                    variant="outlined"
                    className={classes.editProfileBtn}
                    onClick={() => handleFieldEdit(element.name)}
                    disabled={getDisabledOption(element.name)}
                  >
                    <EditIcon className={classes.editIcon} />
                    Edit
                  </Button>
                </Grid>
              )}
            </Grid>
          );
        })}

        {(loggedInUserData.id === +id ||
          loggedInUserData.role === "ADMIN" ||
          loggedInUserData.id === orgOwnerId ||
          loggedInUserData.role === "PROJECT_MANAGER") && (
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ my: 5, px: "9.75%" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmitClick()}
              sx={{ borderRadius: "8px", width: "180px" }}
              className={classes.editProfileBtn}
            >
              Submit
            </Button>
          </Grid>
        )}
      </Card>

      {openAlert && (
        <AlertComponent
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          message={alertData.message}
          report={alertData.data}
          columns={alertColumn}
        />
      )}

      {showEmailDialog && (
        <UpdateEmailDialog
          isOpen={showEmailDialog}
          handleClose={() => setShowEmailDialog(false)}
          oldEmail={userDetails.email}
          newEmail={email}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </Fragment>
  );
};

export default EditProfile;
