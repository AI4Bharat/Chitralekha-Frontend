import React from "react";

//Styles
import { ProjectStyle } from "styles";

//Components
import { Alert, Box, Snackbar } from "@mui/material";

const CSVAlertComponent = ({ open, message, report, onClose }) => {
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
              <Box className={classes.header} style={{ width: "40%" }}>
                Row Number
              </Box>
              <Box className={classes.header} style={{ width: "60%" }}>
                Message
              </Box>
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
                    <Box
                      key={index}
                      className={classes.contentParent}
                      style={{ textAlign: "center", minWidth: "500px" }}
                    >
                      <Box
                        className={classes.content2}
                        style={{ width: "40%" }}
                      >
                        {item.row_no}
                      </Box>
                      <Box
                        style={{ width: "60%" }}
                        className={classes.content2}
                      >
                        {item.message}
                      </Box>
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

export default CSVAlertComponent;
