import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const headers = ["Task Id", "Task Type", "Target Language", "Video Name"];

const DeleteMemberErrorDialog = ({
  openDialog,
  handleClose,
  message,
  response,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>

          {response && (
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader size="large">
                <TableHead>
                  <TableRow
                    style={{
                      height: "60px",
                    }}
                  >
                    {headers.map((item, index) => {
                      return (
                        <TableCell key={index} sx={{ padding: "6px 16px" }}>
                          {item}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response.map((item, index) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          backgroundColor: "rgba(254, 191, 44, 0.1)",
                          height: "60px",
                        }}
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.task_type}</TableCell>
                        <TableCell>{item.target_language}</TableCell>
                        <TableCell>{item.video_name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "0 20px 20px 20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMemberErrorDialog;
