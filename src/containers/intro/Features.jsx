import React from "react";

//Styles
import { IntroDatasetStyle } from "styles";
import { introTheme } from "theme";

//Components
import { Grid, Typography, ThemeProvider } from "@mui/material";
import {
  PurePython,
  UsefulUI,
  RobustIntegrations,
  EasytoUse,
  OpenSource,
} from "assets/index";

const Features = () => {
  const classes = IntroDatasetStyle();

  const FeaturesDetailsArray = [
    {
      heading: "Pure Python",
      description:
        "Chitralekha is purely built on technologies supported by Python. This offers wide variety of tech stack to be easily integrated. The cloud agnostic stack also provides the flexibility to host in any on-prem or cloud platforms.",
      image: PurePython,
    },
    {
      heading: "Clean & Powerful UI",
      description:
        "Easy to generate transcript and translation subtitles and voice-over in translation language for a video, easy to do workflow management and performance tracking of tasks.",
      image: UsefulUI,
    },
    {
      heading: "Robust Integrations",
      description:
        "Chitralekha provides many plug-and-play features that are ready to execute your digitization & translation tasks using any of the available models. This makes Chitralekha easy to apply to current infrastructure and extend to next-gen technologies.",
      image: RobustIntegrations,
    },
    {
      heading: "Open Source",
      description:
        "Wherever you want to share your improvement you can do this by opening a PR. It's simple as that, no barriers, no prolonged procedures. Chitralekha has many active users who willingly share their experiences. Have any questions? Reach out to us via github or email",
      image: OpenSource,
    },
  ];

  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid item className={classes.principleTilesWrpr}>
          <Typography variant="h4" className={classes.titles}>
            Features
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            {FeaturesDetailsArray.map((item, index) => {
              return (
                <Grid item className={classes.tilesWrpr}>
                  <img
                    src={item.image}
                    alt="logo"
                    className={classes.featuresimg}
                  />
                  <Typography
                    variant="h4"
                    className={classes.principlesTitle}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    {item.heading}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.featuresContent}
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

export default Features;
