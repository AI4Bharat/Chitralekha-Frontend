import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const Loader = ({ size, margin, color }) => {
  return (
    <Box display="flex" justifyContent="center" margin={margin}>
      <CircularProgress
        size={size ? size : 50}
        color={color ? color : "primary"}
      />
    </Box>
  );
};

export default Loader;
