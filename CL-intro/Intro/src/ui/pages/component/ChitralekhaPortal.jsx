import React, { useEffect } from "react";
import { Grid, Typography, Button, Link, Paper, Box } from "@mui/material";
import Partners from "../container/Partners";
import Features from "../container/Features";
import Principles from "../container/Principles";
import Footer from "./common/Footer";
import DatasetStyle from "../../styles/Dataset";
import Chitralekhaimg from "../../../img/chiralekha-bg.png";

function ChitralekhaPortal() {
  const classes = DatasetStyle();
  const handleWatchDemoVideo = () => {
    const url = "https://www.youtube.com/watch?v=hf5M6tApDlo";
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Grid container direction="row" className={classes.section}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mt: 20, mb: 20 }}>
          <Typography variant="h2" className={classes.Chitralekhatitle}>
            Chitralekha
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              lineHeight: "2rem",
              margin: "0 35px 25px 45px",
              textAlign: "justify",
            }}
          >
            <b>Chitralekha</b> is an <b>open source</b> platform for video
            subtitling across various Indic languages, using ML model support
            (ASR for Transcription, NMT for Translation and TTS for Voice Over).
            Chitralekha offers support for multiple input sources (Ex:
            Youtube, local etc), transcription generation process (Ex: Models,
            Source captions, Custom subtitle files etc) and voice over(Ex: mp3
            for audio only, mp4 for audio-video combination, etc)
          </Typography>
          <Button
            variant="contained"
            className={classes.buttons}
            onClick={handleWatchDemoVideo}
          >
            Watch Demo Video
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{ mt: 2 }}>
          <Box display={{ xs: "none", md: "inherit" }}>
            <img
              src={Chitralekhaimg}
              style={{
                width: "100%",
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
}
export default ChitralekhaPortal;