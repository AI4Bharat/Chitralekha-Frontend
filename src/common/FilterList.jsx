import React, { useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Popover,
  FormGroup,
  FormControlLabel,
  Box,
  Checkbox,
  Grid,
} from "@mui/material";
import DatasetStyle from "../styles/datasetStyle";
import { TaskTypes, TaskStatus } from "../config/taskItems";

const FilterList = (props) => {
  const classes = DatasetStyle();
  const { currentFilters, updateFilters, taskList } = props;
  const [selectedType, setSelectedType] = useState(currentFilters.taskType);
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.status);
  const [selectedSrcLanguage, setSelectedSrcLanguage] = useState(
    currentFilters.SrcLanguage
  );
  const [selectedTgtLanguage, setSelectedTgtLanguage] = useState(
    currentFilters.TgtLanguage
  );
  const handleChange = (e) => {
    updateFilters({
      ...currentFilters,
      taskType: selectedType,
      status: selectedStatus,
      SrcLanguage: selectedSrcLanguage,
      TgtLanguage: selectedTgtLanguage,
    });
    props.handleClose();
  };

  //   const handleChangeCheckbox = (event) =>{
  //     if (event.target.value === selectedStatus) {
  //         setSelectedStatus("");
  //       } else {
  //         setSelectedStatus(event.target.value);
  //       }
  //   }
  const handleDatasetChange = (e) => {
    if (e.target.checked) setSelectedType([...selectedType, e.target.name]);
    else {
      const selected = Object.assign([], selectedType);
      const index = selected?.indexOf(e.target.name);

      if (index > -1) {
        selected.splice(index, 1);
        setSelectedType(selected);
      }
    }
  };
  const handleStatusChange = (e) => {
    if (e.target.checked) setSelectedStatus([...selectedStatus, e.target.name]);
    else {
      const selected = Object.assign([], selectedStatus);
      const index = selected?.indexOf(e.target.name);

      if (index > -1) {
        selected.splice(index, 1);
        setSelectedStatus(selected);
      }
    }
  };

  const handleSrcLanguageChange = (e) => {
    if (e.target.checked)
      setSelectedSrcLanguage([...selectedSrcLanguage, e.target.name]);
    else {
      const selected = Object.assign([], selectedSrcLanguage);
      const index = selected?.indexOf(e.target.name);

      if (index > -1) {
        selected.splice(index, 1);
        setSelectedSrcLanguage(selected);
      }
    }
  };

  const handleTgtLanguageChange = (e) => {
    if (e.target.checked)
      setSelectedTgtLanguage([...selectedTgtLanguage, e.target.name]);
    else {
      const selected = Object.assign([], selectedTgtLanguage);
      const index = selected?.indexOf(e.target.name);

      if (index > -1) {
        selected.splice(index, 1);
        setSelectedTgtLanguage(selected);
      }
    }
  };

  const isChecked = (type, param) => {
    const index =
      param === "status"
        ? selectedStatus?.indexOf(type)
        : param === "taskType"
        ? selectedType?.indexOf(type)
        : param === "SrcLanguage"
        ? selectedSrcLanguage?.indexOf(type)
        : selectedTgtLanguage?.indexOf(type);
    if (index > -1) return true;
    return false;
  };

  const handleChangeCancelAll = () => {
    updateFilters({
      taskType: [],
      status: [],
      SrcLanguage :[],
      TgtLanguage:[],
    });
    props.handleClose();
  };

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
        <Grid container className={classes.filterContainer}>
        {taskList?.src_languages_list && taskList?.src_languages_list.length > 0 && (
          <>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <Typography
              variant="body2"
              sx={{ mr: 5,mb:1, fontWeight: "900" }}
              className={classes.filterTypo}
            >
              Source Language
            </Typography>
            <FormGroup>
              { taskList?.src_languages_list?.map((type, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={isChecked(type, "SrcLanguage")}
                        onChange={(e) => handleSrcLanguageChange(e)}
                        name={type}
                      />
                    }
                    label={type}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>
          </>
           )} 
         
        {taskList?.target_languages_list && taskList?.target_languages_list.length > 0 && (
          <>
           <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <Typography
              variant="body2"
              sx={{ mr: 5,mb:1, fontWeight: "900" }}
              className={classes.filterTypo}
            >
              Target Language
            </Typography>
            <FormGroup>
              { taskList?.target_languages_list?.map((type, index) => {
                return (
                  <FormControlLabel
                    key={index}  
                    control={
                      <Checkbox
                        checked={isChecked(type, "TgtLanguage")}
                        onChange={(e) => handleTgtLanguageChange(e)}
                        name={type}
                      />
                    }
                    label={type}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>  
          </> ) }
       
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <Typography
              variant="body2"
              sx={{ mr: 5,mb:1, fontWeight: "900" }}
              className={classes.filterTypo}
            >
              Status
            </Typography>
            <FormGroup>
              {TaskStatus?.map((type, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={isChecked(type.label, "status")}
                        onChange={(e) => handleStatusChange(e)}
                        name={type.label}
                      />
                    }
                    label={type.label}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>
      
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <Typography variant="body2" sx={{ mr: 5, mb:1,fontWeight: "900" }}>
              Task Type
            </Typography>
            <FormGroup>
              {TaskTypes?.map((type, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={isChecked(type.label, "taskType")}
                        onChange={(e) => handleDatasetChange(e)}
                        name={type.label}
                        color="primary"
                      />
                    }
                    label={type.label}
                  />
                );
              })}
            </FormGroup>
          </Grid>
        </Grid>
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
            onClick={handleChangeCancelAll}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Clear All
          </Button>
          <Button
            onClick={handleChange}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};
export default FilterList;
