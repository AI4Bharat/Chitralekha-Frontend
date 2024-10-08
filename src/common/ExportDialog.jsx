import React, { useEffect, useState } from "react";
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
  Checkbox,
  RadioGroup,
  Typography,
  FormGroup,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { speakerInfoOptions, bgMusicOptions } from "config";
import { MenuItem } from "react-contextmenu";

const ExportDialog = ({
  open,
  handleClose,
  task_type,
  taskType,
  exportTypes,
  handleExportSubmitClick,
  handleExportRadioButtonChange,
  handleExportCheckboxChange,
  isBulkTaskDownload,
  currentSelectedTasks,
  multiOptionDialog=false,
}) => {
  const { transcription, translation, voiceover, speakerInfo, bgMusic } =
    exportTypes;

  const [currentTaskType, setCurrentTaskType] = useState(taskType);

  const transcriptExportTypes = useSelector(
    (state) => state.getTranscriptExportTypes.data.export_types
  );
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );
  const voiceoverExportTypes = useSelector(
    (state) => state.getVoiceoverExportTypes.data.export_types
  );

  useEffect(() => {
    if (isBulkTaskDownload) {
      const tasks = currentSelectedTasks.map((item) => item.task_type);

      if (tasks.every((item) => item === "VOICEOVER_EDIT")) {
        setCurrentTaskType("VOICEOVER_EDIT");
      } else {
        setCurrentTaskType("TRANSLATION_EDIT");
      }
    } else {
      if(!multiOptionDialog){
        setCurrentTaskType(taskType);
      }
    }
  }, [taskType, isBulkTaskDownload, currentSelectedTasks]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        {multiOptionDialog ? 
        <Typography variant="h4">Export &nbsp;
          <Select value={currentTaskType} onChange={(event)=>{setCurrentTaskType(event.target.value)}}>
            <MenuItem key={1} value="TRANSCRIPTION_VOICEOVER_EDIT">Transcription</MenuItem>
            <MenuItem key={2} value="TRANSLATION_VOICEOVER_EDIT">Translation</MenuItem>
          </Select>
        </Typography>
        :
        <Typography variant="h4">Export {currentTaskType}</Typography>
        }
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
        {currentTaskType?.includes("TRANSCRIPTION") ? (
          <DialogActions sx={{ mb: 1, mt: 1 }}>
            <FormControl>
              <FormGroup row>
                {transcriptExportTypes?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={
                      <Checkbox 
                        checked={transcription.includes(item)}
                        onChange={(event) => handleExportCheckboxChange(event)}  
                      />
                    }
                    label={item}
                    name="transcription"
                  />
                ))}
              </FormGroup>
            </FormControl>
          </DialogActions>
        ) : currentTaskType?.includes("TRANSLATION") && task_type !== "VO" ? (
          <DialogActions sx={{ mb: 1, mt: 1 }}>
            <FormControl>
              <FormGroup row>
                {translationExportTypes?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={
                      <Checkbox 
                        checked={translation.includes(item)}
                        onChange={(event) => handleExportCheckboxChange(event)}  
                      />
                    }
                    label={item}
                    name="translation"
                  />
                ))}
                </FormGroup>
              </FormControl>
            </DialogActions>
          ) : (
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
                      disabled={isBulkTaskDownload && item === "mp4"}
                      onClick={(event) => handleExportRadioButtonChange(event)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogActions>
        )}

        {!currentTaskType?.includes("VOICEOVER") ? (
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
          <></>
        )}
{/* 
        {currentTaskType?.includes("VOICEOVER") && !isBulkTaskDownload && (
          <>
            <DialogContentText id="select-speaker-info" sx={{ mt: 2 }}>
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
            </DialogActions>
          </>
        )} */}

        <DialogActions>
          <Button
            variant="contained"
            onClick={multiOptionDialog ? () => handleExportSubmitClick(currentTaskType) : () => handleExportSubmitClick()}
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
