import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateProfileAPI } from "redux/actions";
import UpdateNewsLetterEmailAPI from "../../redux/actions/api/Admin/UpdateNewsLetterEmail";

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
import {
  APITransport,
  ToggleMailsAPI,
  NewsletterSubscribe,
} from "redux/actions";
import NewsLetter from "./NewsLetterSubscribe";

const Notifications = () => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [formFields, setFormFields] = useState({
    dailyEmail: loggedInUser.enable_mail,
    newsLetterSubscribe: loggedInUser.subscribed_info.subscribed,
  });
  const [email, setEmail] = useState("");
  const [orgOwnerId, setOrgOwnerId] = useState("");

  useEffect(() => {
    setEmail(loggedInUser.subscribed_info.email);

    if (loggedInUser && loggedInUser.length) {
      const {
        organization: { organization_owner },
      } = loggedInUser;

      setOrgOwnerId(organization_owner.id);
    }
  }, [loggedInUser]);

  const handleSwitchToggleEmail = (prop) => {
    setFormFields((prev) => ({
      ...prev,
      [prop]: !formFields[prop],
    }));

    let updateProfileReqBody = {
      enable_mail: !formFields.dailyEmail,
    };

    const apiObj = new UpdateProfileAPI(updateProfileReqBody, id);
    dispatch(APITransport(apiObj));

    const mailObj = new ToggleMailsAPI(loggedInUser.id, formFields.dailyEmail);
    dispatch(APITransport(mailObj));
  };

  const handleSubscribeApiCall = (type) => {
    if (type === "update") {
      const newsLetterObj = new UpdateNewsLetterEmailAPI(email, +id);
      dispatch(APITransport(newsLetterObj));
    } else if (type === "subscribe") {
      setFormFields((prev) => ({
        ...prev,
        newsLetterSubscribe: true,
      }));

      const newsLetterObj = new NewsletterSubscribe(email, +id, true);
      dispatch(APITransport(newsLetterObj));
    } else {
      setFormFields((prev) => ({
        ...prev,
        newsLetterSubscribe: false,
      }));
      setEmail("");

      const newsLetterObj = new NewsletterSubscribe(email, +id, false);
      dispatch(APITransport(newsLetterObj));
    }
  };

  const notificationOptions = [
    {
      title: "Daily Emails",
      name: "dailyEmail",
      label: "Enable daily emails for all the activities",
      component: (
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
            title={`${
              formFields.dailyEmail ? "Disable" : "Enable"
            } daily mails`}
            sx={{ marginLeft: "0", marginTop: "8px" }}
          >
            <FormControlLabel
              control={<Switch color="primary" />}
              checked={formFields.dailyEmail}
              onChange={() => handleSwitchToggleEmail("dailyEmail")}
              disabled={
                !(
                  loggedInUser.id === +id ||
                  loggedInUser.role === "ADMIN" ||
                  loggedInUser.id === orgOwnerId
                )
              }
            />
          </Tooltip>
        </Grid>
      ),
    },
    {
      title: "Newsletter",
      name: "newsLetterSubscribe",
      label:
        formFields.newsLetterSubscribe === true
          ? `Unsubscribe or Update Email `
          : "Enter your email to subscribe",
      component: (
        <NewsLetter
          susbscribeToNewsLetter={handleSubscribeApiCall}
          subscribe={formFields.newsLetterSubscribe}
          email={email}
          setEmail={setEmail}
        />
      ),
    },
  ];

  return (
    <Grid container direction="row">
      <Card className={classes.editProfileParentCard}>
        {notificationOptions.map((element) => {
          return (
            <Grid container sx={{ justifyContent: "center", p: "40px" }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography variant="body1">{element.title}</Typography>
                <Typography
                  variant="body1"
                  className={classes.ChangePasswordSubText}
                >
                  {element.label}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {element.component}
              </Grid>
            </Grid>
          );
        })}
      </Card>
    </Grid>
  );
};

export default Notifications;
