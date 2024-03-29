import React, { useState } from "react";
import { useDispatch } from "react-redux";

//Styles
import { LoginStyle } from "styles";

//Components
import { Grid, Typography, Link, Button } from "@mui/material";
import AppInfo from "./AppInfo";
import { OutlinedTextField } from "common";

//APIs
import { APITransport, ForgotPasswordAPI } from "redux/actions";

const ForgotPassword = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

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
            <Link href="/login"style={{ fontSize: "14px" }}>
              Back to Login
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button
            fullWidth
            onClick={() => handleForgotPassword()}
            variant="contained"
          >
            Send link
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

export default ForgotPassword;
