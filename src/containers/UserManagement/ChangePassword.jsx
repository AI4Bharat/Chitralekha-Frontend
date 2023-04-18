import {
  Card,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedTextField from "../../common/OutlinedTextField";
import DatasetStyle from "../../styles/datasetStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChangePasswordAPI from "../../redux/actions/api/User/ChangePassword";
import CustomizedSnackbars from "../../common/Snackbar"

const ChangePassword = () => {
  const navigate = useNavigate();
  const classes = DatasetStyle();

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

  const handleChangePassword = async() => {
    let apiObj = new ChangePasswordAPI(
      newPassword.value,
      currentPassword.value
    );

   const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.current_password,
        variant: "success",
      })

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.current_password,
        variant: "error",
      })
    }

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

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
      open={snackbar.open}
      handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
      }
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant={snackbar.variant}
      message={[snackbar.message]}
  />
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
