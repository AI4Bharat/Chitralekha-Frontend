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
import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { maxHeight } from "@mui/system";
import DatasetStyle from "../../../styles/Dataset";
import TaskVideoDialog from "../../../common/TaskVideoDialog";
import ComparisionTableAPI from "../../../redux/actions/api/Project/ComparisonTable";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";

const ComparisonTable = (id) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  
  const taskList = useSelector((state) => state.getTaskList.data);

  const [selectValue, setSelectValue] = useState([{ id: 0, value: "" }]);
  const [selectTranscriptionValue, setSelectTranscriptionValue] = useState([{ id: 0, value: "" }]);

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

  let projectid ;
  let videoname;
  useEffect(() => {
    taskList?.map((element, index) => {
      projectid= element.id; 
      videoname= element.video_name


    });
  }, [taskList]);

  useEffect(() => {
    const apiObj = new FetchTaskListAPI();
    dispatch(APITransport(apiObj));
  }, []);

const handleSubmit = () =>{
 const data ={
  type:selectTranscriptionValue,
  payload:"data"
 }

  const projectObj = new ComparisionTableAPI(projectid,data);
  dispatch(APITransport(projectObj));
}
 





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
  const handleChangeTranscriptionType = (e, indx) => {
    const {
      target: { value },
    } = e;
    setSelectTranscriptionValue((prev) => {
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


  const renderTranscriptionType = useMemo(() => {
    return (
      <Grid container spacing={2}>
        {selectTranscriptionValue.map((select, indx) => {
          return (
            <Grid key={indx} item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth>
                <InputLabel key={indx} id="demo-multi-select-label">
                Transcription Type
                </InputLabel>
                <Select
                  key={`multi-${indx}`}
                  labelId="demo-multi-select-label"
                  id="demo-multi-select"
                  label=" Transcription Type"
                  onChange={(e) => handleChangeTranscriptionType(e, indx)}
                  value={selectTranscriptionValue[indx].value}
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
            </Grid>
          );
        })}
      </Grid>
    );
  }, [selectTranscriptionValue]);

  return (
    <Grid container spacing={2} style={{ alignItems: "center" }}>
      <Card className={classes.orgCard}>
        <TaskVideoDialog  videoName={videoname}/>
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
        {renderTranscriptionType}
        
        <Button  onClick={handleSubmit} variant="contained" size="large" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Card>
    </Grid>
  );
};

export default ComparisonTable;
