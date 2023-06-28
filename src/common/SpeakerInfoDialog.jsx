import React from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "./Spinner";

const SpeakerInfoDialog = ({ open, handleClose, loading }) => {
  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleClose}
      close
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Speaker Info</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container sx={{ mt: "20px" }}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField label={"Speaker 1"} sx={{ width: "95%" }} />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField label={"Speaker 1"} sx={{ width: "95%" }} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions style={{ padding: "24px 24px 24px 0" }}>
        <Button variant="outlined" sx={{ borderRadius: 2 }}>
          Update
          {loading && <Loader size={20} margin="0 0 0 5px" color="secondary" />}
        </Button>

        <Button autoFocus variant="contained" sx={{ borderRadius: 2 }}>
          Continue Editing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpeakerInfoDialog;
