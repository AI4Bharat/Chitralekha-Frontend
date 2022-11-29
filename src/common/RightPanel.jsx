import * as React from "react";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import ProjectStyle from "../styles/ProjectStyle";

const RightPanel = () => {
  const classes = ProjectStyle();

  return (
    <Box
      sx={{
        display: "flex",
        borderRight: "1px solid #eaeaea",
        overflowY: "scroll",
      }}
      width="20%"
      flexDirection="column"
    >
      <Button variant="contained" className={classes.findBtn}>
        Find/Search
      </Button>
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ padding: "24px 24px 0 24px", width: "auto" }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ padding: "24px 24px 0 24px", width: "auto" }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ padding: "24px 24px 0 24px", width: "auto" }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ padding: "24px 24px 0 24px", width: "auto" }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        sx={{ padding: "24px 24px 0 24px", width: "auto" }}
      />
    </Box>
  );
};

export default RightPanel;
