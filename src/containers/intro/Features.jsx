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
  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 10 }}>
          <Typography variant="h4" className={classes.titles}>
            Features
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <img
                src={PurePython}
                alt="logo"
                className={classes.featuresimg}
              />
              <Typography
                variant="h4"
                sx={{ mb: 3, mt: 1 }}
                className={classes.featuresTitle}
              >
                Pure Python
              </Typography>
              <Typography variant="body1" className={classes.featuresContent}>
                Chitralekha is purely built on technologies supported by Python.
                This offers wide variety of tech stack to be easily integrated.
                The cloud agnostic stack also provides the flexibility to host
                in any on-prem or cloud platforms.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <img src={UsefulUI} alt="logo" className={classes.featuresimg} />

              <Typography
                variant="h4"
                sx={{ mb: 3, mt: 1 }}
                className={classes.featuresTitle}
              >
                Clean & Powerful UI
              </Typography>
              <Typography variant="body2" className={classes.featuresContent}>
              Easy to generate transcript and translation subtitles and
               voice-over in translation language for a video, easy to do 
               workflow management and performance tracking of tasks.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <img
                src={RobustIntegrations}
                alt="logo"
                className={classes.featuresimg}
              />
              <Typography
                variant="h4"
                sx={{ mb: 3, mt: 1 }}
                className={classes.featuresTitle}
              >
                Robust Integrations
              </Typography>
              <Typography variant="body2" className={classes.featuresContent}>
                Chitralekha provides many plug-and-play features that are ready
                to execute your digitization & translation tasks using any of
                the available models. This makes Chitralekha easy to apply to
                current infrastructure and extend to next-gen technologies.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <img src={EasytoUse} alt="logo" className={classes.featuresimg} />
              <Typography
                variant="h4"
                sx={{ mb: 3, mt: 1 }}
                className={classes.featuresTitle}
              >
                Easy to Use
              </Typography>
              <Typography variant="body2" className={classes.featuresContent}>
                Anyone with basic knowledge in language can be onboarded to
                Chitralekha. It does not limit the scope of your tasks; you can
                use it to build pipelines to generate the final subtitles and 
                voice-over for the submitted videos.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: 4 }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <img
                src={OpenSource}
                alt="logo"
                className={classes.featuresimg}
              />
              <Typography
                variant="h4"
                sx={{ mb: 3, mt: 1 }}
                className={classes.featuresTitle}
              >
                Open Source
              </Typography>
              <Typography variant="body2" className={classes.featuresContent}>
                Wherever you want to share your improvement you can do this by
                opening a PR. It's simple as that, no barriers, no prolonged
                procedures. Chitralekha has many active users who willingly
                share their experiences. Have any questions? Reach out to us via
                github or email
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default Features;
