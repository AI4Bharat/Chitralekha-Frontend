import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import CustomizedSnackbars from "./Snackbar";

//APIs
import FetchSpeakerInfoAPI from "../redux/actions/api/Project/FetchSpeakerInfo";
import APITransport from "../redux/actions/apitransport/apitransport";
import UpdateSpeakerInfoAPI from "../redux/actions/api/Project/UpdateSpeakerInfo";

const SpeakerInfoDialog = ({
  open,
  handleClose,
  taskId,
  handleContinueEdit,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [speakerDetails, setSpeakerDetails] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const { speaker_info: speakerInfo } = useSelector(
    (state) => state.getSpeakerInfo.data
  );

  useEffect(() => {
    if (taskId) {
      const speakerObj = new FetchSpeakerInfoAPI(taskId);
      dispatch(APITransport(speakerObj));
    }
  }, [dispatch, taskId]);

  useEffect(() => {
    if (speakerInfo) {
      setSpeakerDetails(speakerInfo);
    }
  }, [speakerInfo]);

  const handleSpeakerInfoChange = useCallback((event, index) => {
    const {
      target: { value },
    } = event;

    setSpeakerDetails((prevState) => {
      const updatedSpeakerInfo = [...prevState];
      updatedSpeakerInfo[index].value = value;

      return updatedSpeakerInfo;
    });
  }, []);

  const handleUpdateSpeakerInfo = useCallback(async () => {
    setLoading(true);

    const apiObj = new UpdateSpeakerInfoAPI(taskId, speakerDetails);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "An error occurred.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [taskId, speakerDetails]);

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  }, [snackbar]);

  return (
    <>
      {renderSnackBar()}
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
          {speakerDetails?.map((item, index) => {
            return (
              <Grid key={`speaker-info-${index}`} container sx={{ mt: "20px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    label={`Speaker ${index + 1}`}
                    value={item.label}
                    disabled
                    sx={{ width: "95%" }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    label={`Speaker ${index + 1}`}
                    value={item.value}
                    onChange={(event) => handleSpeakerInfoChange(event, index)}
                    sx={{ width: "95%" }}
                  />
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>

        <DialogActions style={{ padding: "24px 24px 24px 0" }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => handleUpdateSpeakerInfo()}
          >
            Update
            {loading && <Loader size={20} margin="0 0 0 5px" color="primary" />}
          </Button>

          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={handleContinueEdit}
          >
            Continue Editing
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpeakerInfoDialog;
