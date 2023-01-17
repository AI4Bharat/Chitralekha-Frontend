import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OutlinedTextField from "../common/OutlinedTextField";

const PreviewDialog = ({ openPreviewDialog, handleClose, data }) => {
  const [Previewdata, setPreviewdata] = useState();

  useEffect(() => {
    setPreviewdata(data);
  }, [data]);
  return (
    <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent sx={{height:"410px"}}>
        <DialogContentText id="alert-dialog-description">
          { Previewdata?.data?.payload &&  Previewdata?.data?.payload.length > 0 ? Previewdata?.data?.payload.map((el, i) => {
            return (
              <Box
                id={`sub_${i}`}
                textAlign={"start"}
                sx={{
                  margin: 2,
                  padding: 2,
                  border: "1px solid #000000",
                  borderRadius: 2,
                  width: "90%",
                }}
              >
                {el.text}
              </Box>
            );
          }) : <Box sx={{
            marginY: 2,
            padding: 3,
            border: "1px solid #000000",
            borderRadius: 2,
            width: "80%",
          }}></Box>}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "20px" }}>
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

export default PreviewDialog;
