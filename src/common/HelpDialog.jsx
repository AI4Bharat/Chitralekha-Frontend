import {
  Dialog,
  IconButton,
  Typography,
  Grid,
  DialogContent,
  DialogContentText
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import headerStyle from "../styles/header";
import { translate } from "../config/localisation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

const HelpDialog = ({ openHelpDialog, handleClose, setOpenHelpDialog }) => {
  const classes = headerStyle();
  const [Addnewvideo, setAddnewvideo] = useState(false);
  const [EditingReviewTasks, setEditingReviewTasks] = useState(false);
  const [AssignTasks, setAssignTasks] = useState(false);
  const [EditTranscription, setEditTranscription] = useState(false);
  const [EditTranslation, setEditTranslation] = useState(false);
  const [Workflow, setWorkflow] = useState(false);

  const handleaddnewvideo = () => {
    setAddnewvideo(true);
  };

  const handleEditingReviewTasks = () => {
    setEditingReviewTasks(true);
  };
  const handleAssignTasks = () => {
    setAssignTasks(true);
  };

  const handleEditTranscription = () => {
    setEditTranscription(true);
  };

  const handleEditTranslation = () => {
    setEditTranslation(true);
  };

  const handleWorkflow = () => {
    setWorkflow(true);
  };

  const handleVisithelpForum = () =>{
    handleClose()
    window.open("https://github.com/AI4Bharat/Chitralekha/wiki", "blank");
  }

  const handleAskhelpcommunity = () =>{
    handleClose()
    window.open("https://github.com/AI4Bharat/Chitralekha/discussions/categories/q-a", "blank");
  }
  const handleArrowBackIcon = () => {
    setWorkflow(false);
    setEditTranscription(false);
    setAssignTasks(false);
    setEditingReviewTasks(false);
    setEditTranslation(false);
    setAddnewvideo(false);
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
        <Grid  className={classes.mainHelpGridStyle} >
          <Grid sx={{ display: "flex" }}>
            {(Addnewvideo === true ||
              EditingReviewTasks === true ||
              AssignTasks === true ||
              EditTranscription === true ||
              EditTranslation === true ||
              Workflow === true) && (
              <IconButton onClick={handleArrowBackIcon}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <Typography variant="h4" display={"flex"} alignItems="center">
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

          {Addnewvideo === false &&
            EditingReviewTasks === false &&
            AssignTasks === false &&
            EditTranscription === false &&
            EditTranslation === false &&
            Workflow === false && (
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

                  <Typography variant="subtitle1" className={classes.TypographyStyle} >
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

                  <Typography variant="subtitle1">
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

                  <Typography variant="subtitle1">
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

                  <Typography variant="subtitle1">
                    {translate("label.editTranscription")}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.HelpGridStyle}
                  onClick={handleEditTranslation}
                >
                  <div className={classes.ArticleIconStyle}>
                    <ArticleOutlinedIcon color="primary" fontSize="medium" />
                  </div>

                  <Typography variant="subtitle1">
                    {translate("label.editTranslation")}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.HelpGridStyle}
                  onClick={handleWorkflow}
                >
                  <div className={classes.ArticleIconStyle}>
                    <ArticleOutlinedIcon color="primary" fontSize="medium" />
                  </div>

                  <Typography variant="subtitle1">
                    {translate("label.workflow")}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.HelpGridStyle}
                  onClick={handleVisithelpForum}
                >
                  <Typography variant="subtitle1" color="primary" sx={{ ml: 7,mt:0.5 }}>
                    {translate("label.visitthehelpforum")}
                  </Typography>
                  <div className={classes.ArticleIconStyle}>
                    <OpenInNewIcon color="primary" fontSize="medium" />
                  </div>
                </Grid>
                <Typography variant="subtitle2" sx={{ fontSize: "20px",mt:2 }}>
                  {translate("label.needmorehelp")}
                </Typography>

                <Grid
                  className={classes.HelpGridStyle}
                  onClick={handleAskhelpcommunity}
                >
                  <div className={classes.ArticleIconStyle}>
                    <QuestionAnswerOutlinedIcon color="primary" fontSize="medium" />
                  </div>

                  <Typography variant="subtitle1">
                    {translate("label.askhelpcommunity")}
                    <Typography variant="body2">
                    {translate("label.getanswerfromcommunity")}
                  </Typography>
                  </Typography>
                </Grid>
              </Grid>
            )}
        </Grid>
        <DialogContent >
        <DialogContentText id="alert-dialog-description">
        <Grid sx={{ width: "500px", mr: 1 ,color: "black" }}>
          {Addnewvideo === true && (
            <Grid>
              <Typography variant="subtitle1">
              <h3 style={{ marginLeft: "20px"  }}> {translate("label.addnewVideo")}</h3>
                <ol style={{ listStyleType: "decimal" }}>
                  <li>
                    {" "}
                    Login with the account which has a Project Manager role.
                  </li>
                  <li className={classes.listStyle}>
                    Open any project using the view button, under which the new
                    video needs to be created.
                  </li>
                  <li className={classes.listStyle}>
                    Go to the <span className={classes.spanStyle} >'Videos' </span> sub tab.
                  </li>
                  <li className={classes.listStyle}>
                    Click on <span className={classes.spanStyle} >'Create a new Video/Audio'</span> .
                  </li>
                  <li className={classes.listStyle}>
                    Select the source language of the video.
                  </li>
                  <li className={classes.listStyle}>
                    Paste the youtube video url.
                  </li>
                </ol>
              </Typography>
            </Grid>
          )}

          {EditingReviewTasks === true && (
            <Grid >
              <Typography variant="subtitle1">
              <h3 style={{ marginLeft: "20px"  }}>{translate("label.Editing&ReviewTasks")}</h3>

                <ol style={{ listStyleType: "decimal" }}>
                  <li>
                    {" "}
                    Login with the account associated with the particular role.
                    (Editor role for editing tasks and Reviewer role for the
                    task reviews).
                  </li>
                  <li className={classes.listStyle}> Go to the  <span className={classes.spanStyle} >'Tasks'</span> tab.</li>
                  <li className={classes.listStyle}>
                    {" "}
                    On the task that you want to edit/review, click on the
                    <span className={classes.spanStyle} > 'Edit'</span>  icon.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    If there are any dependent tasks, it would be greyed out.
                  </li>
                  <li className={classes.listStyle}>
                    The editor window show now open up based on the task type.
                  </li>
                </ol>
              </Typography>
            </Grid>
          )}
          {AssignTasks === true && (
            <Grid >
              <Typography variant="subtitle1">
              <h3 style={{ marginLeft: "20px"  }}>{translate("label.assigntasks")}</h3>

                <ol style={{ listStyleType: "decimal" }}>
                  <li>
                    {" "}
                    Login with the account which has a Project Manager role.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Open any project using the view button, under which the new
                    video needs to be created.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Go to the <span className={classes.spanStyle} >'Tasks'</span>  sub tab.
                  </li>
                  <li> Click on the <span className={classes.spanStyle} >'Edit Task Details'</span> icon.</li>
                  <li className={classes.listStyle}>
                    {" "}
                    On the modal, click on the dropdown for <span className={classes.spanStyle} >'Assign User'</span>.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Replace the assigned user with the new user.
                  </li>
                  <li className={classes.listStyle}> Click on <span className={classes.spanStyle} >'Update Task'</span> </li>
                </ol>
              </Typography>
            </Grid>
          )}
          {EditTranscription === true && (
            <Grid >
              <Typography variant="subtitle1">
              <h3 style={{ marginLeft: "20px"  }}>{translate("label.editTranscription")}</h3>
                <ol style={{ listStyleType: "decimal" }}>
                  <li className={classes.listStyle}>
                    {" "}
                    Login with the account associated with the Transcriptor
                    editor/reviewer role, based on the task type.
                  </li>
                  <li className={classes.listStyle}> Go to the  <span className={classes.spanStyle} > 'Tasks'</span>  tab</li>
                  <li className={classes.listStyle}>
                    {" "}
                    On the task that you want to edit/review, click on the
                    <span className={classes.spanStyle} > 'Edit'</span> icon.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    If there are any dependent tasks, it would be greyed out.
                  </li>
                  <li className={classes.listStyle}>
                    The editor window show now open up based on the task type.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Continue with editing. The UI is very intuitive.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Play the video to see the auto transcriptions generated.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    If any changes are required, click on that specific card &
                    start editing.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Transliteration based typing feature would be made available
                    for non-English languages.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    The timeline can also be adjusted wherever required.
                  </li>
                  <li className={classes.listStyle}>
                    The Merge, Split, Delete, Add buttons also aid in achieving
                    high quality transcripts.
                  </li>
                  <li className={classes.listStyle}>
                    {" "}
                    Once done, click on <span className={classes.spanStyle} >'Complete'</span> icon.
                  </li>
                </ol>
              </Typography>
            </Grid>
          )}
          {EditTranslation === true && (
            <Grid >
              
              <Typography variant="subtitle1">
              <h3 style={{ marginLeft: "20px"  }}> {translate("label.editTranslation")}</h3>

                <ol style={{ listStyleType: "decimal" }}>
                  <li className={classes.listStyle}>
                    Login with the account associated with the Translation
                    editor/reviewer role, based on the task type.
                  </li>
                  <li className={classes.listStyle}>Go to the <span className={classes.spanStyle} > 'Tasks'</span>  tab.</li>
                  <li className={classes.listStyle}>
                    On the task that you want to edit/review, click on the
                    <span className={classes.spanStyle} > 'Edit'</span>  icon.
                  </li>
                  <li className={classes.listStyle}>
                    If there are any dependent tasks, it would be greyed out.
                  </li>
                  <li className={classes.listStyle}>
                    The editor window show now open up based on the task type.
                  </li>
                  <li className={classes.listStyle}>
                    Continue with editing. The UI is very intuitive.
                  </li>
                  <li className={classes.listStyle}>
                    Play the video to see the translations syncing up.
                  </li>
                  <li className={classes.listStyle}>
                    If any changes are required, click on that specific card &
                    start editing.
                  </li>
                  <li className={classes.listStyle}>
                    Transliteration based typing feature would be made available
                    for non-English languages.
                  </li>
                  <li className={classes.listStyle}>
                    The word count is shown for reference for both the source &
                    target sentences. If voice over task is pipelined, make sure
                    the word count difference is minimal.
                  </li>
                  <li className={classes.listStyle}>
                    Temporarily the source side sentences can also be edited,
                    but this doesn't affect the global Transcript.
                  </li>
                  <li className={classes.listStyle}>
                    Once done, click on <span className={classes.spanStyle} >'Complete'</span> icon.
                  </li>
                </ol>
              </Typography>
            </Grid>
          )}
          {Workflow === true && (
            <Grid >
              <Typography variant="subtitle1" align="justify">
              <h3 style={{ marginLeft: "20px"  }}>   {translate("label.workflow")}</h3>

                <ol style={{ listStyle: "none"}}>
                  <li>
                    {" "}
                    A workflow is a set of tasks pipelined to achieve the final
                    output.
                  </li>
                  <li>
                    At a bare minimum, there should be atleast a <span className={classes.spanStyle} >'Translation Edit'</span>  task as part of a workflow.
                  </li>
                </ol>

                <ol style={{ listStyle: "none"}}>
                  <li>
                    {" "}
                    Default workflows can be set both at Org level and Project
                    level.
                  </li>
                  <li>This of course can be modified later.</li>
                  <li>To set Default workflows, follow the steps:</li>
                </ol>
                <h4 style={{ marginLeft: "20px" }}>At Org Level:</h4>
                <ol style={{ listStyleType: "decimal" }}>
                  <li> Login with the account which has a Org Owner role.</li>
                  <li>Click on the <span className={classes.spanStyle} >'Settings'</span>  tab</li>
                  <li>
                    {" "}
                    On the <span className={classes.spanStyle}>'Default workflow'</span> section, make the required
                    changes.
                  </li>
                  <li> Once finalized, click on  <span className={classes.spanStyle} >'Update Organization'</span></li>
                </ol>

                <h4 style={{ marginLeft: "20px" }}>At Project Level :</h4>
                <ol style={{ listStyleType: "decimal" }}>
                  <li>
                    Login with the account which has a Project Manager role.
                  </li>
                  <li>
                    Select a specific project for which we need to update the
                    Default Workflow.
                  </li>
                  <li>
                    Click on the<span className={classes.spanStyle} > 'Settings' </span> icon next to the project name.
                  </li>
                  <li>
                    On the <span className={classes.spanStyle} >'Default workflow'</span> section, make the required
                    changes.
                  </li>
                  <li>Once finalized, click on <span className={classes.spanStyle} >'Update Project'</span> .</li>
                </ol>
              </Typography>
            </Grid>
          )}
        </Grid>
        </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpDialog;
