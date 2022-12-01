import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";

const RightPanel = () => {
  const classes = ProjectStyle();

  const [sourceText, setSourceText] = useState("");
  const [lang, setLang] = useState("hi");

  return (
    <Box
      sx={{
        display: "flex",
        borderLeft: "1px solid #eaeaea",
      }}
      width="20%"
      flexDirection="column"
    >
      <Button variant="contained" className={classes.findBtn}>
        Find/Search
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #eaeaea",
          overflowY: "scroll",
          height: "100%"
        }}
      >
        <IndicTransliterate
          lang={"hi"}
          value={sourceText}
          onChangeText={(text) => {
            setSourceText(text);
          }}
          renderComponent={(props) => (
            <textarea className={classes.customTextarea} rows={4} {...props} />
          )}
        />
        <IndicTransliterate
          lang={lang}
          value={sourceText}
          onChangeText={(text) => {
            setSourceText(text);
          }}
          renderComponent={(props) => (
            <textarea className={classes.customTextarea} rows={4} {...props} />
          )}
        />
        <IndicTransliterate
          lang={lang}
          value={sourceText}
          onChangeText={(text) => {
            setSourceText(text);
          }}
          maxOptions={5}
          renderComponent={(props) => (
            <textarea className={classes.customTextarea} rows={4} {...props} />
          )}
        />
        <IndicTransliterate
          lang={lang}
          value={sourceText}
          onChangeText={(text) => {
            setSourceText(text);
          }}
          maxOptions={5}
          renderComponent={(props) => (
            <textarea className={classes.customTextarea} rows={4} {...props} />
          )}
        />
      </Box>
    </Box>
  );
};

export default RightPanel;
