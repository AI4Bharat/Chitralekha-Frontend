import { Box, TextField } from "@mui/material";
import React from "react";
import ProjectStyle from "../styles/ProjectStyle";

const TimeBoxes = ({ handleTimeChange, time, index, type }) => {
  const classes = ProjectStyle();

  return (
    <Box display="flex">
      <TextField
        variant="standard"
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "hours")
        }
        value={time.split(":")[0]}
        onFocus={(event) => event.target.select()}
        className={classes.timeInputBox}
        style={{
          paddingLeft: "10px",
          marginLeft: type === "endTime" ? "auto" : "",
        }}
      />

      <TextField
        variant="standard"
        value={":"}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[1]}
        className={classes.timeInputBox}
        InputProps={{ inputProps: { min: 0, max: 100 } }}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "minutes")
        }
      />

      <TextField
        variant="standard"
        value={":"}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[0]}
        InputProps={{ inputProps: { min: 0, max: 100 } }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "seconds")
        }
      />

      <TextField
        variant="standard"
        value={"."}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[1]}
        style={{ width: "12%", paddingRight: "10px" }}
        InputProps={{ inputProps: { min: 0, max: 999 } }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "miliseconds")
        }
      />
    </Box>
  );
};

export default TimeBoxes;
