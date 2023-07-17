import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import DatasetStyle from "../../styles/Dataset";
import { ThemeProvider } from "@mui/material";
import themeDefault from "../../styles/theme/theme";

export default function Partners() {
  const classes = DatasetStyle();

  const partnerData = [
    {
      image: require("../../../img/Nptel.png"),
      title: "Nptel",
      link: "https://nptel.ac.in/",
    },
    {
      image: require("../../../img/TicTac.png"),
      title: "TicTacLearn",
      link: "https://tictaclearn.org/",
    },
    {
      image: require("../../../img/Partham.png"),
      title: "Pratham",
      link: "",
    },
    {
      image: require("../../../img/EkStep.png"),
      title: "EkStep",
      link: "https://ekstep.org/",
    },
  ];

  const handleClickImg = (link) => {
    window.open(link);
  };
  return (
    <ThemeProvider theme={themeDefault}>
      <div>
        <Grid sx={{ mt: 10, mb: 10 }}>
          <Typography variant="h4" className={classes.titles}>
            Partners
          </Typography>

          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 10,
              mb: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {partnerData?.map((el, i) => (
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  onClick={() => handleClickImg(el.link)}
                  sx={{ textTransform: "capitalize" }}
                >
                  <div
                    component="div"
                    style={{
                      margin: 0,
                      padding: "8px 0 8px 0px",
                      lineHeight: 0,
                    }}
                    className={classes.partnersPaper}
                  >
                    <img
                      src={el.image}
                      alt="logo"
                      style={{ width: "230px", aspectRatio: "1" }}
                    />
                  </div>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
