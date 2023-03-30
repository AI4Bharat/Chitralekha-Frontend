import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import Loader from "./Spinner";

const headers = ["Video Id", "Task Type", "Target Language", "Video Name"];

const DeleteDialog = ({
  openDialog,
  handleClose,
  submit,
  message,
  loading,
  deleteResponse,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1"> {message}</Typography>

          {deleteResponse && (
            <TableRow
              style={{
                borderLeft: `2px solid #E9F7EF`,
                borderRight: `2px solid #E9F7EF`,
                backgroundColor: "#fff",
              }}
            >
              <TableCell colSpan={9} sx={{ borderBottom: "none" }}>
                <Box>
                  <Table size="large">
                    <TableHead>
                      <TableRow
                        style={{
                          height: "60px",
                        }}
                      >
                        {headers.map((item) => {
                          return (
                            <TableCell sx={{ padding: "6px 16px" }}>
                              {item}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deleteResponse.map((item) => {
                        return (
                          <TableRow
                            style={{
                              backgroundColor: "rgba(254, 191, 44, 0.1)",
                              height: "60px",
                            }}
                          >
                            <TableCell>{item.video_id}</TableCell>
                            <TableCell>{item.task_type}</TableCell>
                            <TableCell>
                              {item.target_language}
                            </TableCell>
                            <TableCell>{item.video_name}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "0 20px 20px 20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => submit()}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Delete
          {loading && <Loader size={20} margin="0 0 0 5px" color="secondary" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
