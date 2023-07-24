import React from "react";

//Components
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

const headers = [
  "Index",
  "Page Number",
  "Start Time",
  "End Time",
  "Text",
  "Target Text",
];

const TranslationErrorDialog = ({ openDialog, handleClose, message, response }) => {
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
                        <TableCell>{item.index}</TableCell>
                        <TableCell>{item.page_number}</TableCell>
                        <TableCell>{item.start_time}</TableCell>
                        <TableCell>{item.end_time}</TableCell>
                        <TableCell>{item.text}</TableCell>
                        <TableCell>{item.target_text}</TableCell>
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

export default TranslationErrorDialog;
