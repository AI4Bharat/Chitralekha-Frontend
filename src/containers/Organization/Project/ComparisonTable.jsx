import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//Styles
import { DatasetStyle } from "styles";

//Components
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
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TaskVideoDialog } from "common";

//APIs
import {
  APITransport,
  CompareTranscriptionSource,
  ComparisionTableAPI,
  FetchTaskDetailsAPI,
  FetchTaskListAPI,
  FetchTranscriptTypesAPI,
  setComparisonTable,
} from "redux/actions";

const ComparisonTable = () => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const [selectedTranscriptType, setSelectTranscriptType] = useState("");
  const [currentLoadingSectionIndex, setCurrentLoadingSectionIndex] =
    useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const comparsionData = useSelector((state) => state.setComparisonTable.data);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progess, success, apiType, data } = apiStatus;

    if (!progess) {
      if (success) {
        if (apiType === "COMPARISION_TABLE") {
          navigate(`/task/${taskDetails.id}/transcript`);
        }

        if (apiType === "COMPARE_TRANSCRIPTION_SOURCE") {
          dispatch(setComparisonTable(data));
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    if (comparsionData) {
      setCurrentLoadingSectionIndex("");
    }
  }, [comparsionData]);

  useEffect(() => {
    const obj = new FetchTaskDetailsAPI(id);
    dispatch(APITransport(obj));

    // eslint-disable-next-line
  }, []);

  const getComparisonData = () => {
    if (Object.keys(comparsionData).length) {
      return Object.keys(comparsionData).map((value, id) => {
        return { id, value };
      });
    }
    return [{ id: 0, value: "" }];
  };
  const [selectValue, setSelectValue] = useState(getComparisonData());

  useEffect(() => {
    setSelectValue(getComparisonData());
    // eslint-disable-next-line
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

  useEffect(() => {
    const obj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(obj));
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    let data = {};

    if (selectedTranscriptType === "MANUALLY_CREATED") {
      data = {
        type: selectedTranscriptType,
        payload: {
          payload: [],
        },
      };
    } else {
      const [key, value] =
        Object.entries(comparsionData).find(
          ([key]) => selectedTranscriptType === key
        ) || [];

      data = {
        type: key,
        payload: {
          payload: value,
        },
      };
    }

    const projectObj = new ComparisionTableAPI(taskDetails.id, data);
    dispatch(APITransport(projectObj));
  };

  const postCompareTranscriptionSource = (id, sourceTypeList, loadingIndex) => {
    setCurrentLoadingSectionIndex(loadingIndex);

    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    const sourceTypeList = JSON.parse(localStorage.getItem("sourceTypeList"));
    const id = localStorage.getItem("sourceId");
    if (!!sourceTypeList && sourceTypeList.length)
      postCompareTranscriptionSource(id, sourceTypeList, 0);

    // eslint-disable-next-line
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
            if (el.text) {
              return (
                <Typography key={i} className={classes.Typographyvalue}>
                  {el.text}
                </Typography>
              );
            }

            return "";
          })}
        </div>
      );
    }
    return <></>;
  };

  const renderDropDown = useMemo(() => {
    return (
      <Grid container spacing={8}>
        {selectValue.map((_select, indx) => {
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
              {apiStatus.loading && currentLoadingSectionIndex === indx ? (
                <div
                  className={classes.tableData}
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CircularProgress sx={{ alignSelf: "center" }} />
                </div>
              ) : (
                renderTableData(selectValue[indx]?.value)
              )}
            </Grid>
          );
        })}
      </Grid>
    );
    // eslint-disable-next-line
  }, [selectValue]);

  const renderTranscriptionType = useMemo(() => {
    const currentTranscriptTypes = Object.keys(comparsionData);
    const filteredDropDown = transcriptTypes.filter((dl) =>
      currentTranscriptTypes.includes(dl.value)
    );

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
            {/* <MenuItem key={0} value={"MANUALLY_CREATED"}>Manually Created</MenuItem> */}
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
    // eslint-disable-next-line
  }, [comparsionData, selectedTranscriptType]);

  return (
    <Grid container spacing={1} style={{ alignItems: "center" }}>
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
          <Grid
            container
            direction="row"
            sx={{ mb: 2, mt: 3, alignItems: "center" }}
          >
            <Grid item xs={12} sm={12} md={12} lg={1} xl={1}>
              <Typography variant="h4">Select :</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
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
          sx={{ mt: 3, width: "120px" }}
          disabled={!selectValue[0]?.value}
        >
          Submit
        </Button>
      </Card>
    </Grid>
  );
};

export default ComparisonTable;
