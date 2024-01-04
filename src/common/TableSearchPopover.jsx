import React, { useState } from "react";
import { Button, Divider, Popover, Box, TextField } from "@mui/material";
import { useDispatch } from "react-redux";

const TableSearchPopover = ({
  open,
  anchorEl,
  handleClose,
  searchedCol,
  currentFilters,
  updateFilters,
}) => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState(
    currentFilters[searchedCol.name]
  );

  const handleSubmitSearch = async (e) => {
    document.getElementById(searchedCol.name + "_btn").style.color = "#2C2799";

    dispatch(
      updateFilters({
        ...currentFilters,
        [searchedCol.name]: searchValue,
      })
    );

    handleClose();
  };

  const handleClearSearch = () => {
    dispatch(
      updateFilters({
        ...currentFilters,
        [searchedCol.name]: "",
      })
    );
    setSearchValue("");
    document.getElementById(searchedCol.name + "_btn").style.color =
      "rgba(0, 0, 0, 0.54)";
    handleClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder={`Search ${searchedCol.label}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ padding: 0 }}
          inputProps={{
            style: {
              fontSize: "16px",
            },
          }}
        />
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleClearSearch}
            variant="outlined"
            color="primary"
            size="small"
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmitSearch}
            variant="contained"
            color="primary"
            size="small"
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};
export default TableSearchPopover;
