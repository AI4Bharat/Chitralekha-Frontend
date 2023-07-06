import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { checkPassword } from "utils";

//Styles
import { LoginStyle } from "styles";

//Components
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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CustomizedSnackbars } from "common";

//APIs
import { UpdateMyPasswordAPI } from "redux/actions";

const ChangePassword = () => {
  const classes = LoginStyle();
  const { id } = useParams();

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
    } else if (!checkPassword(formFields.newPassword)) {
      setError({ ...error, newPassword: true });
    } else {
      let apiObj = new UpdateMyPasswordAPI(
        id,
        formFields.newPassword,
        formFields.currentPassword
      );

      const res = await fetch(apiObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
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
      error: "",
    },
    {
      title: "New Password",
      name: "newPassword",
      error: `Minimum length is 8 characters with combination of uppercase, lowercase, number and a special character`,
    },
    {
      title: "Confirm Password",
      name: "confirmPassword",
      error: "New Password and Confirm Password must match.",
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

    setError({
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
              <Typography variant="body1" sx={{fontSize: "1rem"}}>
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
                  className: classes.inputProfile,
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
                <FormHelperText error={true}>{item.error}</FormHelperText>
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
            sx={{ borderRadius: "8px", mr: 2, fontSize: "16px" }}
            onClick={() => handleClearFields()}
          >
            Clear
          </Button>

          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: "8px", fontSize: "16px" }}
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
