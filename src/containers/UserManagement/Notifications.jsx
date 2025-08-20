import React, { useState } from "react";
import { LoginStyle } from "styles";
import { Card, Grid, Typography } from "@mui/material";
import DailyEmailToggle from "./DailyEmailToggle";
import NewsLetterEmail from "./NewsLetterEmail";
import NewsLetterCategories from "./NewsLetterCategories";

const Notifications = () => {
  const classes = LoginStyle();
  const [email, setEmail] = useState("");

  const notificationOptions = [
    {
      title: "Daily Emails",
      name: "dailyEmail",
      label: "Enable daily emails for all the activities",
      component: <DailyEmailToggle />,
    },
    {
      title: "Newsletter Email",
      name: "newsLetterEmail",
      label: "Update Subscription Email",
      component: <NewsLetterEmail email={email} setEmail={setEmail} />,
    },
    {
      title: "Newsletter Categories",
      name: "newsLetterCategories",
      label: "Update Subscription Categories",
      component: <NewsLetterCategories email={email} />,
    },
  ];

  return (
    <Grid container direction="row">
      <Card className={classes.editProfileParentCard}>
        {notificationOptions.map((element) => {
          const isFullWidthRow = [
            "dailyEmail",
            "newsLetterEmail",
            "newsLetterCategories",
          ].includes(element.name);
          return (
            <Grid
              container
              className={classes.editProfileParentGrid}
              style={{ justifyContent: "center", padding: "15px" }}
              gap={2}
            >
              <Grid
                item
                xs={12}
                md={isFullWidthRow ? 12 : 4}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"flex-start"}
                justifyContent={"center"}
              >
                <Typography variant="body1">{element.title}</Typography>
                <Typography
                  variant="body1"
                  className={classes.ChangePasswordSubText}
                >
                  {element.label}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                md={isFullWidthRow ? 12 : 8}
                className={isFullWidthRow ? classes.newLetterGridItems : ""}
              >
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
