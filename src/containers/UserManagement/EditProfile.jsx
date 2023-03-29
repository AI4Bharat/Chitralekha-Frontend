import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import OutlinedTextField from "../../common/OutlinedTextField";
import React, { useEffect, useState } from "react";
import Snackbar from "../../common/Snackbar";
import UpdateEmailDialog from "../../common/UpdateEmailDialog";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../redux/actions/api/User/FetchLoggedInUserDetails";
import FetchUserDetailsAPI from "../../redux/actions/api/User/FetchUserDetails";
import { MenuProps, roles } from "../../utils/utils";
import UpdateEmailAPI from "../../redux/actions/api/User/UpdateEmail";
import UpdateProfileAPI from "../../redux/actions/api/User/UpdateProfile";
import { useParams } from "react-router-dom";
import FetchOrganizationListAPI from "../../redux/actions/api/Organization/FetchOrganizationList";
import { Box } from "@mui/system";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";
import UpdateMemberPasswordAPI from "../../redux/actions/api/Admin/UpdateMemberPassword";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";

const EditProfile = () => {
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
  const [userDetails, setUserDetails] = useState(null);
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [showChangePassword, setShowChangePassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [editfirstName, setEditfirstName] = useState(false);
  const [editlastName, setEditlastName] = useState(false);
  const [editemail, setEditemail] = useState(false);
  const [editrole, setEditrole] = useState(false);
  const [editphoneNumber, setEditphoneNumber] = useState(false);
  const [editusername, setEditusername] = useState(false);
  const [editavailabilityStatus, setEditavailabilityStatus] = useState(false);
  const [editorganization, setEditorganization] = useState(false);
  const [editlanguage, setEditlanguage] = useState(false);

  const userData = useSelector((state) => state.getUserDetails.data);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );
  const orgList = useSelector((state) => state.getOrganizationList.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

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
  }, []);

  useEffect(() => {
    if (userData?.email && userData?.role && userData?.organization) {
      setUserDetails(userData);
      setEmail(userData.email);
      setOriginalEmail(userData.email);
      setRole(roles.filter((value) => value.value === userData?.role)[0]);
      setOrganization(userData.organization);
      setAvailabilityStatus(userData?.availability_status);
      setLanguage(
        supportedLanguages.filter((item) =>
          userData.languages.includes(item.label)
        )
      );
    }
  }, [userData]);

  const getRoles = () => {
    const res = roles.filter((value) =>
      value.value === userDetails?.role ? value.label : ""
    );
    return res[0]?.label;
  };

  const handleFieldChange = (event) => {
    event.preventDefault();
    setUserDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEmailChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
    event.target.value !== originalEmail
      ? setEnableVerifyEmail(true)
      : setEnableVerifyEmail(false);
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

  const handleEmailDialogClose = () => {
    setShowEmailDialog(false);
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
      availability_status: availabilityStatus,
      enable_mail: true,
      role: role.value,
      languages: language.map((item) => item.label),
    };

    if (loggedInUserData.role === "ADMIN") {
      updateProfileReqBody.organization = organization.id;
    }

    if (
      loggedInUserData.role === "ADMIN" ||
      loggedInUserData.role === "ORG_OWNER"
    ) {
      const apiObj = new UpdateProfileAPI(updateProfileReqBody, id);
      dispatch(APITransport(apiObj));
    } else {
      const apiObj = new UpdateProfileAPI(updateProfileReqBody);
      dispatch(APITransport(apiObj));
    }
  };

  const handlePasswordUpdate = () => {
    const apiObj = new UpdateMemberPasswordAPI(userDetails?.newPassword, id);

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

  const handleEditFirstName = () => {
    setEditfirstName(true);
  };

  const handleEditLastName = () => {
    setEditlastName(true);
  };
  const handleEditemail = () => {
    setEditemail(true);
  };
  const handleEditrole = () => {
    setEditrole(true);
  };
  const handleEditphoneNumber = () => {
    setEditphoneNumber(true);
  };
  const handleEditusername = () => {
    setEditusername(true);
  };
  const handleEditOrganization = () => {
    setEditorganization(true);
  };

  const handleEditavailabilityStatus = () => {
    setEditavailabilityStatus(true);
  };

  const handleEditlanguage = () => {
    setEditlanguage(true);
  };
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: "100%",
            minHeight: 500,
            padding: 5,
            borderRadius: "5px"
          }}
        >
          <Grid container spacing={4}>
            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Edit Profile
              </Typography>
            </Grid> */}

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6"> First Name:</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editfirstName == true ? (
                  <OutlinedTextField
                    fullWidth
                    focused
                    name="first_name"
                    value={userDetails?.first_name}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <OutlinedTextField
                    fullWidth
                    name="first_name"
                    value={userDetails?.first_name}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditFirstName}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Last Name:</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editlastName == true ? (
                  <OutlinedTextField
                    fullWidth
                    focused
                    name="last_name"
                    value={userDetails?.last_name}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <OutlinedTextField
                    fullWidth
                    name="last_name"
                    value={userDetails?.last_name}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditLastName}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Email :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editemail == true ? (
                  <>
                    <OutlinedTextField
                       focused
                      fullWidth
                      value={email}
                      onChange={handleEmailChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: enableVerifyEmail && (
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
                    {showEmailDialog && (
                      <UpdateEmailDialog
                        isOpen={showEmailDialog}
                        handleClose={handleEmailDialogClose}
                        oldEmail={userDetails.email}
                        newEmail={email}
                        onSuccess={handleVerificationSuccess}
                      />
                    )}
                  </>
                ) : (
                  <OutlinedTextField
                    fullWidth
                    name="last_name"
                    value={userDetails?.email}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditemail}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

          
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Phone Number :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editphoneNumber == true ? (
                  <OutlinedTextField
                    fullWidth
                    focused
                    name="phone"
                    value={userDetails?.phone}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <OutlinedTextField
                    fullWidth
                    name="phone"
                    value={userDetails?.phone}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditphoneNumber}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Role :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {loggedInUserData.role === "ADMIN" ||
              loggedInUserData.role === "ORG_OWNER" && editrole == true? (
                <FormControl fullWidth>
                  <Select
                    labelId="role-type"
                    id="role-type_select"
                    value={role}
                    MenuProps={MenuProps}
                    onChange={(event) => setRole(event.target.value)}
                    renderValue={(selected) => {
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.label}
                        </Box>
                      );
                    }}
                  >
                    {roles.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <OutlinedTextField
                  disabled
                  fullWidth
                  value={userData?.role_label}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditrole}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

          

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">User Name :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editusername == true ? (
                  <OutlinedTextField
                    required
                    focused
                    fullWidth
                    name="username"
                    value={userDetails?.username}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <OutlinedTextField
                    required
                    fullWidth
                    name="username"
                    value={userDetails?.username}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditusername}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Organization :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {editorganization == true ? (
                  <FormControl fullWidth>
                    <Select
                      disabled={
                        loggedInUserData.role === "ADMIN" ? false : true
                      }
                      labelId="org-type"
                      id="org-type_select"
                      value={organization}
                      MenuProps={MenuProps}
                      onChange={(event) => setOrganization(event.target.value)}
                      renderValue={(selected) => {
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.title}
                          </Box>
                        );
                      }}
                    >
                      {orgList.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <OutlinedTextField
                    required
                    fullWidth
                    name="username"
                    value={userDetails?.username}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  disabled={loggedInUserData.role === "ADMIN" ? false : true}
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditOrganization}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6"> Availability Status :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth>
                  <Select
                    disabled={editavailabilityStatus == true ? false : true}
                    labelId="availability-status-type"
                    id="availability-status-type_select"
                    value={availabilityStatus}
                    MenuProps={MenuProps}
                    name="availability_status"
                    onChange={(event) =>
                      setAvailabilityStatus(event.target.value)
                    }
                  >
                    <MenuItem key={1} value={1}>
                      true
                    </MenuItem>
                    <MenuItem key={0} value={0}>
                      false
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditavailabilityStatus}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 3 }}
            >
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="h6">Languages :</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth>
                  <Select
                    multiple
                    disabled={
                      loggedInUserData.role === "ADMIN" ||
                      (loggedInUserData.role === "ORG_OWNER" &&
                        editlanguage == true)
                        ? false
                        : true
                    }
                    labelId="languages"
                    id="languages_select"
                    value={language}
                    name="languages"
                    onChange={(e) => setLanguage(e.target.value)}
                    MenuProps={MenuProps}
                    renderValue={(selected) => {
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            return (
                              <Chip key={value.value} label={value.label} />
                            );
                          })}
                        </Box>
                      );
                    }}
                  >
                    {supportedLanguages?.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        <Checkbox checked={language.indexOf(item) > -1} />
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                    ml: 20,
                    width: "120px",
                  }}
                  onClick={handleEditlanguage}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              </Grid>
            </Grid>

            <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{mt:7}}
        >
          <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ borderRadius: "8px",width:"180px" }}
              >
                Submit
              </Button>
        </Grid>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              style={{ marginTop: 20 }}
            >
             
            </Grid>

            {loggedInUserData.role === "ADMIN" && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showChangePassword}
                        onChange={(event) =>
                          setShowChangePassword(event.target.checked)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Change Password"
                  />
                </FormGroup>
              </Grid>
            )}

            {showChangePassword && (
              <>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <OutlinedTextField
                    required
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    value={userDetails?.newPassword}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                    type={showPassword.password ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                password: !showPassword.password,
                              })
                            }
                          >
                            {showPassword.password ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <OutlinedTextField
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    value={userDetails?.confirmPassword}
                    onChange={handleFieldChange}
                    InputLabelProps={{ shrink: true }}
                    type={showPassword.confirmPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                confirmPassword: !showPassword.confirmPassword,
                              })
                            }
                          >
                            {showPassword.confirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  style={{ marginTop: 20 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordUpdate}
                    disabled={
                      !userDetails?.newPassword || !userDetails?.confirmPassword
                    }
                    sx={{ borderRadius: "8px" }}
                  >
                    Update Password
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      </Grid>
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        hide={2000}
      />
    </>
  );
};

export default EditProfile;
