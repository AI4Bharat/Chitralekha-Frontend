import React, { memo } from "react";
import { ProjectStyle } from "styles";
import { TextField } from "@mui/material";

const TimeBoxes = ({ handleTimeChange, time, index, type, readOnly }) => {
  const classes = ProjectStyle();

  return (
    <div style={{display: "flex", margin:"0"}}>
      <TextField
        variant="standard"
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "hours")
        }
        value={time.split(":")[0]}
        onFocus={(event) => event.target.select()}
        className={classes.timeInputBox}
        InputProps={{ readOnly:readOnly }}
        style={{
          // paddingLeft: "10px",
          // marginLeft: type === "endTime" ? "auto" : "",
        }}
      />

      <TextField
        variant="standard"
        value={":"}
        style={{ width: "1ch" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[1]}
        className={classes.timeInputBox}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 100 }, readOnly:readOnly }}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "minutes")
        }
      />

      <TextField
        
        variant="standard"
        value={":"}
        style={{ width: "1ch" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[0]}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 100 }, readOnly:readOnly }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "seconds")
        }
        // style={{
          
        // }}
      />

      <TextField
        variant="standard"
        value={"."}
        style={{ width: "1ch" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[1]}
        style={{width: "3ch"}}
        // style={{ width: "20%", paddingRight: "10px" }}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 999 }, readOnly:readOnly }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "miliseconds")
        }
      />
    </div>
  );
};

export default memo(TimeBoxes);