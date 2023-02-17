import { Select, IconButton, MenuItem, Typography } from "@mui/material";
import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

const Pagination = ({ range, rows, previous, next, onClick, jumpTo }) => {
  const [page, setPage] = useState(1);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
            <MenuItem value={item} onClick={() => onClick(item)}>
              {item}
            </MenuItem>
          );
        })}
      </Select>

      <Typography variant="body2" margin="0 15px 0 35px">
        {range} of {rows}
      </Typography>

      <IconButton disabled={!previous} onClick={() => onClick(previous)}>
        <ChevronLeftIcon />
      </IconButton>

      <IconButton disabled={!next} onClick={() => onClick(next)}>
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
};

export default Pagination;
