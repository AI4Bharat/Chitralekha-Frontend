import { Alert, Box, Snackbar } from "@mui/material";
import React from "react";
import ProjectStyle from "../styles/ProjectStyle";

const AlertComponent = ({ open, data, onClose }) => {
  const classes = ProjectStyle();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert elevation={3} variant="filled" severity="info" onClose={onClose}>
        <Box className={classes.message}>{data.message}</Box>

        <Box className={classes.headerParent}>
          <Box className={classes.content1}>Task Type</Box>
          <Box className={classes.content2}>Message</Box>
          <Box className={classes.content1}>Status</Box>
        </Box>

        <Box display="flex" flexDirection="column" backgroundColor="#fff">
          {data?.response?.detailed_report?.map((item) => {
            return (
              <Box className={classes.contentParent}>
                <Box className={classes.content1}>{item.task_type}</Box>
                <Box className={classes.content2}>{item.message}</Box>
                <Box className={classes.content1}>{item.status}</Box>
              </Box>
            );
          })}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
