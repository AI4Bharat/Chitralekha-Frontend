import { Dialog, IconButton, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import headerStyle from "../styles/header";
import { translate } from "../config/localisation";

const HelpDialog = ({ openHelpDialog, handleClose, setOpenHelpDialog }) => {
  const classes = headerStyle();
  const [Addnewvideo, setAddnewvideo] = useState(false);
  const [EditingReviewTasks, setEditingReviewTasks] = useState(false);
  const [AssignTasks,setAssignTasks] = useState(false);
  const [EditTranscription,setEditTranscription] = useState(false);
  const[Workflow,setWorkflow] = useState(false)

  const handleaddnewvideo = () => {
    setAddnewvideo(true);
  };

  const handleEditingReviewTasks = () => {
    setEditingReviewTasks(true);
  };
  const handleAssignTasks = () =>{
    setAssignTasks(true)
  }

  const handleEditTranscription = () =>{
    setEditTranscription(true)
  }

  const handleWorkflow = () =>{
    setWorkflow(true)
  }
const handleback = ()=>{
    setWorkflow(true)
    setEditTranscription(true) 
    setAssignTasks(true)
}


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
          <IconButton
              aria-label="close"
              onClick={handleback}
            >
              <CloseIcon />
            </IconButton>
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
          {(Addnewvideo === false && EditingReviewTasks === false && AssignTasks === false && EditTranscription === false && Workflow === false) && (
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
                onClick={handleAssignTasks}
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
                onClick={handleEditTranscription}
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
                onClick={handleWorkflow}
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
          {AssignTasks === true &&(
         <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 3 ......................
            </Typography>
          </Grid>)}
          {EditTranscription === true &&(
         <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 4 ......................
            </Typography>
          </Grid>)}
          {Workflow === true &&(
         <Grid className={classes.HelpGridStyle}>
            <div className={classes.ArticleIconStyle}>
              <ArticleOutlinedIcon color="primary" fontSize="medium" />
            </div>

            <Typography variant="subtitle1" align="center">
              some content here 5 ......................
            </Typography>
          </Grid>)}
        </>
        
      </Dialog>
    
    </>
  );
};

export default HelpDialog;
