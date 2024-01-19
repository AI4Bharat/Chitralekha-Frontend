import React, { useState } from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";

const GlossaryDialog = ({
  openDialog,
  handleClose,
  submit,
  selectedWord,
  title,
  language,
}) => {
  const [glossaryText, setGlossaryText] = useState("");

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      fullWidth
      maxWidth={"sm"}
      PaperProps={{ style: { borderRadius: "10px" } }}
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
          onChangeText={() => {}}
          containerStyles={{
            width: "100%",
            zIndex: 999999
          }}
          renderComponent={(props) => (
            <div>
              <TextField {...props} fullWidth label="Suggestion" />
              <input type="text" {...props} style={{display: "none"}} />
            </div>
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
          onClick={() => submit()}
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
