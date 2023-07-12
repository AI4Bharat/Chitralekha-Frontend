import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { APITransport, VerifyUpdateEmailAPI } from "redux/actions";
import OutlinedTextField from "./OutlinedTextField";
import { useDispatch, useSelector } from "react-redux";

const UpdateEmailDialog = ({
  isOpen,
  handleClose,
  oldEmail,
  newEmail,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const [oldEmailCode, setOldEmailCode] = useState("");
  const [newEmailCode, setNewEmailCode] = useState("");

  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "VERIFY_UPDATE_EMAIL") {
          onSuccess();
          handleClose();
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const verifyEmail = async () => {
    const apiObj = new VerifyUpdateEmailAPI(oldEmailCode, newEmailCode);
    dispatch(APITransport(apiObj));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      close
      fullWidth={true}
      maxWidth="sm"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Verify Email</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Grid container direction="column" sx={{ padding: "20px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography gutterBottom sx={{ fontSize: "1rem" }}>
            Code received on {oldEmail}:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ pb: "20px" }}>
          <OutlinedTextField
            fullWidth
            value={oldEmailCode}
            onChange={(e) => setOldEmailCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></OutlinedTextField>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography gutterBottom sx={{ fontSize: "1rem" }}>
            Code received on {newEmail}:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            value={newEmailCode}
            onChange={(e) => setNewEmailCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></OutlinedTextField>
        </Grid>
      </Grid>
      <DialogActions style={{ padding: 24 }}>
        <Button
          sx={{ borderRadius: "8px", lineHeight: 1 }}
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          sx={{ borderRadius: "8px", lineHeight: 1 }}
          disabled={!(oldEmailCode && newEmailCode)}
          onClick={verifyEmail}
          variant="contained"
        >
          {apiStatus.loading && (
            <CircularProgress size="0.8rem" color="secondary" />
          )}
          <span style={{ marginLeft: "10px" }}>Verify</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateEmailDialog;
