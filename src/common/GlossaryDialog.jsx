import React, { useState } from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { ProjectStyle } from "styles";

const GlossaryDialog = ({
  openDialog,
  handleClose,
  submit,
  selectedWord,
  title,
  language,
}) => {
  const classes = ProjectStyle();

  const [glossaryText, setGlossaryText] = useState("");

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth={"sm"}
      PaperProps={{ style: { borderRadius: "10px" } }}
      scroll="paper"
    >
      <DialogTitle display="flex" alignItems={"center"}>
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {selectedWord}
        </Typography>

        <IndicTransliterate
          lang={language}
          value={glossaryText}
          onChange={(event) => setGlossaryText(event.target.value)}
          onChangeText={() => { }}
          enabled={language !== "en"}
          className={classes.findReplaceTextbox}
          renderComponent={(props) => (
            <>
              <label className={classes.findReplaceTextboxLabel}>
                Suggestion
              </label>
              <div>
                <input {...props} />
              </div>
            </>
          )}
        />
      </DialogContent>

      <DialogActions sx={{ p: "0 20px 20px 20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => submit(glossaryText)}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlossaryDialog;
