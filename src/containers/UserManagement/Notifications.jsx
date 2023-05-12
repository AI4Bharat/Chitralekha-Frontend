import {
  Card,
  FormControlLabel,
  Grid,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import LoginStyle from "../../styles/loginStyle";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ToggleMailsAPI from "../../redux/actions/api/User/ToggleMails";
import CustomizedSnackbars from "../../common/Snackbar";

const Notifications = () => {
  const classes = LoginStyle();
  const { id } = useParams();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [formFields, setFormFields] = useState({
    dailyEmail: false,
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    variant: "",
  });

  const handleEmailToggle = async () => {
    setFormFields((prev) => ({
      ...prev,
      dailyEmail: !formFields.dailyEmail,
    }));

    const mailObj = new ToggleMailsAPI(loggedInUser.id, !formFields.dailyEmail);
    const res = await fetch(mailObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(mailObj.getBody()),
      headers: mailObj.getHeaders().headers,
    });
    const resp = await res.json();

    if (res.ok) {
      setSnackbarState({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarState({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const notificationOptions = [
    {
      title: "Daily Emails",
      name: "dailyEmail",
      label: "Enable daily emails for all the activities",
      tooltipTitle: `${
        formFields.dailyEmails ? "Disable" : "Enable"
      } daily mails`,
      onClick: () => handleEmailToggle(),
      disabled: !(
        loggedInUser.id === +id ||
        loggedInUser.role === "ADMIN" ||
        loggedInUser.role === "ORG_OWNER"
      ),
    },
  ];

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbarState.open}
        handleClose={() =>
          setSnackbarState({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbarState.variant}
        message={snackbarState.message}
      />
    );
  };

  return (
    <Grid container direction="row">
      {renderSnackBar()}

      <Card className={classes.editProfileParentCard}>
        {notificationOptions.map((element) => {
          return (
            <Grid container sx={{p: "40px", justifyContent: "center"}}>
              <Grid item xs={12} sm={12} md={3} lg={4} xl={4}>
                <Typography variant="body1">{element.title}</Typography>
                <Typography
                  variant="body1"
                  className={classes.ChangePasswordSubText}
                >
                  {element.label}
                </Typography>
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                xl={4}
              >
                <Tooltip
                  title={element.tooltipTitle}
                  sx={{ marginLeft: "0", marginTop: "8px" }}
                >
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    checked={formFields[element.name]}
                    onChange={element.onClick}
                    disabled={element.disabled}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          );
        })}
      </Card>
    </Grid>
  );
};

export default Notifications;
