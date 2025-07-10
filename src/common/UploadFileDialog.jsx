import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DropzoneArea } from "react-mui-dropzone";

const UploadFileDialog = ({ openDialog, handleClose, title, handleSubmit }) => {
  const [uploadedFile, setUploadedFile] = useState();
  const [disableMultiClick, setDisableMultiClick] = useState(false);

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
      scroll="paper"
    >
      <DialogTitle display="flex" alignItems={"center"}>
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <DropzoneArea
          acceptedFiles={[".csv"]}
          showAlerts={false}
          showPreviews={true}
          showPreviewsInDropzone={false}
          useChipsForPreview
          previewGridProps={{ container: { spacing: 1, direction: "row" } }}
          filesLimit={1}
          previewText="Selected file:"
          onChange={(file) => setUploadedFile(file)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            setDisableMultiClick(true);
            setTimeout(() => {
              setDisableMultiClick(false);
            }, 5000);
            handleSubmit(uploadedFile);
          }}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
          disabled={disableMultiClick}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog;
