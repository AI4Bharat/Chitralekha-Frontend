import {
  Grid,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { useMemo } from "react";

const ComparisonTable = () => {
  const [noOfSelect, setNoOfSelect] = useState([0]);
  const [selectValue, setSelectValue] = useState([]);
  const dropDown = [
    {
      key: "mg",
      value: "Machine Generated",
    },
    {
      key: "og",
      value: "Original Source",
    },
    {
      key: "mu",
      value: "Manually Uploaded",
    },
  ];

  const addType = (indx) => {
    const count = Object.assign([], noOfSelect);
    const select = Object.assign([],selectValue);
    count.push(indx+1);
    select.splice(indx,0,[]);
    setNoOfSelect(count);
    setSelectValue(select);
  };

  const deleteType = (indx) => {
      const count = Object.assign([],noOfSelect);
      const select = Object.assign([],selectValue);
      count.splice(indx,1);
      select.splice(indx,1);
      setNoOfSelect(count);
      setSelectValue(select);
  };

  const renderActionButton = (indx) => {
    return (
      <Grid item>
        <IconButton
          disabled={noOfSelect.length === dropDown.length}
          onClick={()=>addType(indx)}
        >
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton
          disabled={noOfSelect.length === 1}
          onClick={() => deleteType(indx)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Grid>
    );
  };

  const handleChange = (e, index) => {
    const {
      target: { value },
    } = e;
    let result = [...selectValue];
    result.push({ selectIdx: index, value });
    setSelectValue(result);
  };

  const renderDropDown = () => {
    if (noOfSelect.length === 1)
      return (
        <Grid container spacing={2}>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Compare with
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Compare with"
                onChange={(e) => handleChange(e, 0)}
                value={selectValue[0]?.value}
              >
                {dropDown.map((el, i) => {
                  return (
                    <MenuItem key={i} value={el.value}>
                      {el.value}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {renderActionButton(0)}
          </Grid>
        </Grid>
      );
    return (
      <Grid container spacing={2}>
        {noOfSelect.map((select, indx) => {
          return (
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl fullWidth>
                <InputLabel key={select} id="demo-multi-select-label">
                  Compare with
                </InputLabel>
                <Select
                  key={`multi-${indx}`}
                  labelId="demo-multi-select-label"
                  id="demo-multi-select"
                  label="Compare with"
                  onChange={(e) => handleChange(e, indx)}
                  value={selectValue[indx]?.value}
                >
                  {dropDown.map((el, i) => {
                    return (
                      <MenuItem key={i} value={el.value}>
                        {el.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {renderActionButton(indx)}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderTableData = () => {};

  return (
    <Grid container spacing={2} style={{ alignItems: "center" }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h3">Compare Transcription Type</Typography>
      </Grid>
      {renderDropDown()}
      {renderTableData()}
    </Grid>
  );
};

export default ComparisonTable;
