import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MenuProps } from "utils";

//Components
import {
  Box,
  Select,
  IconButton,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Pagination = ({
  range,
  rows,
  previous,
  next,
  onClick,
  jumpTo,
  durationError,
  completedCount,
  current = 1,
}) => {
  const [page, setPage] = useState(current);

  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );
  const xl = useMediaQuery("(min-width:1440px)");

  const getDisbled = (navigate = true) => {
    if (!navigate) {
      return true;
    }

    if (
      taskData?.task_type?.includes("VOICEOVER") &&
      transcriptPayload?.source_type !== "MACHINE_GENERATED"
    ) {
      if (durationError?.some((item) => item === true)) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    setPage(current);
  }, [current]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        ...(!xl && {
          flexDirection: "column",
        }),
        ...(transcriptPayload.source_type === "MACHINE_GENERATED" && {
          width: "auto",
        }),
      }}
    >
      <Box>
        {taskData?.task_type?.includes("VOICEOVER") &&
          transcriptPayload.source_type !== "MACHINE_GENERATED" && (
            <Typography variant="body2" margin="0 5px 0 0">
              Completed: {completedCount} / {rows}
            </Typography>
          )}
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="body2" margin="0 5px 0 0">
          Jump to page:
        </Typography>

        <Select
          variant="standard"
          disableUnderline
          autoWidth
          MenuProps={MenuProps}
          value={page}
          onChange={(event) => setPage(event.target.value)}
          sx={{
            "& .MuiSelect-select": {
              fontSize: "0.875rem !important",
              paddingBottom: "4px",
            },
          }}
        >
          {jumpTo.map((item, index) => {
            return (
              <MenuItem
                key={index}
                value={item}
                onClick={() => onClick(item)}
                disabled={getDisbled()}
              >
                {item}
              </MenuItem>
            );
          })}
        </Select>

        <Typography variant="body2" margin="0 15px 0 15px">
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
