import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {UpdateProfileAPI}from "redux/actions";

//Styles
import { LoginStyle } from "styles";

//Components
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

//APIs
import { APITransport, ToggleMailsAPI, NewsletterSubscribe } from "redux/actions";
import NewsLetter from "./NewsLetterSubscribe";

const Notifications = () => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [formFields, setFormFields] = useState({
    dailyEmail: false,
    newsLetterSubscribe: false
  });

  const handleSwitchToggle = (prop) => {
    setFormFields((prev) => ({
      ...prev,
      [prop]: !formFields[prop],
    }));
    let updateProfileReqBody = {
      enable_mail: !formFields.dailyEmail,
    };


    let apiObj;
    apiObj = new UpdateProfileAPI(updateProfileReqBody, id);


    dispatch(APITransport(apiObj));
console.log(loggedInUser,formFields.dailyEmail);
  };

  useEffect(() => {
    if (formFields.dailyEmail) {
      const mailObj = new ToggleMailsAPI(
        loggedInUser.id,
        formFields.dailyEmail
      );
      dispatch(APITransport(mailObj));
    }
  }, [formFields.dailyEmail]);

  const handleSubscribeApiCall = (email) => {
    const newsLetterObj = new NewsletterSubscribe(email);
    dispatch(APITransport(newsLetterObj));
  };

  const notificationOptions = [
    {
      title: "Daily Emails",
      name: "dailyEmail",
      label: "Enable daily emails for all the activities",
      tooltipTitle: `${
        formFields.dailyEmail ? "Disable" : "Enable"
      } daily mails`,
      onClick: () => handleSwitchToggle("dailyEmail"),
      disabled: !(
        loggedInUser.id === +id ||
        loggedInUser.role === "ADMIN" ||
        loggedInUser.role === "ORG_OWNER"
      ),
      component: <></>,
    },
    {
      title: "Newsletter",
      name: "newsLetterSubscribe",
      label: "Subscribe to Newsletter",
      tooltipTitle: `${
        formFields.newsLetterSubscribe ? "Disable" : "Enable"
      } newsletter`,
      onClick: () => handleSwitchToggle("newsLetterSubscribe"),
      disabled: !(
        loggedInUser.id === +id ||
        loggedInUser.role === "ADMIN" ||
        loggedInUser.role === "ORG_OWNER"
      ),
      component: formFields.newsLetterSubscribe ? (
        <Grid
        display="flex"
        justifyContent="center"
        item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <NewsLetter susbscribeToNewsLetter={handleSubscribeApiCall} />
        </Grid>
      ) : (
        <></>
      ),
    },
  ];

  return (
    <Grid container direction="row">
      <Card className={classes.editProfileParentCard}>
        {notificationOptions.map((element) => {
          return (
            <><Grid container sx={{ p: "40px", justifyContent: "center" }}>
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
            <Grid container sx={{justifyContent: "center" }}>
              {element.component}
              </Grid></>
          );
        })}
      </Card>
    </Grid>
  );
};

export default Notifications;
