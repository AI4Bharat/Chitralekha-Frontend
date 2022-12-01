import {
  Grid,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCallback, useState } from "react";
import { useMemo } from "react";
import { maxHeight } from "@mui/system";
import DatasetStyle from "../../../styles/Dataset";
import TaskVideoDialog from "../../../common/TaskVideoDialog";

const ComparisonTable = () => {
  const classes = DatasetStyle();
  const [selectValue, setSelectValue] = useState([{ id: 0, value: "" }]);
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

  const dummyData = [
    {
      key: "mg",
      values: [
        "Dummy1",
        "Dummy2",
        "Dummy3",
        "Dummy4",
        "Dummy5",
        "Dummy1",
        "Dummy2",
        "Dummy3",
        "Dummy4",
        "Dummy5",
      ],
    },
    {
      key: "mu",
      values: [
        "Dummy6",
        "Dummy7",
        "Dummy8",
        "Dummy9",
        "Dummy10",
        "Dummy6",
        "Dummy7",
        "Dummy8",
        "Dummy9",
        "Dummy10",
      ],
    },
    {
      key: "og",
      values: [
        "Dummy11",
        "Dummy12",
        "Dummy13",
        "Dummy14",
        "Dummy15",
        "Dummy11",
        "Dummy12",
        "Dummy13",
        "Dummy14",
        "Dummy15",
      ],
    },
  ];

  const addType = (indx) => {
    setSelectValue((prev) => {
      return [...prev, { id: indx + 1, value: "" }];
    });
  };

  const deleteType = (indx) => {
    setSelectValue((prev) => {
      const result = JSON.parse(JSON.stringify(Object.assign([], prev)));
      return result.filter((res, i) => {
        return i !== indx;
      });
    });
  };

  const renderActionButton = (indx) => {
    return (
      <Grid item sx={{ mt: 1 }}>
        <IconButton
          color="primary"
          disabled={dropDown.length <= selectValue.length}
          onClick={() => addType(indx)}
        >
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton
          color="error"
          disabled={selectValue.length === 1}
          onClick={() => deleteType(indx)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Grid>
    );
  };

  const handleChange = (e, indx) => {
    const {
      target: { value },
    } = e;
    setSelectValue((prev) => {
      const result = JSON.parse(JSON.stringify(Object.assign([], prev)));
      result.forEach((res, i) => {
        if (i === indx) {
          result[i].value = value;
        }
      });
      return result;
    });
  };

  const renderTableData = (data) => {
    console.log(data);
    if (!!data) {
      const values = dummyData
        .filter((el) => el.key === data)
        .map((el) => el.values)[0];
      return (
        <div className={classes.tableData}>
          {values.map((value) => {
            return (
              <Typography className={classes.Typographyvalue}>
                {value}
              </Typography>
            );
          })}
        </div>
      );
    }
    return <></>;
  };

  const renderDropDown = useMemo(() => {
    return (
      <Grid container spacing={2}>
        {selectValue.map((select, indx) => {
          return (
            <Grid key={indx} item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth>
                <InputLabel key={indx} id="demo-multi-select-label">
                  Compare with
                </InputLabel>
                <Select
                  key={`multi-${indx}`}
                  labelId="demo-multi-select-label"
                  id="demo-multi-select"
                  label="Compare with"
                  onChange={(e) => handleChange(e, indx)}
                  value={selectValue[indx].value}
                >
                  {dropDown.map((el, i) => {
                    return (
                      <MenuItem key={`${el.key}-${i}`} value={el.key}>
                        {el.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {renderActionButton(indx)}
              {renderTableData(selectValue[indx]?.value)}
            </Grid>
          );
        })}
      </Grid>
    );
  }, [selectValue]);

  return (
    <Grid container spacing={2} style={{ alignItems: "center" }}>
      <Card className={classes.orgCard}>
        <TaskVideoDialog />
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <Typography variant="h4">Compare Transcription Type</Typography>
        </Grid>
        {renderDropDown}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ mb: 4, mt: 3 }}
        >
          <Typography variant="h4">Select Transcription Type</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-multi-select-label">Compare with</InputLabel>
            <Select
              //key={`multi-${indx}`}
              labelId="demo-multi-select-label"
              id="demo-multi-select"
              label="Compare with"
              onChange={(e) => handleChange(e)}
              //value={selectValue[indx].value}
            >
              return (<MenuItem>data</MenuItem>
              );
            </Select>
          </FormControl>
        </Grid>
        <Button variant="contained" size="large" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Card>
    </Grid>
  );
};

export default ComparisonTable;
