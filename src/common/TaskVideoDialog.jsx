import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import ComparisonTable from "../containers/Organization/Project/ComparisonTable";

const TaskVideoDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {  } = props;
  return (
    <>
      <Grid container spacing={2} align="center"justify="center" >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <Typography variant="h4" style={{ marginRight: "auto" }}>
            Our First School | Part 1/1 | English | Class 3
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <video
            controls
            src={
              "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskVideoDialog;
