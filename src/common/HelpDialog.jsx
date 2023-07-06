import React, { useState } from "react";
import { translate, Workflow, workflowInnerList } from "config";
import { getHelpList } from "utils";

//Styles
import { headerStyle } from "styles";

//Components
import {
  Dialog,
  IconButton,
  Typography,
  Grid,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

const HelpDialog = ({ openHelpDialog, handleClose, setOpenHelpDialog }) => {
  const classes = headerStyle();

  const [selectedTab, setSelectedTab] = useState("");

  const handleAskhelpcommunity = () => {
    handleClose();
    window.open(
      "https://github.com/AI4Bharat/Chitralekha/discussions/categories/q-a",
      "blank"
    );
  };

  const questions = [
    {
      label: translate("label.addnewVideo"),
      onClick: () => setSelectedTab("label.addnewVideo"),
    },
    {
      label: translate("label.Editing&ReviewTasks"),
      onClick: () => setSelectedTab("label.editing&ReviewTasks"),
    },
    {
      label: translate("label.assigntasks"),
      onClick: () => setSelectedTab("label.assigntasks"),
    },
    {
      label: translate("label.editTranscription"),
      onClick: () => setSelectedTab("label.editTranscription"),
    },
    {
      label: translate("label.editTranslation"),
      onClick: () => setSelectedTab("label.editTranslation"),
    },
    {
      label: translate("label.workflow"),
      onClick: () => setSelectedTab("label.workflow"),
    },
    {
      label: translate("label.visitthehelpforum"),
      onClick: () => {
        handleClose();
        window.open("https://github.com/AI4Bharat/Chitralekha/wiki", "blank");
      },
    },
  ];

  return (
    <>
      <Dialog
        open={openHelpDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <Grid className={classes.mainHelpGridStyle}>
          <Grid sx={{ display: "flex" }}>
            {selectedTab && (
              <IconButton onClick={() => setSelectedTab("")}>
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

          {!selectedTab && (
            <Grid sx={{ mt: 2, color: "black" }}>
              <Typography variant="subtitle2" sx={{ fontSize: "20px" }}>
                {translate("label.Popularhelpresources")}
              </Typography>

              {questions.map((item) => {
                return (
                  <Grid
                    className={classes.HelpGridStyle}
                    onClick={item.onClick}
                  >
                    <div className={classes.ArticleIconStyle}>
                      <ArticleOutlinedIcon color="primary" fontSize="medium" />
                    </div>

                    <Typography
                      variant="subtitle1"
                      className={classes.TypographyStyle}
                    >
                      {item.label}
                    </Typography>
                  </Grid>
                );
              })}

              <Typography variant="subtitle2" sx={{ fontSize: "20px", mt: 2 }}>
                {translate("label.needmorehelp")}
              </Typography>

              <Grid
                className={classes.HelpGridStyle}
                onClick={handleAskhelpcommunity}
              >
                <div className={classes.ArticleIconStyle}>
                  <QuestionAnswerOutlinedIcon
                    color="primary"
                    fontSize="medium"
                  />
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

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid sx={{ width: "500px", mr: 1, color: "black" }}>
              {!selectedTab.includes("label.workflow") ? (
                <Grid>
                  <h3 style={{ margin: "23px", fontSize: "21px" }}>
                    {translate(selectedTab)}
                  </h3>

                  <ol style={{ listStyleType: "decimal" }}>
                    {getHelpList(selectedTab).map((item) => {
                      return (
                        <li style={{ fontSize: "18px", lineHeight: 2 }}>
                          {item}
                        </li>
                      );
                    })}
                  </ol>
                </Grid>
              ) : (
                <Grid>
                  <h3 style={{ margin: "20px", fontSize: "21px" }}>
                    {translate(selectedTab)}
                  </h3>

                  <ol style={{ listStyleType: "decimal" }}>
                    {Workflow.map((item) => {
                      return (
                        <li style={{ fontSize: "18px", lineHeight: 2 }}>
                          {item}
                        </li>
                      );
                    })}
                  </ol>

                  {workflowInnerList.map((item) => {
                    return (
                      <>
                        <h4 style={{ margin: "20px" }}>{item.label}</h4>

                        <ol style={{ listStyleType: "decimal" }}>
                          {item.list.map((element) => {
                            return (
                              <li style={{ fontSize: "18px", lineHeight: 2 }}>
                                {element}
                              </li>
                            );
                          })}
                        </ol>
                      </>
                    );
                  })}
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
