import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import LoginStyle from "../../styles/loginStyle";
import CustomizedSnackbars from "../../common/Snackbar";
import ChangePasswordAPI from "../../redux/actions/api/User/ChangePassword";

const ChangePassword = () => {
  const classes = LoginStyle();

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

  const handleChangePassword = async () => {
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
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.current_password,
        variant: "error",
      });
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
    <Grid container className={classes.loginSecurityGrid}>
      {renderSnackBar()}
      <Box
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="center"
        margin="10px"
      >
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h6" textAlign="center">
            New Password
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            fullWidth
            type={newPassword.visibility ? "text" : "password"}
            value={newPassword.value}
            onChange={(e) =>
              setNewPassword({
                ...newPassword,
                value: e.target.value,
              })
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
      </Box>

      <Box
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="center"
        margin="10px"
      >
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h6" textAlign="center">
            Current Password
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            fullWidth
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
      </Box>

      <Box>
        <Grid container direction="row" justifyContent="center" sx={{ my: 2 }}>
          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: "8px" }}
            onClick={() => handleChangePassword()}
            disabled={newPassword.value && currentPassword.value ? false : true}
          >
            Submit
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ChangePassword;
