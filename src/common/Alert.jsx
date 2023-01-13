import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  IconButton,
  Snackbar,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TableBody, TableHead } from "mui-datatables";

const headers = ["Task Type", "Error Message", "Status"];

const AlertComponent = ({ open, data }) => {
  console.log(data, "data");

  const data2 = [
    {
      video_name:
        "Three Fishes | Animated Story For Kids In Hindi |  Cartoon Moral Stories | Masti Ki Paatshala",
      video_url: "https://www.youtube.com/watch?v=FzIMdHtvpDk",
      task_type: "Transcription Review",
      status: "Fail",
      message:
        "Task creation for Transcription Review failed as Translation tasks already exists.",
    },
    {
      video_name:
        "Three Fishes | Animated Story For Kids In Hindi |  Cartoon Moral Stories | Masti Ki Paatshala",
      video_url: "https://www.youtube.com/watch?v=FzIMdHtvpDk",
      task_type: "Transcription Review",
      status: "Fail",
      message:
        "Task creation for Transcription Review failed as Translation tasks already exists.",
    },
  ];

  // const action = (

  // )

  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      // onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert elevation={3} variant="filled" severity={"info"}>
        <Box style={{ textAlign: "initial", marginBottom: "10px" }}> {data.message}</Box>

        <Box display="flex">
          <Box style={{ border: "1px solid ", width: "20%" }}>Task Type</Box>
          <Box style={{ border: "1px solid ", width: "60%" }}>
            Error Message
          </Box>
          <Box style={{ border: "1px solid ", width: "20%" }}>Status</Box>
        </Box>

        <Box display="flex" flexDirection="column">
          {data2.map((item) => {
            return (
              <Box display="flex">
                <Box style={{ border: "1px solid", borderTop: "none", width: "20%" }}>
                  {item.task_type}
                </Box>
                <Box style={{ border: "1px solid", borderTop: "none", width: "60%" }}>
                  {item.message}
                </Box>
                <Box style={{ border: "1px solid",borderTop: "none", width: "20%" }}>
                  {item.status}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
