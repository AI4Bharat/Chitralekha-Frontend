import React, { useEffect, useState } from "react";
import { Grid, Typography, Link, Snackbar, Alert } from "@mui/material";
import Button from "../../common/Button";
import OutlinedTextField from "../../common/OutlinedTextField";
import AppInfo from "./AppInfo";
import { useDispatch, useSelector } from "react-redux";
import LoginStyle from "../../styles/loginStyle";
import ForgotPasswordAPI from "../../redux/actions/api/User/ForgotPassword";
import APITransport from "../../redux/actions/apitransport/apitransport";

const ForgotPassword = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
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

  const handleChange = (value) => {
    setEmail(value);
    setError(false);
  };

  const handleSubmit = () => {
    let obj = new ForgotPasswordAPI(email);
    dispatch(APITransport(obj));
  };

  const ValidateEmail = (mail) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      );
    if (regex) {
      return true;
    }
    return false;
  };

  const handleForgotPassword = () => {
    if (!ValidateEmail(email)) {
      setError(true);
    } else {
      handleSubmit();
      setEmail("");
    }
  };

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px", width: "40%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h3">Forgot password?</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="body2" className={classes.subTypo}>
            Enter you email address and we will send a link to reset your
            password.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="email"
            placeholder="Enter your Email ID."
            onChange={(event) => handleChange(event.target.value)}
            error={error ? true : false}
            value={email}
            helperText={error ? "Invalid email" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
          <Typography>
            <Link href="/" style={{ fontSize: "14px" }}>
              Back to Login
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button
            fullWidth
            label={"Send link"}
            onClick={handleForgotPassword}
          />
        </Grid>
      </Grid>
    );
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
        autoHideDuration={6000}
      >
        <Alert severity={snackbar.variant}>{snackbar.message}</Alert>
      </Snackbar>
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
        {renderSnackBar()}
        {TextFields()}
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
