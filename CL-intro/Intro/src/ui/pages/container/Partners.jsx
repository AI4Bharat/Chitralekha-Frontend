import React from "react";
import { Grid, Typography, Button, Paper, Tooltip } from "@mui/material";
import DatasetStyle from "../../styles/Dataset";
import Chitralekhalogo from "../../../img/Chitralekha_Logo.png";
// import LightTooltip from "../component/common/Tooltip";
import { ThemeProvider } from "@mui/material";
import themeDefault from "../../styles/theme/theme";
import Nptel from "../../../img/Nptel.png";
import TicTacLearn from "../../../img/TicTac.png";
import Pratham from "../../../img/Partham.png";
import EkStep from "../../../img/EkStep.png";

export default function Partners() {
  const classes = DatasetStyle();

  const partnerData = [
    {
      image: require("../../../img/Nptel.png"),
      title: 'Nptel',
      link: 'https://nptel.ac.in/'

    },
    {
      image: require("../../../img/TicTac.png"),
      title: 'TicTacLearn',
      link: 'https://tictaclearn.org/'

    },
    {
      image: require("../../../img/Partham.png"),
      title: 'Pratham' ,
      link: ''

    },
    {
      image: require("../../../img/EkStep.png"),
      title: 'EkStep' ,
      link: 'https://ekstep.org/'

    }
  ]


 const  handleClickImg = (link) =>{
  window.open(link);
 }
  return (
    <ThemeProvider theme={themeDefault}>
      <div>
        <Grid sx={{ mt: 10, mb: 10 }}>
          <Typography
            variant="h4"
            className={classes.titles}
          >
            Partners
          </Typography>
         
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 4,
              mb: 15,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
             {partnerData?.map((el, i) => (
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                <Button  onClick={()=>handleClickImg(el.link)} sx={{ textTransform: "capitalize" }}>
                  <div component="div" style={{margin: 0, padding: 0, lineHeight: 0, }} className={classes.PartnersPaper}>
                    <img
                      src={el.image}
                      alt="logo"
                      style={{width:"230px", aspectRatio: '1'}}
                    />
                  </div>
                </Button>
            </Grid>  ))}
            {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <a target="_blank" href="https://tictaclearn.org/">
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.PartnersPaper}>
                    <img
                      src={TicTacLearn}
                      alt="logo"
                      className={classes.Chitralekhalogo}
                    />
                  </Paper>
                </Button>
                </a>
             
            </Grid> */}
            {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="Pratham"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.PartnersPaper}>
                    <img
                      src={Pratham}
                      alt="logo"
                      className={classes.Chitralekhalogo}
                    />
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="EkStep"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.PartnersPaper}>
                    <img
                      src={EkStep}
                      alt="logo"
                      className={classes.Chitralekhalogo}
                    />
                  </Paper>
                </Button>
              </Tooltip>
            </Grid> */}
            
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
