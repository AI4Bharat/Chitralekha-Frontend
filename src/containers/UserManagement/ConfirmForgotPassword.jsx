import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  InputAdornment,
  FormHelperText,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import LoginStyle from "../../styles/loginStyle";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import OutlinedTextField from "../../common/OutlinedTextField";
import AppInfo from "./AppInfo";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ConfirmForgotPasswordAPI from "../../redux/actions/api/User/ConfirmForgotPassword";

const ConfirmForgetPassword = () => {
  const classes = LoginStyle();
  const { key, token } = useParams();
  const apiStatus = useSelector((state) => state.apiStatus);

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setError({ ...error, [prop]: false });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (apiStatus.message) {
      setSnackbarInfo({
        ...snackbar,
        open: true,
        message: apiStatus.message,
        variant: apiStatus.error ? "error" : "Success",
      });
    }
    // eslint-disable-next-line
  }, [apiStatus]);

  const handleSubmit = async () => {
    let obj = new ConfirmForgotPasswordAPI(key, token, values.confirmPassword);
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: "Password Updated Successfully!",
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong, please try again",
        variant: "error",
      });
    }
  };

  const handleConfirmForgetPassword = () => {
    if (!(values.password.length > 7)) {
      setError({ ...error, password: true });
    } else if (values.password !== values.confirmPassword) {
      setError({ ...error, confirmPassword: true });
    } else {
      handleSubmit();
      setValues({
        password: "",
        confirmPassword: "",
      });
    }
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
      >
        <Alert severity={snackbar.variant}>{snackbar.message}</Alert>
      </Snackbar>
    );
  };

  const TextFields = () => {
    return (
      <Grid container spacing={4} style={{ marginTop: "2px", width: "40%" }}>
        <Grid>{renderSnackBar()}</Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h3" align="center">
            Confirm Forgot Password
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="password"
            placeholder="Enter your Password."
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            error={error.password ? true : false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon
                    sx={{
                      color: "#75747A",
                      animation: "spin 0.1s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(-225deg)",
                        },
                        "100%": {
                          transform: "rotate(-225deg)",
                        },
                      },
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error.password && (
            <FormHelperText error={true}>
              Minimum length is 8 characters with combination of uppercase,
              lowercase, number and a special character
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            placeholder="Re-enter your Password"
            error={error.confirmPassword ? true : false}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            helperText={error.email ? "this fiels is requird" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon
                    sx={{
                      color: "#75747A",
                      animation: "spin 0.1s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(-225deg)",
                        },
                        "100%": {
                          transform: "rotate(-225deg)",
                        },
                      },
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
          {error.confirmPassword && (
            <FormHelperText error={true}>
              Both password must match.
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button
            fullWidth
            onClick={() => handleConfirmForgetPassword()}
            variant="contained"
          >
            Change Password
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container className={classes.loginGrid}>
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        color={"primary"}
        className={classes.appInfo}
      >
        <AppInfo />
      </Grid>
      <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
        {TextFields()}
      </Grid>
    </Grid>
  );
};

export default ConfirmForgetPassword;
