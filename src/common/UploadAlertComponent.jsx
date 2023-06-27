import { Alert, Box, Snackbar } from "@mui/material";
import React from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { ProjectStyle } from "styles";

const UploadAlertComponent = ({ open, message, report, onClose }) => {
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
          {message}
        </Box>

        {report?.length > 0 && (
          <Box>
            <Box className={classes.headerParent}>
              <Box className={classes.header}>Video Name</Box>
              <Box className={classes.header}>Language</Box>
              <Box className={classes.header}>Status</Box>
              <Box className={classes.header}>Message</Box>
            </Box>

            <Box
              style={{
                maxHeight: "200px",
                overflowY: report?.length > 3 ? "scroll" : "",
              }}
            >
              <Box display="flex" flexDirection="column" backgroundColor="#fff">
                {report?.map((item, index) => {
                  return (
                    <Box key={index} className={classes.contentParent}>
                      <Box className={classes.content}>{item.video_name}</Box>
                      <Box className={classes.content}>
                        {`${
                          item.task_type.includes("TRANSLATION")
                            ? item.target_language
                            : item.source_language
                        }`}
                      </Box>
                      <Box className={classes.contentStatus}>
                        <Box className={classes.contentStatusTop}>
                          {item.status}
                        </Box>
                        <Box>
                          {item.status === "Fail" ? (
                            <CancelOutlinedIcon color="error" />
                          ) : (
                            <TaskAltIcon color="success" />
                          )}
                        </Box>
                      </Box>
                      <Box className={classes.content}>{item.message}</Box>
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

export default UploadAlertComponent;
