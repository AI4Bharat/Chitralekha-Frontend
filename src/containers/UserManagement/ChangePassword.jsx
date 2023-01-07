import {
  Card,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OutlinedTextField from "../../common/OutlinedTextField";
import DatasetStyle from "../../styles/Dataset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChangePasswordAPI from "../../redux/actions/api/User/ChangePassword";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);

  const [currentPassword, setCurrentPassword] = useState({
    value: "",
    visibility: false,
  });
  const [newPassword, setNewPassword] = useState({
    value: "",
    visibility: false,
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    if (apiStatus.message) {
      setSnackbarInfo({
        ...snackbar,
        open: true,
        message: apiStatus.message,
        variant: apiStatus.error ? "error" : "Success",
      });
    }
  }, [apiStatus]);

  const handleChangePassword = () => {
    let apiObj = new ChangePasswordAPI(
      newPassword.value,
      currentPassword.value
    );

    dispatch(APITransport(apiObj));
  };

  const handleClickShowCurrentPassword = () => {
    setCurrentPassword({
      ...currentPassword,
      visibility: !currentPassword.visibility,
    });
  };

  const handleClickShowNewPassword = () => {
    setNewPassword({ ...newPassword, visibility: !newPassword.visibility });
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo({
      ...snackbar,
      open: false,
    });
  };

  const renderSnackBar = () => {
    return (
      <Snackbar
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.variant}>{snackbar.message}</Alert>
      </Snackbar>
    );
  };

  return (
    <>
      <Grid container direction="row">
        {renderSnackBar()}
        <Card className={classes.workspaceCard}>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Change Password
              </Typography>
            </Grid>

            <Grid container direction="row">
              <Grid
                items
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className={classes.projectsettingGrid}
              >
                <Typography gutterBottom component="div" label="Required">
                  New Password*:
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  placeholder="Enter New Password"
                  type={newPassword.visibility ? "text" : "password"}
                  value={newPassword.value}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, value: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowNewPassword}>
                          {newPassword.visibility ? (
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
            </Grid>

            <Grid
              className={classes.projectsettingGrid}
              items
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Current Password*:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                placeholder="Enter Current Password"
                type={currentPassword.visibility ? "text" : "password"}
                value={currentPassword.value}
                onChange={(e) =>
                  setCurrentPassword({
                    ...currentPassword,
                    value: e.target.value,
                  })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowCurrentPassword}>
                        {currentPassword.visibility ? (
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
              className={classes.projectsettingGrid}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2 }}
            >
              <Button
                autoFocus
                variant="contained"
                sx={{ borderRadius: "8px" }}
                onClick={() => handleChangePassword()}
                disabled={
                  newPassword.value && currentPassword.value ? false : true
                }
              >
                Submit
              </Button>

              <Button
                onClick={() => navigate(`/projects`)}
                sx={{ borderRadius: "8px", ml: 2 }}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default ChangePassword;
