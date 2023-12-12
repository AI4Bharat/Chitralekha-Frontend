import React from "react";
import { useSelector } from "react-redux";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { speakerInfoOptions } from "config";

const ExportDialog = ({
  open,
  handleClose,
  taskType,
  exportTypes,
  handleExportSubmitClick,
  handleExportRadioButtonChange,
}) => {
  const { transcription, translation, voiceover, speakerInfo } = exportTypes;

  const transcriptExportTypes = useSelector(
    (state) => state.getTranscriptExportTypes.data.export_types
  );
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );
  const voiceoverExportTypes = useSelector(
    (state) => state.getVoiceoverExportTypes.data.export_types
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Export Subtitles</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="select-export-types" sx={{ mt: 2 }}>
          Select Type
        </DialogContentText>
        {taskType?.includes("TRANSCRIPTION") ? (
          <DialogActions sx={{ mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup row>
                {transcriptExportTypes?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    checked={transcription === item}
                    label={item}
                    name="transcription"
                    onClick={(event) => handleExportRadioButtonChange(event)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogActions>
        ) : taskType?.includes("VOICEOVER") ? (
          <DialogActions sx={{ mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup row>
                {voiceoverExportTypes?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    checked={voiceover === item}
                    label={item}
                    name="voiceover"
                    onClick={(event) => handleExportRadioButtonChange(event)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogActions>
        ) : (
          <DialogActions sx={{ mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup row>
                {translationExportTypes?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    checked={translation === item}
                    label={item}
                    name="translation"
                    onClick={(event) => handleExportRadioButtonChange(event)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogActions>
        )}

        {!taskType?.includes("VOICEOVER") ? (
          <>
            <DialogContentText id="select-speaker-info" sx={{ mt: 2 }}>
              Speaker Info
            </DialogContentText>
            <DialogActions sx={{ my: 1, justifyContent: "flex-start" }}>
              <FormControl>
                <RadioGroup row>
                  {speakerInfoOptions?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      value={item.value}
                      control={<Radio />}
                      checked={speakerInfo === item.value}
                      label={item.label}
                      name="speakerInfo"
                      onClick={(event) => handleExportRadioButtonChange(event)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogActions>
          </>
        ) : (
          <>
            {/* <DialogContentText id="select-speaker-info" sx={{ mt: 2 }}>
              Background Music
            </DialogContentText>
            <DialogActions sx={{ my: 1, justifyContent: "flex-start" }}>
              <FormControl>
                <RadioGroup row>
                  {bgMusicOptions?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      value={item.value}
                      control={<Radio />}
                      checked={bgMusic === item.value}
                      label={item.label}
                      name="bgMusic"
                      onClick={(event) => handleExportRadioButtonChange(event)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogActions> */}
          </>
        )}

        <DialogActions>
          <Button
            variant="contained"
            onClick={handleExportSubmitClick}
            style={{ borderRadius: "8px" }}
            autoFocus
          >
            Export
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
