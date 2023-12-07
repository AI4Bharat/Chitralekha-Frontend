import React from "react";

//Components
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
  Tooltip,
} from "@mui/material";
import Loader from "./Spinner";

const headers = ["Video Id", "Task Type", "Target Language", "Video Name"];

const TaskReopenDialog = ({
  openDialog,
  handleClose,
  submit,
  message,
  loading,
  taskReopenResponse,
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
          {message}
          {/* <br/> */}
          {/* If you continue, corresponding Voice-Over task would be deleted. */}
          {taskReopenResponse && (
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
                      {taskReopenResponse.map((item, index) => {
                        return (
                          <TableRow
                            key={index}
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
            color="error"
            variant="contained"
            onClick={() => submit()}
            autoFocus
            sx={{ lineHeight: "1", borderRadius: "8px" }}
            >
            Reopen
            {loading && <Loader size={20} margin="0 0 0 5px" color="secondary" />}
            </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskReopenDialog;
