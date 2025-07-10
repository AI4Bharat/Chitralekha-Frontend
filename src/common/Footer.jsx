import React from "react";

//Styles
import { IntroDatasetStyle } from "styles";

//Components
import { Grid, Typography, Button } from "@mui/material";
import { YouTube, Github, Twitter } from "assets/profileImages/index";

const Footer = () => {
  const classes = IntroDatasetStyle();
  return (
    <div>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGridMains}
        >
          <a target="_blank" href="https://github.com/AI4Bharat/Chitralekha">
            <img src={Github} alt="logo" className={classes.footerimg} />{" "}
          </a>
          <a target="_blank" href="https://x.com/ai4bharat">
            <img src={Twitter} alt="logo" className={classes.footerimg} />
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/@chitralekha-bhashini"
          >
            <img
              src={YouTube}
              alt="logo"
              style={{ height: "48px" }}
              className={classes.footerimg}
            />
          </a>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          className={classes.footerGridMain}
        >
          <Typography>
            Want to be a part of Chitralekha?
            <a target="_blank" href={"mailto:" + "chitralekha.tool@gmail.com"} >
              <Button
                variant="contained"
                sx={{
                  border: "1px solid white",
                  ml: 2,
                  textTransform: "capitalize",
                }}
              >
                Contact Us
              </Button>
            </a>
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          xl={2}
          className={classes.footerGrid}
        >
          <a
            href="https://github.com/AI4Bharat/Chitralekha/blob/master/LICENSE"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ ml: "2px", color: "white" }}  className={classes.hover}>
              License
            </Typography>
          </a>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGrid}
        >
          <Typography variant="caption" sx={{ color: "white" }}>
              {" "}
              Powered by EkStep Foundation{" "}
            </Typography>{" "}
      </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          className={classes.footerGridlast}
        >
          <a
            href="https://ai4bharat.iitm.ac.in/"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ color: "white" }}  className={classes.hover}>
              {" "}
              AI4Bharat{" "}
            </Typography>{" "}
          </a>
          <span style={{ margin: "0px 15px 0px 15px" }}>|</span>
          <a
            href="https://ekstep.org/"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ color: "white" }} className={classes.hover}>
              {" "}
              EkStep{" "}
            </Typography>{" "}
          </a>
        </Grid>
      </Grid>
    </div>
  );
};
export default Footer;
