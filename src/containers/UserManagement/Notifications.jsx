import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {UpdateProfileAPI,UpdateEmailAPI}from "redux/actions";

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
  const [mail,setmail]= useState(null);
  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );
  const [formFields, setFormFields] = useState({
    dailyEmail: loggedInUser.enable_mail?true:false,
    newsLetterSubscribe: loggedInUser.subscribed_info.subscribed==true?true:false
  });

  const handleSwitchToggleEmail = (prop) => {
    setFormFields((prev) => ({
      ...prev,
      [prop]: !formFields[prop],
    }));
    console.log(formFields.newsLetterSubscribe,formFields.dailyEmail);

    let updateProfileReqBody = {
      enable_mail: !formFields.dailyEmail,
    };


    let apiObj;
    apiObj = new UpdateProfileAPI(updateProfileReqBody, id);


    dispatch(APITransport(apiObj));
console.log(loggedInUser,formFields.dailyEmail);
  };
  const handleSwitchToggleNewsLetter = (prop) => {
    setFormFields((prev) => ({
      ...prev,
      [prop]: !formFields[prop],
    }));      

    if(!formFields.newsLetterSubscribe===false){
      console.log(formFields.newsLetterSubscribe);
       var subscribedetails = {
        email: loggedInUser.mail,
        user_id: Number(id),
        subscribe: !formFields.newsLetterSubscribe
      }
    const newsLetterObj = new NewsletterSubscribe(loggedInUser.email,Number(id), !formFields.newsLetterSubscribe);
    dispatch(APITransport(newsLetterObj));
    }
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
   if( !formFields.newsLetterSubscribe){
    var subscribedetails = {
      email: email,
      user_id: Number(id),
      subscribe: !formFields.newsLetterSubscribe
    }
    console.log(subscribedetails);
  const newsLetterObj = new NewsletterSubscribe(email,Number(id), !formFields.newsLetterSubscribe);
  dispatch(APITransport(newsLetterObj));
  setFormFields((prev) => ({
    ...prev,
    ["newsLetterSubscribe"]: !formFields["newsLetterSubscribe"],
  }));  
   }else{
    
    var subscribedetails = {
      email: email,
      user_id: Number(id),
    }
  const newsLetterObj = new UpdateEmailAPI(email,Number(id));

  dispatch(APITransport(newsLetterObj));
  
   }

  };

  const notificationOptions = [
    {
      title: "Daily Emails",
      name: "dailyEmail",
      label: "Enable daily emails for all the activities",
      tooltipTitle: `${
        formFields.dailyEmail ? "Disable" : "Enable"
      } daily mails`,
      onClick: () => handleSwitchToggleEmail("dailyEmail"),
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
      label: formFields.newsLetterSubscribe==true?`Update Email`: "Enter your email to subscribe",
      tooltipTitle: `${
        formFields.newsLetterSubscribe ? "Disable" : "Enable"
      } newsletter`,
      onClick: () => handleSwitchToggleNewsLetter("newsLetterSubscribe"),
      disabled: !(
        loggedInUser.id === +id ||
        loggedInUser.role === "ADMIN" ||
        loggedInUser.role === "ORG_OWNER"
      ),
      component: (
        <Grid
        justifyContent="flex-end"
        alignItems="center"
        // sx={{ my: 5, px: "9.75%" }}
        position= "relative"
  left= "36%"
  bottom="80px"
        // sx={{ marginLeft: "0", marginTop: "8px" }}
        >
          <NewsLetter susbscribeToNewsLetter={handleSubscribeApiCall} subscribe={!formFields.newsLetterSubscribe}/>
        </Grid>
      ) 
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
