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
  CircularProgress
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
import { useNavigate, useParams } from "react-router-dom";
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";
import CompareTranscriptionSource from "../../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../../redux/actions/api/Project/SetComparisonTableData";
import Spinner from "../../../common/Spinner";
import FetchTaskDetailsAPI from "../../../redux/actions/api/Project/FetchTaskDetails";
import FetchTranscriptTypesAPI from "../../../redux/actions/api/Project/FetchTranscriptTypes";
import CustomizedSnackbars from "../../../common/Snackbar";

const ComparisonTable = () => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentLoadingSectionIndex, setCurrentLoadingSectionIndex] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const { projectId } = useParams();

  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedTranscriptType, setSelectTranscriptType] = useState("");

  const taskList = useSelector((state) => state.getTaskList.data);
  const comparsionData = useSelector((state) => state.setComparisonTable.data);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);

  useEffect(()=>{
    if(comparsionData){
      setLoading(false);
      setCurrentLoadingSectionIndex("");
    }
  },[comparsionData])
  
  useEffect(() => {
    const obj = new FetchTaskDetailsAPI(id)
    dispatch(APITransport(obj));
  }, [])

  const getComparisonData = () => {
    if (Object.keys(comparsionData).length) {
      return Object.keys(comparsionData).map((value, id) => {
        return { id, value };
      });
    }
    return [{ id: 0, value: "" }];
  };
  const [selectValue, setSelectValue] = useState(getComparisonData());
  
  const [selectTranscriptionValue, setSelectTranscriptionValue] = useState([
    { id: 0, value: "" },
  ]);

  // useEffect(()=>{
  //   console.log("selectValue -------- ", selectValue);
  // }, [])

  useEffect(() => {
    setSelectValue(getComparisonData());
  }, [comparsionData]);

  const dropDown = [
    {
      key: "MACHINE_GENERATED",
      value: "Machine Generated",
    },
    {
      key: "ORIGINAL_SOURCE",
      value: "Original Source",
    },
    {
      key: "MANUALLY_CREATED",
      value: "Manually Created",
    },
  ];

  let projectid;
  let videoname;
  useEffect(() => {
    taskList?.map((element, index) => {
      projectid = element.id;
      videoname = element.video_name;
    });
  }, [taskList]);

  useEffect(() => {
    const apiObj = new FetchTaskListAPI();
    dispatch(APITransport(apiObj));

    const obj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(obj));
  }, [taskDetails]);

  const handleSubmit = async() => {
    let data = {};

    if(selectedTranscriptType === "MANUALLY_CREATED") {
      data = {
        type: selectedTranscriptType,
        payload: {
          payload: []
        }
      }
    } else {
      const [key, value] = Object.entries(comparsionData).find(([key]) => (selectedTranscriptType === key)) || [];

      data = {
        type: key,
        payload: {
          payload: value
        }
      };
    }
    
    const projectObj = new ComparisionTableAPI(taskDetails.id, data);
    //dispatch(APITransport(projectObj));

    
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })
      navigate(`/task/${taskDetails.id}/transcript`)
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  };

  const postCompareTranscriptionSource = (id, sourceTypeList, loadingIndex) => {
    setLoading(true);
    setCurrentLoadingSectionIndex(loadingIndex);
    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message:  rsp_data?.message,
          variant: "success",
        })
        dispatch(setComparisonTable(rsp_data));
      } else {
        ///console.log("failed");
        setSnackbarInfo({
          open: true,
          message: rsp_data?.message,
          variant: "error",
        })
      }
    });
  };

  useEffect(() => {
    const sourceTypeList = JSON.parse(localStorage.getItem("sourceTypeList"));
    const id = localStorage.getItem("sourceId");
    if (!!sourceTypeList && sourceTypeList.length)
      postCompareTranscriptionSource(id, sourceTypeList, 0);
  }, []);

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
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
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
          const id = JSON.parse(
            JSON.stringify(localStorage.getItem("sourceId"))
          );
          postCompareTranscriptionSource(id, [value], indx);
          result[i].value = value;
        }
      });
      return result;
    });
  };

  const renderTableData = (data) => {
    if (!!data) {
      const keys = Object.keys(comparsionData);
      let renderResult = [];
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === data) {
          renderResult.push(comparsionData[keys[i]]);
        }
      }
      renderResult = renderResult.flat();
      return (
        <div className={classes.tableData}>
          {renderResult.map((el, i) => {
            if (el.text)
         
              return (
                <>
                <Typography className={classes.Typographyvalue}>
                  {el.text}
                </Typography>
                </>
              );
          })}
        </div>
      );
    }
    return <></>;
  };
  
  const renderDropDown = useMemo(() => {
    return (
      <Grid container spacing={8}>
        {selectValue.map((select, indx) => {
          return (
            <Grid key={indx} item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                  value={selectValue[indx]?.value}
                >
                  {transcriptTypes.map((el, i) => {
                    return (
                      <MenuItem key={i} value={el.value}>
                        {el.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {renderActionButton(indx)}
              {loading && currentLoadingSectionIndex == indx ? 
                <div 
                  className={classes.tableData} 
                  style={{textAlign: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}
                >
                  <CircularProgress sx={{alignSelf: "center"}} />
                </div> 
                : renderTableData(selectValue[indx]?.value)}
            </Grid>
          );
        })}
      </Grid>
    );
  }, [selectValue]);
  
  const renderTranscriptionType = useMemo(() => {
    const currentTranscriptTypes = Object.keys(comparsionData);
    const filteredDropDown = transcriptTypes.filter(dl => currentTranscriptTypes.includes(dl.value))

    return (
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-multi-select-label">
            Transcription Type
          </InputLabel>
          <Select
            labelId="demo-multi-select-label"
            id="demo-multi-select"
            label="Transcription Type"
            onChange={(e) => setSelectTranscriptType(e.target.value)}
            value={selectedTranscriptType}
          >
            <MenuItem key={0} value={"MANUALLY_CREATED"}>Manually Created</MenuItem>
            {filteredDropDown.map((el, i) => {
              return (
                <MenuItem key={i} value={el.value}>
                  {el.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    );
  }, [selectTranscriptionValue, comparsionData, selectedTranscriptType]);

  return (
    <Grid container spacing={1} style={{ alignItems: "center" }}>
      {/* {loading && <Spinner  />} */}
      {renderSnackBar()}
      <Card className={classes.orgCard}>
        <TaskVideoDialog 
          videoName={taskDetails.video_name} 
          videoUrl={taskDetails.video_url}
          projectId={taskDetails.project}
          lang={taskDetails.src_language}
        />
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <Typography variant="h4">Compare Transcription Type</Typography>
        </Grid>
        {renderDropDown}
        {Object.keys(comparsionData).length ? (
          <Grid container  direction='row' sx={{ mb: 2, mt: 3, alignItems: "center", }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={1}
              xl={1}
            >
              <Typography variant="h4">Select :</Typography>
             
              </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
              xl={9}
            >
               {renderTranscriptionType}
           </Grid>
           

           </Grid>  
        ) : (
          <></>
        )}
 <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          sx={{ mt: 3,width:"120px" }}
          disabled={!selectValue[0]?.value}
        >
          Submit
        </Button>
      
      </Card>
    </Grid>
  );
};

export default ComparisonTable;
