import { Dialog, IconButton, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import headerStyle from "../styles/header";
import { translate } from "../config/localisation";
import PopularHelpResourcesDialog from "./PopularHelpResourcesDialog";

const HelpDialog = ({ openHelpDialog, handleClose, setOpenHelpDialog }) => {
  const classes = headerStyle();
  const [openDialog, setOpenDialog] = useState(false);
  const [Addnewvideo, setAddnewvideo] = useState(false);
  const [EditingReviewTasks, setEditingReviewTasks] = useState(false);

  const handleaddnewvideo = () => {
    setAddnewvideo(true);
  };

  const handleEditingReviewTasks = () => {
    setEditingReviewTasks(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Dialog
        open={openHelpDialog}
        onClose={handleClose}
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
              onClick={handleClose}
              sx={{ marginLeft: "auto" }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          {(Addnewvideo === false && EditingReviewTasks === false) && (
            <Grid sx={{ mt: 2, color: "black" }}>
              <Typography variant="subtitle2" sx={{ fontSize: "20px" }}>
                {translate("label.Popularhelpresources")}
              </Typography>

              <Grid
                className={classes.HelpGridStyle}
                onClick={handleaddnewvideo}
              >
                <div className={classes.ArticleIconStyle}>
                  <ArticleOutlinedIcon color="primary" fontSize="medium" />
                </div>

                <Typography variant="subtitle1" align="center">
                  {translate("label.addnewVideo")}
                </Typography>
              </Grid>
              <Grid
                className={classes.HelpGridStyle}
                onClick={handleEditingReviewTasks}
              >
                <div className={classes.ArticleIconStyle}>
                  <ArticleOutlinedIcon color="primary" fontSize="medium" />
                </div>

                <Typography variant="subtitle1" align="center">
                  {translate("label.Editing&ReviewTasks")}
                </Typography>
              </Grid>
              <Grid
                className={classes.HelpGridStyle}
                onClick={handleaddnewvideo}
              >
                <div className={classes.ArticleIconStyle}>
                  <ArticleOutlinedIcon color="primary" fontSize="medium" />
                </div>

                <Typography variant="subtitle1" align="center">
                  {translate("label.assigntasks")}
                </Typography>
              </Grid>
              <Grid
                className={classes.HelpGridStyle}
                onClick={handleaddnewvideo}
              >
                <div className={classes.ArticleIconStyle}>
                  <ArticleOutlinedIcon color="primary" fontSize="medium" />
                </div>

                <Typography variant="subtitle1" align="center">
                  {translate("label.editTranscription")}
                </Typography>
              </Grid>
              <Grid
                className={classes.HelpGridStyle}
                onClick={handleaddnewvideo}
              >
                <div className={classes.ArticleIconStyle}>
                  <ArticleOutlinedIcon color="primary" fontSize="medium" />
                </div>

                <Typography variant="subtitle1" align="center">
                  {translate("label.workflow")}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        {Addnewvideo === true &&  (
          <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 1 ......................
            </Typography>
          </Grid>
        )}
        <>
        {EditingReviewTasks === true &&(
         <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 2 ......................
            </Typography>
          </Grid>)}
        </>
        
      </Dialog>
      {openDialog && (
        <PopularHelpResourcesDialog
          openDialog={openDialog}
          handleCloseDialog={() => handleCloseDialog()}
        />
      )}
    </>
  );
};

export default HelpDialog;
