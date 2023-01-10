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
  console.log(data, "datavalue");

  const [Previewdata, setPreviewdata] = useState();
  console.log(Previewdata?.data?.payload, "PreviewdataPreviewdata");
  useEffect(() => {
    setPreviewdata(data);
  }, [data]);
  return (
    <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {Previewdata?.data?.payload.map((el, i) => {
            return (
              <Box
                id={`sub_${i}`}
                textAlign={"start"}
                sx={{
                  marginY: 2,
                  padding: 2,
                  border: "1px solid #000000",
                  borderRadius: 2,
                  width: "80%",
                }}
              >
                {el.text}
              </Box>
            );
          })}
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
