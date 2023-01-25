import React, { useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Popover,
  FormGroup,
  FormControlLabel,
  Radio,
  Box,
  Checkbox
} from "@mui/material";
import { translate } from "../config/localisation";
import DatasetStyle from "../styles/Dataset";
import { snakeToTitleCase } from "../utils/utils";

const FilterList = (props) => {
  const classes = DatasetStyle();
  const { filterStatusData, currentFilters, updateFilters } = props;
  const [selectedStatus, setSelectedStatus] = useState(
    currentFilters.task_Status
  );


  const handleStatusChange = (e) => {
    updateFilters({
      ...currentFilters,
      task_Status: selectedStatus,
    });
    props.handleClose();
  };

  const handleChangeCheckbox = (event) =>{
    if (event.target.value === selectedStatus) {
        setSelectedStatus("");
      } else {
        setSelectedStatus(event.target.value);
      }
  }

  return (
    <div>
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className={classes.filterContainer}>
          <Typography
            variant="body2"
            sx={{ mr: 5, fontWeight: "700" }}
            className={classes.filterTypo}
          >
            Status :
          </Typography>
          <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
            {filterStatusData.map((type) => {
              return (
                <FormControlLabel
                  control={
                     <Checkbox 
                      checked={selectedStatus === type ? true : false}
                      //onChange={handleChangeCheckbox}
                      name={type}
                      color="primary"
                      inputProps={{ 'aria-label': 'controlled' }}
                      
                    />
                  }
                  onChange={handleChangeCheckbox}
                  value={type}
                  label={snakeToTitleCase(type)}
                  sx={{
                    fontSize: "1rem",
                  }}
                />
              );
            })}
          </FormGroup>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              columnGap: "10px",
            }}
          >
            <Button
              onClick={props.handleClose}
              variant="outlined"
              color="primary"
              size="small"
              className={classes.clearAllBtn}
            >
              {" "}
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              variant="contained"
              color="primary"
              size="small"
              className={classes.clearAllBtn}
            >
              {" "}
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};
export default FilterList;
