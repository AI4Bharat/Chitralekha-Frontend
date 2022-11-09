import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import OutlinedTextField from "../../common/OutlinedTextField";
import React, { useEffect, useState } from "react";
import Snackbar from "../../common/Snackbar";
import UpdateEmailDialog from "../../common/UpdateEmailDialog";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../redux/actions/api/User/FetchLoggedInUserDetails";
import { roles } from "../../utils/utils";
import UpdateEmailAPI from "../../redux/actions/api/User/UpdateEmail";
import UpdateProfileAPI from "../../redux/actions/api/User/UpdateProfile";

const EditProfile = () => {
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
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI();
    dispatch(APITransport(loggedInUserObj));
  };

  useEffect(() => {
    getLoggedInUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserDetails(userData);
      setEmail(userData.email);
      setOriginalEmail(userData.email);
    }
  }, [userData]);

  const getRoles = () => {
    const res = roles.filter((value) =>
      value.id === userDetails?.role ? value.type : ""
    );
    return res[0]?.type;
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
    const updateProfileReqBody = {
      username: userDetails.username,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      languages: userDetails.languages,
      phone: userDetails.phone,
      availability_status: userDetails.availability_status,
    };

    const apiObj = new UpdateProfileAPI(updateProfileReqBody);
    dispatch(APITransport(apiObj));
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
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Edit Profile
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="First Name"
                name="first_name"
                value={userDetails?.first_name}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={userDetails?.last_name}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Email"
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
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Phone"
                name="phone"
                value={userDetails?.phone}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Role"
                value={getRoles()}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                required
                fullWidth
                label="Username"
                name="username"
                value={userDetails?.username}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Organization"
                value={userDetails?.organization?.title}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Availability Status"
                name="availability_status"
                value={userDetails?.availability_status}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
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
                onClick={handleSubmit}
              >
                Update Profile
              </Button>
            </Grid>
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
