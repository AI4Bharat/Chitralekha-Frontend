import React, { useEffect, useState } from "react";
import { configs, endpoints } from "config";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { ProjectStyle } from "styles";
import { MenuProps } from "utils";
import { APITransport, FetchSupportedLanguagesAPI } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { domains } from "config";

const GlossaryEditDialog = ({
  openDialog,
  handleClose,
  submit,
  title,
  selectedRow,

}) => {
  console.log(selectedRow);
  const classes = ProjectStyle();
  const dispatch = useDispatch();

  const [sourceText, setSourceText] = useState(selectedRow.source_text);
  const [targetText, setTargetText] = useState(selectedRow.target_text);
  const [sourceLanguage, setSourceLanguage] = useState(selectedRow.source_language);
  const [targetLanguage, setTargetLanguage] = useState(selectedRow.target_language);
  const [meaning, setMeaning] = useState(selectedRow.meaning);
  const [taskIds, setTaskIds] = useState(selectedRow.task_ids);
  const [domain, setDomain] = useState(selectedRow.context);
  const [enableTransliteration, setEnableTransliteration] = useState(true);

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(langObj));

    // eslint-disable-next-line
  }, []);

  const createGlossary = () => {
    let taskIDs = taskIds.split(",") .map(id => id.trim()).filter(id => id !== "").map(Number);
    const sentences = [
      {
        src: sourceText,
        tgt: targetText,
        locale: `${sourceLanguage}|${targetLanguage}`,
        meaning: meaning,
        domain,
        task_ids: taskIDs,
      },
    ];

    submit(sentences);
  };

  const enableHandler = (currentLang) => {
    if (currentLang === "en") {
      return false;
    } else {
      return enableTransliteration;
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px", height: "67%" } }}
      scroll="paper"
    >
      <DialogTitle display="flex" alignItems={"center"}>
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth sx={{ mt: 3, width: "98%" }}>
              <InputLabel id="select-source-Language">
                Source Language
              </InputLabel>
              <Select
                fullWidth
                labelId="select-source-Language"
                label="Source Language"
                value={sourceLanguage}
                onChange={(event) => setSourceLanguage(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                disabled={true}
              >
                {supportedLanguages?.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl
              fullWidth
              sx={{ mt: 3, width: "98%", float: "inline-end" }}
            >
              <InputLabel id="select-Language">Target Language</InputLabel>
              <Select
                fullWidth
                labelId="select-target-Language"
                label="Target Language"
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                disabled={true}
              >
                {supportedLanguages?.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item md={12} xs={12} sx={{ mt: 3 }}>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableTransliteration}
                      onChange={(event) =>
                        setEnableTransliteration(event.target.checked)
                      }
                    />
                  }
                  label="Transliteration"
                  sx={{
                    ".MuiFormControlLabel-label": {
                      fontSize: "18px",
                      fontWeight: 500,
                    },
                  }}
                />
              </FormGroup>
            </FormControl>
          </Grid> */}

          <Grid item md={6} xs={12} sx={{ mt: 3 }}>
            <IndicTransliterate
              customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
              apiKey={`JWT ${localStorage.getItem("token")}`}
              lang={sourceLanguage}
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              onChangeText={() => {}}
              enabled={enableHandler(sourceLanguage)}
              className={classes.findReplaceTextbox}
              disabled={true}
              renderComponent={(props) => (
                <>
                  <div class="mui-input-outlined">
                    <input
                      type="text"
                      id="outlined-input"
                      placeholder=""
                      {...props}
                      style={{color:'rgba(0, 0, 0, 0.38)'}}
                    />
                    <label for="outlined-input" style={{color:'rgba(0, 0, 0, 0.6)'}}>Source Text</label>
                  </div>
                </>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12} sx={{ mt: 3 }}>
            <IndicTransliterate
              customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
              apiKey={`JWT ${localStorage.getItem("token")}`}
              lang={targetLanguage}
              value={targetText}
              onChange={(event) => setTargetText(event.target.value)}
              onChangeText={() => {}}
              enabled={enableHandler(targetLanguage)}
              className={classes.findReplaceTextbox}
              disabled={true}
              renderComponent={(props) => (
                <>
                  <div
                    class="mui-input-outlined"
                    style={{ float: "inline-end" }}
                  >
                    <input
                      type="text"
                      id="outlined-input"
                      placeholder=""
                      {...props}
                      style={{color:'rgba(0, 0, 0, 0.38)'}}
                    />
                    <label for="outlined-input" style={{color:'rgba(0, 0, 0, 0.6)'}}>Target Text</label>
                  </div>
                </>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth sx={{ mt: 3}}>
            <div class="mui-input-outlined">
              <input
                className={classes.findReplaceTextbox}
                type="text"
                id="outlined-input"
                placeholder=""
                value={meaning}
                onChange={(event) => setMeaning(event.target.value)}
              />
              <label for="outlined-input">Text Meaning (Optional)</label>
            </div>
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth sx={{ mt: 3, width: "98%", marginLeft:"8px" }}>
              <InputLabel id="select-domain">Domain (Optional)</InputLabel>
              <Select
                fullWidth
                labelId="select-domain"
                label="Domain (Optional)"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
              >
                {domains?.map((item, index) => (
                  <MenuItem key={index} value={item.code}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <FormControl fullWidth sx={{ mt: 3}}>
            <div class="mui-input-outlined">
              <input
                className={classes.findReplaceTextbox}
                type="text"
                id="outlined-input"
                placeholder=""
                value={taskIds}
                onChange={(event) => setTaskIds(event.target.value)}
              />
              <label for="outlined-input">Task ID's (Optional)</label>
            </div>
            </FormControl>
          </Grid>
        </Grid>
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
          onClick={() => createGlossary()}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
          disabled={
            sourceText === "" ||
            targetText === "" ||
            sourceLanguage === "" ||
            targetLanguage === "" ||
            sourceLanguage === targetLanguage
          }
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlossaryEditDialog;
