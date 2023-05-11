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
import React, { Fragment, useEffect, useRef, useState } from "react";
import Snackbar from "../../common/Snackbar";
import UpdateEmailDialog from "../../common/UpdateEmailDialog";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../redux/actions/api/User/FetchLoggedInUserDetails";
import FetchUserDetailsAPI from "../../redux/actions/api/User/FetchUserDetails";
import {
  MenuProps,
  availability,
  roles,
} from "../../utils/utils";
import UpdateEmailAPI from "../../redux/actions/api/User/UpdateEmail";
import UpdateProfileAPI from "../../redux/actions/api/User/UpdateProfile";
import { useParams } from "react-router-dom";
import FetchOrganizationListAPI from "../../redux/actions/api/Organization/FetchOrganizationList";
import { Box } from "@mui/system";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";
import EditIcon from "@mui/icons-material/Edit";
import LoginStyle from "../../styles/loginStyle";
import { profileOptions } from "../../config/profileConfigs";

const EditProfile = () => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    variant: "",
  });
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState("");
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

  const userData = useSelector((state) => state.getUserDetails.data);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );
  const orgList = useSelector((state) => state.getOrganizationList.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  useEffect(() => {
    orgList.forEach((element) => (element.label = element.title));
  }, [orgList]);

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI();
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

    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userData?.email && userData?.role && userData?.organization) {
      setUserDetails(userData);
      setOriginalEmail(userData.email);

      setUserDetails((prev) => ({
        ...prev,
        role: roles.filter((value) => value.value === userData.role)[0],
        org: orgList.filter(
          (value) => value.title === userData.organization.title
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
    setUserDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "email") {
      setEmail(event.target.value);
      event.target.value !== originalEmail
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
    setEmailVerifyLoading(true);
    const apiObj = new UpdateEmailAPI(email);

    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        setEmailVerifyLoading(false);
        if (!res.ok) throw await res.json();
        else return await res.json();
      })
      .then((res) => {
        setSnackbarState({
          open: true,
          message: res.message,
          variant: "success",
        });
        setShowEmailDialog(true);
      })
      .catch((err) => {
        setSnackbarState({
          open: true,
          message: err.message,
          variant: "error",
        });
      });
  };

  const handleVerificationSuccess = () => {
    setEnableVerifyEmail(false);
    setOriginalEmail(email);
    setSnackbarState({
      open: true,
      message: "Email successfully updated",
      variant: "success",
    });
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
      loggedInUserData.role === "ORG_OWNER"
    ) {
      apiObj = new UpdateProfileAPI(updateProfileReqBody, id);
    } else {
      apiObj = new UpdateProfileAPI(updateProfileReqBody);
    }

    fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        else return await res.json();
      })
      .then((res) => {
        setSnackbarState({
          open: true,
          message: res.message,
          variant: "success",
        });
      })
      .catch((err) => {
        setSnackbarState({
          open: true,
          message: err.message,
          variant: "error",
        });
      });
  };

  const getDisabledOption = (name, value) => {
    if (name === "role" || name === "languages") {
      if (
        loggedInUserData.role === "ADMIN" ||
        loggedInUserData.role === "ORG_OWNER"
      ) {
        return !value;
      } else {
        return true;
      }
    } else {
      return !value;
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
          endAdornment: name === "email" && enableVerifyEmail && (
            <InputAdornment position="end">
              <Button
                variant="text"
                color="primary"
                onClick={handleUpdateEmail}
                sx={{ gap: "4px" }}
              >
                {emailVerifyLoading && (
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
          disabled={getDisabledOption(name, canEdit[name])}
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

  return (
    <Fragment>
      <Card className={classes.editProfileParentCard}>
        {profileLabels.current.map((element) => {
          return (
            <Grid className={classes.editProfileParentGrid} container>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">{element.title}</Typography>
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

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  className={classes.editProfileBtn}
                  onClick={() => handleFieldEdit(element.name)}
                >
                  <EditIcon className={classes.editIcon} />
                  Edit
                </Button>
              </Grid>
            </Grid>
          );
        })}

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ my: 5, px: "9.5%" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ borderRadius: "8px", width: "180px" }}
          >
            Submit
          </Button>
        </Grid>
      </Card>

      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        hide={2000}
      />

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
