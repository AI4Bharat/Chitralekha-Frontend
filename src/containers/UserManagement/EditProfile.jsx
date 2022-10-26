import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
  Select,
  OutlinedInput,
  Box,
  Chip,
  MenuItem,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import OutlinedTextField from "../../common/OutlinedTextField";
import React, { useEffect, useState } from "react";
import Snackbar from "../../common/Snackbar";
import UpdateEmailDialog from "../../common/UpdateEmailDialog";

const EditProfile = () => {
  const [initLangs, setInitLangs] = useState([]);
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

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userInfo")));
    setEmail(JSON.parse(localStorage.getItem("userInfo")).email);
  }, []);

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
    setShowEmailDialog(true);
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

  const handleSubmit = () => {};

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
                  // value={UserMappedByRole(userDetails.role)?.name}
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
                  // value={userDetails.organization?.title}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <InputLabel
                  id="lang-label"
                  style={{
                    fontSize: "1.25rem",
                    zIndex: "1",
                    position: "absolute",
                    display: "block",
                    transform: "translate(14px, -9px) scale(0.75)",
                    backgroundColor: "white",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  }}
                >
                  Languages
                </InputLabel>
                <Select
                  multiple
                  fullWidth
                  labelId="lang-label"
                  name="languages"
                  value={userDetails?.languages ? userDetails.languages : []}
                  onChange={handleFieldChange}
                  style={{ zIndex: "0" }}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {initLangs?.length &&
                    initLangs.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                </Select>
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
          handleClose={() =>
            setSnackbarState({ ...snackbarState, open: false })
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          hide={2000}
        />
    </>
  );
};

export default EditProfile;
