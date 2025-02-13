import React from "react";

//Styles
import { IntroDatasetStyle } from "styles";
import { introTheme } from "theme";

//Components
import { Grid, Typography, ThemeProvider } from "@mui/material";
import { Scalable, Dynamic, Elegant, Extensible } from "assets/index";

const Principles = () => {
  const classes = IntroDatasetStyle();

  const PrinciplesDetailsArray = [
    {
      heading: "Scalable",
      description:
        "Chitralekha has a modular & micro-service based architecture and uses a message queue to orchestrate the tasks & workflows. Containerization provides the option to scale the application to infinity.",
      image: Scalable,
    },
    {
      heading: "Dynamic",
      description:
        "Chitralekha provides an option to dynamically pick the models of your choice. It also provides the It also provides the option to pick up the tasks like transcription, translation and voice-over",
      image: Dynamic,
    },
    {
      heading: "Extensible",
      description:
        "Any new models can be plugged in to the system and micro-service & cloud-agnostic based architecture gives flexibility to extend other capabilities with minimal code changes",
      image: Extensible,
    },
    {
      heading: "Elegant",
      description:
        "Chitralekha portal is simple and explicit. Role based hierarchical gives the flexibility to work both as a team or individual. Most of the configurations and features can be easily tuned.",
      image: Elegant,
    },
  ];

  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid item className={classes.principleTilesWrpr}>
          <Typography variant="h4" className={classes.titles}>
            Principles
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            {PrinciplesDetailsArray.map((item, index) => {
              return (
                <Grid item className={classes.tilesWrpr} key={index}>
                  <img
                    src={item.image}
                    alt="logo"
                    className={classes.Principlesimg}
                  />
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, mb: 1 }}
                    className={classes.principlesTitle}
                  >
                    {item.heading}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.principlesContent}
                  >
                    {item.description}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default Principles;
