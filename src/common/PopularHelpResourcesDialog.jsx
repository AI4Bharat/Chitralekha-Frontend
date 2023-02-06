import { Dialog, IconButton, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import headerStyle from "../styles/header";
import { translate } from "../config/localisation";

const PopularHelpResourcesDialog = ({ openDialog, handleCloseDialog }) => {
  const classes = headerStyle();

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <Grid sx={{ width: "500px", p: 2 }}>
        <Grid sx={{ display: "flex" }}>
          <Typography sx={{ ml: 25 }} variant="h4" align="center">
            Help
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid sx={{ mt: 2, color: "black" }}>
         
          <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 1 ......................
            </Typography>
          </Grid>

          <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 2......................
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PopularHelpResourcesDialog;
