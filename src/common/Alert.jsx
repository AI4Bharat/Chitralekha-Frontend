import { Alert, Box, Snackbar } from "@mui/material";
import React from "react";
import ProjectStyle from "../styles/ProjectStyle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const AlertComponent = ({ open, data, onClose }) => {
  const classes = ProjectStyle();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        elevation={3}
        variant="standard"
        severity={"info"}
        onClose={onClose}
        sx={{
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 14px 2px rgba(20,6,6,0.52)!important",
        }}
      >
        <Box className={classes.message} style={{ color: "#03a9f4" }}>
          {data.message}
        </Box>

        {data?.response?.detailed_report?.length > 0 && (
          <Box>
            <Box className={classes.headerParent}>
              <Box className={classes.header} style={{ width: "28%" }}>
                Task Type
              </Box>
              <Box className={classes.header}>Status</Box>
              <Box className={classes.header} style={{ width: "50%" }}>
                Message
              </Box>
            </Box>

            <Box
              style={{
                maxHeight: "200px",
                overflowY:
                  data?.response?.detailed_report?.length > 3 ? "scroll" : "",
              }}
            >
              <Box display="flex" flexDirection="column" backgroundColor="#fff">
                {data?.response?.detailed_report?.map((item) => {
                  return (
                    <Box className={classes.contentParent}>
                      <Box
                        className={classes.contentTaskType}
                        style={{ width: "25%" }}
                      >
                        {item.task_type}
                      </Box>
                      <Box className={classes.contentStatus}>
                        <Box className={classes.contentStatusTop}>
                          {item.language_pair}
                        </Box>
                        <Box>
                          {item.status === "Fail" ? (
                            <CancelOutlinedIcon />
                          ) : (
                            <TaskAltIcon />
                          )}
                        </Box>
                      </Box>
                      <Box className={classes.content2}>{item.message}</Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
