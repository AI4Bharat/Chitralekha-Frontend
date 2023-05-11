import {
  Box,
  Button,
  FormHelperText,
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

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [formFields, setFormFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChangePassword = async () => {
    if (formFields.newPassword !== formFields.confirmPassword) {
      setError({ ...error, confirmPassword: true });
    } else {
      let apiObj = new ChangePasswordAPI(
        formFields.newPassword,
        formFields.currentPassword
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
    }
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

  const changePasswordFields = [
    {
      title: "Current Password",
      name: "currentPassword",
    },
    {
      title: "New Password",
      name: "newPassword",
    },
    {
      title: "Confirm Password",
      name: "confirmPassword",
    },
  ];

  const handleClearFields = () => {
    setFormFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  return (
    <Grid container className={classes.loginSecurityGrid}>
      {renderSnackBar()}

      {changePasswordFields.map((item) => {
        return (
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
            margin="10px"
          >
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Typography variant="h6" textAlign="center">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                fullWidth
                type={visibility[item.name] ? "text" : "password"}
                value={formFields[item.name]}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    [item.name]: e.target.value,
                  })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setVisibility({
                            ...visibility,
                            [item.name]: !visibility[item.name],
                          })
                        }
                      >
                        {visibility[item.name] ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error[item.name] && (
                <FormHelperText error={true}>
                  New Password and Confirm Password must match.
                </FormHelperText>
              )}
            </Grid>
          </Box>
        );
      })}

      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          sx={{ my: 2, px: "17%" }}
        >
          <Button
            autoFocus
            variant="outlined"
            sx={{ borderRadius: "8px", mr: 2 }}
            onClick={() => handleClearFields()}
          >
            Clear
          </Button>

          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: "8px" }}
            onClick={() => handleChangePassword()}
            disabled={
              !formFields.newPassword ||
              !formFields.currentPassword ||
              !formFields.confirmPassword
            }
          >
            Submit
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ChangePassword;
