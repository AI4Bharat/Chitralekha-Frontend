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

export default function Integrations() {
  const classes = DatasetStyle();
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
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="NPTEL"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={Nptel}
                      alt="logo"
                      style={{marginTop:"-7px"}}
                    />
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="TicTac"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={TicTacLearn}
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
                title="Pratham"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
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
                title="Convegenius"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={EkStep}
                      alt="logo"
                      className={classes.Chitralekhalogo}
                    />
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
