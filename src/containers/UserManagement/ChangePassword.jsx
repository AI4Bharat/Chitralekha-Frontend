import {
  Card,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedTextField from "../../common/OutlinedTextField";
import DatasetStyle from "../../styles/datasetStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChangePasswordAPI from "../../redux/actions/api/User/ChangePassword";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";
import CustomizedSnackbars from "../../common/Snackbar";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
  const [ArrowDownRightIcon, setArrowDownRightIcon] = useState(false);

  // useEffect(() => {
  //   if (apiStatus.message) {
  //     setSnackbarInfo({
  //       ...snackbar,
  //       open: true,
  //       message: apiStatus.current_password,
  //       variant: apiStatus.error ? "error" : "Success",
  //     });
  //   }
  // }, [apiStatus]);

  const handleChangePassword = async () => {
    let apiObj = new ChangePasswordAPI(
      newPassword.value,
      currentPassword.value
    );

    // dispatch(APITransport(apiObj));
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
    <>
      <Grid container direction="row">
        {renderSnackBar()}
        <Card className={classes.workspaceCard}>
          <Grid
            container
            direction="row"
            borderBottom="1px solid rgb(224 224 224)"
            sx={{ p: 3 }}
          >
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
              <Typography variant="h6" sx={{ ml: 5 }}>
                Change password
              </Typography>
              <Typography variant="body1" className={classes.Changepassword}>
                {" "}
                <VpnKeyOutlinedIcon
                  sx={{ transform: "rotate(-70deg)",mr:-0 ,}}
                  fontSize="large"
                />{" "}
                It's a good idea to use a strong password that you're not using
                elsewhere
              </Typography>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
              {ArrowDownRightIcon == false ? (
                <ArrowRightIcon fontSize="large" onClick={()=> setArrowDownRightIcon(true)} sx={{ mt: 2 }} />
              ) : (
                <ArrowDropDownIcon fontSize="large" onClick={()=> setArrowDownRightIcon(false)}sx={{ mt: 2 }} />
              )}
            </Grid>
          </Grid>
          {ArrowDownRightIcon == true && (
            <>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 3 }}
          >
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <Typography variant="h6"> New Password</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <OutlinedTextField
                fullWidth
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
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            borderBottom="1px solid rgb(224 224 224)"
            sx={{ p: 3 }}
          >
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <Typography variant="h6">Current Password</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <OutlinedTextField
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
            <Grid
              container
              direction="row"
              justifyContent="left"
              sx={{ mt: 3, ml: 35 }}
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
          </>
          )}
        </Card>
      </Grid>
    </>
  );
};

export default ChangePassword;
