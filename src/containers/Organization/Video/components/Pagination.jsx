import { Select, IconButton, MenuItem, Typography } from "@mui/material";
import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";

const Pagination = ({
  range,
  rows,
  previous,
  next,
  onClick,
  jumpTo,
  durationError,
  completedCount,
}) => {
  const [page, setPage] = useState(1);

  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

  const getDisbled = (navigate = true) => {
    if (!navigate) {
      return true;
    }

    if (transcriptPayload?.source_type !== "MACHINE_GENERATED") {
      return durationError?.some((item) => item === true);
    }

    return false;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%"
      }}
    >
      <Box>
        <Typography variant="body2" margin="0 5px 0 0">
          Completed: {completedCount} / {rows}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="body2" margin="0 5px 0 0">
          Jump to page:
        </Typography>

        <Select
          variant="standard"
          disableUnderline
          autoWidth
          value={page}
          onChange={(event) => setPage(event.target.value)}
        >
          {jumpTo.map((item) => {
            return (
              <MenuItem
                value={item}
                onClick={() => onClick(item)}
                disabled={getDisbled()}
              >
                {item}
              </MenuItem>
            );
          })}
        </Select>

        <Typography variant="body2" margin="0 15px 0 35px">
          {range} of {rows}
        </Typography>

        <IconButton
          disabled={getDisbled(previous)}
          onClick={() => onClick(previous)}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton disabled={getDisbled(next)} onClick={() => onClick(next)}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default Pagination;
