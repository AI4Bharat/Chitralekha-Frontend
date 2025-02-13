import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { translate } from "config";

//Styles
import { LoginStyle } from "styles";
import { themeDefault } from "theme";

//Components
import { Box, Grid, Link, ThemeProvider, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AppInfo from "./AppInfo";
import {
  CustomCard,
  CustomizedSnackbars,
  Loader,
  OutlinedTextField,
} from "common";

//APIs
import {
  APITransport,
  FetchLoggedInUserDetailsAPI,
  LoginAPI,
  setSnackBar,
} from "redux/actions";

const Login = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const snackbar = useSelector((state) => state.commonReducer.snackbar);

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [isPressed, setIsPressed] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const { progess, success, apiType, data } = apiStatus;

    if (!progess) {
      if (success) {
        if (apiType === "GET_USER_ACCESS_TOKEN") {
          localStorage.setItem("token", data.access);
          getLoggedInUserData();
        }
      } else {
        if (apiType === "GET_USER_ACCESS_TOKEN") {
          dispatch(
            setSnackBar({ open: true, message: data.detail, variant: "error" })
          );
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const keyPress = useCallback((e) => {
    if (e.code === "Enter") {
      if (!isPressed) {
        setIsPressed(true);
        createToken();
      }
    }

    // eslint-disable-next-line
  }, []);

  const keyRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDetailsAPI();
    dispatch(APITransport(loggedInUserObj));
  };

  useEffect(() => {
    if (userData && accessToken) {
      if (userData.role === "ADMIN") {
        navigate(`/admin`);
      } else {
        navigate(`/my-organization/${userInfo?.organization?.id}`);
      }
    }

    // eslint-disable-next-line
  }, [userData]);

  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);
    return () => {
      window.removeEventListener("keydown", keyPress);
      window.removeEventListener("keyup", keyRelease);
    };
  }, [keyPress, keyRelease]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setCredentials((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const createToken = async () => {
    const apiObj = new LoginAPI(credentials.email, credentials.password);
    dispatch(APITransport(apiObj));
  };

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="email"
            onChange={handleFieldChange}
            value={credentials["email"]}
            placeholder={translate("enterEmailId")}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="password"
            type={values.showPassword ? "text" : "password"}
            onChange={handleFieldChange}
            value={credentials["password"]}
            placeholder={translate("enterPassword")}
            InputProps={{
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
        </Grid>
      </Grid>
    );
  };

  const renderCardContent = () => (
    <CustomCard title={"Sign in to Chitralekha"} cardContent={TextFields()}>
      <Box display="flex" flexDirection="column" width="100%">
        <Box marginLeft="auto" marginBottom="10px">
          <Link
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer" }}
          >
            Forgot Password?
          </Link>
        </Box>
        <Box>
          <Button
            fullWidth
            color="primary"
            onClick={() => createToken()}
            variant="contained"
          >
            Login{" "}
            {apiStatus.loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>
        </Box>
      </Box>
    </CustomCard>
  );

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

  return (
    <ThemeProvider theme={themeDefault}>
      {renderSnackBar()}
      <Grid container className={classes.pageWrpr}>
        <Grid item color={"primary"} className={classes.appInfo}>
          <AppInfo />
        </Grid>
        <Grid className={classes.loginForm}>
          <form autoComplete="off">{renderCardContent()}</form>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
