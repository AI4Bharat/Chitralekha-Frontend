import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Link,
  InputAdornment,
  FormHelperText,
  IconButton,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  OutlinedInput,
  Box,
  Chip,
  FormControl,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OutlinedTextField from "../../common/OutlinedTextField";
import LoginStyle from "../../styles/loginStyle";
import AppInfo from "./AppInfo";
import CustomizedSnackbars from "../../common/Snackbar";
import SignupAPI from "../../redux/actions/api/User/Signup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";
import FetchInviteUserInfoAPI from "../../redux/actions/api/User/FetchInviteUserInfo";
import { MenuProps } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import Loader from "../../common/Spinner";

const SignUp = () => {
  let navigate = useNavigate();
  const { invitecode } = useParams();
  const classes = LoginStyle();
  const dispatch = useDispatch();

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );
  const userInfo = useSelector((state) => state.getInviteUserInfo.data);

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    UserName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    languages: [],
    showPassword: false,
    showConfirmPassword: false,
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [error, setError] = useState({
    userName: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    languages: false,
  });
  const [phoneErrorText, setPhoneErrorText] = useState("");

  useEffect(() => {
    if (userInfo.email) {
      setValues({
        ...values,
        email: userInfo.email,
        UserName: userInfo.username,
      });
    }
    // eslint-disable-next-line
  }, [userInfo]);

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    if (prop === "phone") {
      const regex = /^[0-9\b]+$/;
      const test = regex.test(event.target.value);

      if (event.target.value === "" || test) {
        setValues({ ...values, [prop]: event.target.value });
        setError({ ...error, [prop]: false });
      }
    } else {
      setValues({ ...values, [prop]: event.target.value });
      setError({ ...error, [prop]: false });
    }
  };

  useEffect(() => {
    const apiObj = new FetchInviteUserInfoAPI(invitecode);
    dispatch(APITransport(apiObj));

    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));

    // eslint-disable-next-line
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    const data = {
      username: values.UserName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      first_name: values.firstName,
      last_name: values.lastName,
      languages: values.languages.map((item) => item.label),
    };

    let apiObj = new SignupAPI(invitecode, data);

    let rsp_data;
    fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        rsp_data = await response.json();
        setLoading(false);

        if (!response.ok) {
          return Promise.reject("");
        } else {
          setSnackbarInfo({
            ...snackbar,
            open: true,
            message: rsp_data.message,
            variant: "success",
          });
          localStorage.clear();
          navigate("/");
          setValues({
            UserName: "",
            email: "",
            password: "",
            phone: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            languages: [],
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: rsp_data.message,
          variant: "error",
        });
      });
  };

  const ValidateEmail = (mail) => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const HandleSubmitValidate = () => {
    if (!ValidateEmail(values.email)) {
      setError({ ...error, email: true });
    } else if (values.phone === "") {
      setError({ ...error, phone: true });
      setPhoneErrorText("Please enter a phone number");
    } else if (values.phone.length === 10) {
      setError({ ...error, phone: true });
      setPhoneErrorText("Please enter a valid phone number");
    } else if (values.UserName === "") {
      setError({ ...error, userName: true });
    } else if (values.firstName === "") {
      setError({ ...error, firstName: true });
    } else if (values.lastName === "") {
      setError({ ...error, lastName: true });
    } else if (!(values.password.length > 7)) {
      setError({ ...error, password: true });
    } else if (values.password !== values.confirmPassword) {
      setError({ ...error, confirmPassword: true });
    } else if (values.languages.length <= 0) {
      setError({ ...error, languages: true });
    } else {
      handleSubmit();
      setLoading(true);
    }
  };

  const handleAlreadyhaveaccount = () => {
    localStorage.clear();
    navigate("/");
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
        message={snackbar.message}
      />
    );
  };

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ width: "40%" }}>
        <Grid>{renderSnackBar()}</Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h3" align="center">
            Create new account
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            disabled
            name="email"
            placeholder="Enter your Email ID."
            onChange={handleChange("email")}
            error={error.email ? true : false}
            value={values.email}
            helperText={error.email ? "Invalid email" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="phone"
            placeholder="Enter your Phone Number."
            onChange={handleChange("phone")}
            error={error.phone ? true : false}
            value={values.phone}
            helperText={error.phone ? phoneErrorText : ""}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="name"
            placeholder="Enter your Username."
            onChange={handleChange("UserName")}
            error={error.userName ? true : false}
            value={values.UserName}
            helperText={error.userName ? "Please enter username" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="firstName"
            placeholder="Enter your First Name."
            onChange={handleChange("firstName")}
            value={values.firstName}
            error={error.firstName ? true : false}
            helperText={error.firstName ? "Please enter your first name" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="lastName"
            placeholder="Enter your Last Name."
            onChange={handleChange("lastName")}
            value={values.lastName}
            error={error.lastName ? true : false}
            helperText={error.lastName ? "Please enter your last name" : ""}
          />
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
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
            name="password"
            placeholder="Re-enter your Password."
            type={values.showConfirmPassword ? "text" : "password"}
            error={error.confirmPassword ? true : false}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            helperText={
              error.confirmPassword ? "Both password must match." : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showConfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl fullWidth error={error.languages ? true : false}>
            <Select
              fullWidth
              displayEmpty
              id="language-select"
              multiple
              name="languages"
              value={values.languages}
              onChange={handleChange("languages")}
              input={<OutlinedInput />}
              error={error.languages ? true : false}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Box>Select Languages</Box>;
                }

                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      return <Chip key={value.value} label={value.label} />;
                    })}
                  </Box>
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ "aria-label": "Without label" }}
            >
              {supportedLanguages.map((item, index) => (
                <MenuItem key={index} value={item}>
                  <Checkbox checked={values.languages.indexOf(item) > -1} />
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Select>
            {error.languages && (
              <FormHelperText>
                Please select atleast one language
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button
            fullWidth
            onClick={() => HandleSubmitValidate()}
            variant="contained"
          >
            Submit
          </Button>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className={classes.createLogin}>
            <Typography variant={"body2"} className={classes.Typo}>
              Already have an account ?
            </Typography>
            <Typography variant={"body2"}>
              <Link
                className={classes.link}
                onClick={handleAlreadyhaveaccount}
                style={{ fontSize: "14px" }}
              >
                Sign in
                {loading && (
                  <Loader size={20} margin="0 0 0 10px" color="secondary" />
                )}
              </Link>
            </Typography>
          </div>
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

export default SignUp;
