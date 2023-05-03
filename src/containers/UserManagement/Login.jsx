import { Box, Grid, Link, ThemeProvider, Button } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { translate } from "../../config/localisation";
import LoginStyle from "../../styles/loginStyle";
import CustomCard from "../../common/Card";
import OutlinedTextField from "../../common/OutlinedTextField";
import themeDefault from "../../theme/theme";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AppInfo from "./AppInfo";
import CustomizedSnackbars from "../../common/Snackbar";
import LoginAPI from "../../redux/actions/api/User/Login";
import FetchLoggedInUserDataAPI from "../../redux/actions/api/User/FetchLoggedInUserDetails";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import Loader from "../../common/Spinner";

const Login = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const accessToken = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

  const navigate = useNavigate();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
    const loggedInUserObj = new FetchLoggedInUserDataAPI();
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
    setLoading(true);

    const apiObj = new LoginAPI(credentials.email, credentials.password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();
    if (res.ok) {
      localStorage.setItem("token", resp.access);
      getLoggedInUserData();
      setLoading(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.detail,
        variant: "error",
      });
      setLoading(false);
    }
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
            {loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>
        </Box>
      </Box>
    </CustomCard>
  );

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          lg={3}
          color={"primary"}
          className={classes.appInfo}
        >
          <AppInfo />
        </Grid>
        <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
          <form autoComplete="off">{renderCardContent()}</form>
        </Grid>
        {renderSnackBar()}
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
