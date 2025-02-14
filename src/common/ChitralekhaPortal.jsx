import React, { useEffect } from "react";

//Styles
import { IntroDatasetStyle } from "styles";

//Components
import { Grid, Typography, Button, Box } from "@mui/material";
import { Partners, Features, Principles } from "containers/intro/index";
import Footer from "../common/Footer";
import { Chitralekhaimg } from "assets/profileImages/index";

const ChitralekhaPortal = () => {
  const classes = IntroDatasetStyle();
  const handleWatchDemoVideo = () => {
    const url = "https://www.youtube.com/watch?v=hf5M6tApDlo";
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      <Grid container direction="row" className={classes.section}>
        <Grid item className={classes.textSection}>
          <Typography variant="h2" className={classes.Chitralekhatitle}>
            Chitralekha
          </Typography>
          <Typography className={classes.details}>
            <b>Chitralekha</b> is an <b>open source</b> platform for video
            subtitling across various Indic languages, using ML model support
            (ASR for Transcription, NMT for Translation and TTS for Voice Over).
            Chitralekha offers support for multiple input sources (Ex: Youtube,
            local etc), transcription generation process (Ex: Models, Source
            captions, Custom subtitle files etc) and voice over(Ex: mp3 for
            audio only, mp4 for audio-video combination, etc)
          </Typography>
          <Button
            variant="contained"
            className={classes.buttons}
            onClick={handleWatchDemoVideo}
          >
            Watch Demo Video
          </Button>
        </Grid>
        <Grid item className={classes.imageWrpr}>
          <Box display={{ xs: "none", md: "inherit" }}>
            <img
              src={Chitralekhaimg}
              style={{
                width: "100%",
                mixBlendMode: "darken",
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Principles />
      <Features />
      <Partners />
      <Footer />
    </div>
  );
};
export default ChitralekhaPortal;
