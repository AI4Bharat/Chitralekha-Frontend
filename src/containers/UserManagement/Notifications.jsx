import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Styles
import { LoginStyle } from "styles";

//Components
import {
  Card,
  FormControlLabel,
  Grid,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

//APIs
import { APITransport, ToggleMailsAPI } from "redux/actions";

const Notifications = () => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [formFields, setFormFields] = useState({
    dailyEmail: false,
  });

  const handleEmailToggle = async () => {
    setFormFields((prev) => ({
      ...prev,
      dailyEmail: !formFields.dailyEmail,
    }));

    const mailObj = new ToggleMailsAPI(loggedInUser.id, !formFields.dailyEmail);
    dispatch(APITransport(mailObj));
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

  return (
    <Grid container direction="row">
      <Card className={classes.editProfileParentCard}>
        {notificationOptions.map((element) => {
          return (
            <Grid container sx={{ p: "40px", justifyContent: "center" }}>
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
