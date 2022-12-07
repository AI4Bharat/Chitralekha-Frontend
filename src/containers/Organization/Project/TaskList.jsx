import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider, Box } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import CustomButton from "../../../common/Button";

//Apis
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import { useNavigate } from "react-router-dom";
import CompareTranscriptionSource from "../../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../../redux/actions/api/Project/SetComparisonTableData";
import clearComparisonTable from "../../../redux/actions/api/Project/ClearComparisonTable";
import ComparisionTableAPI from "../../../redux/actions/api/Project/ComparisonTable";

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);

  const onTranslationTaskTypeSubmit = async (id, rsp_data) => {
    const payloadData = {
      type: Object.keys(rsp_data.payloads)[0],
      payload : {
        payload: rsp_data.payloads[Object.keys(rsp_data.payloads)[0]]?.payload
      }
    }
    const comparisonTableObj = new ComparisionTableAPI(id, payloadData);
    dispatch(APITransport(comparisonTableObj));
  }

  const getTranscriptionSourceComparison = (id, source, isSubmitCall) => {
    const sourceTypeList = source.map((el) => {
      return el.toUpperCase().split(" ").join("_");
    });
    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    localStorage.setItem("sourceTypeList", JSON.stringify(sourceTypeList));
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      console.log("rsp_data --------- ", rsp_data);
      if (res.ok) {
        dispatch(setComparisonTable(rsp_data));
        if(isSubmitCall){
        //   {
        //     "transcript_id": "e5667543-b768-41c9-8f73-206cc0e77961",
        //     "payloads": {
        //         "MACHINE_GENERATED": {
        //             "payload": [
        //                 {
        //                     "start_time": "00:00:00.030",
        //                     "end_time": "00:00:03.110",
        //                     "text": "hi my name is samuell  31 pal ,  I'm 23 years.",
        //                     "target_text": "मेरा नाम सैमुअल 31 दोस्त है, मैं 23 साल का हूँ।"
        //                 },
        //                 {
        //                     "start_time": "00:00:03.120",
        //                     "end_time": "00:00:05.570",
        //                     "text": "old I am a graduate in mathematics with ",
        //                     "target_text": "मैं गणित में स्नातक हूँ"
        //                 },
        //                 {
        //                     "start_time": "00:00:05.580",
        //                     "end_time": "00:00:08.540",
        //                     "text": "81% currently I am pursuing MSC in",
        //                     "target_text": "81% वर्तमान में मैं एमएससी कर रहा हूं"
        //                 },
        //                 {
        //                     "start_time": "00:00:08.550",
        //                     "end_time": "00:00:10.220",
        //                     "text": "operational research from Hans Raj",
        //                     "target_text": "हंसराज से संचालनगत अनुसंधान"
        //                 },
        //                 {
        //                     "start_time": "00:00:10.230",
        //                     "end_time": "00:00:12.410",
        //                     "text": "College University of Delhi I am fluent",
        //                     "target_text": "मैं दिल्ली विश्वविद्यालय के कॉलेज में पढ़ता हूं"
        //                 },
        //                 {
        //                     "start_time": "00:00:12.420",
        //                     "end_time": "00:00:13.640",
        //                     "text": "in English and German",
        //                     "target_text": "अंग्रेजी और जर्मन में"
        //                 },
        //                 {
        //                     "start_time": "00:00:13.650",
        //                     "end_time": "00:00:15.740",
        //                     "text": "since operational research is an",
        //                     "target_text": "चूंकि प्रचालन अनुसंधान एक"
        //                 },
        //                 {
        //                     "start_time": "00:00:15.750",
        //                     "end_time": "00:00:17.660",
        //                     "text": "upcoming field I am looking for an",
        //                     "target_text": "मैं एक आगामी क्षेत्र की तलाश कर रहा हूं"
        //                 },
        //                 {
        //                     "start_time": "00:00:17.670",
        //                     "end_time": "00:00:19.670",
        //                     "text": "internship in the field of operations I",
        //                     "target_text": "ऑपरेशन I के क्षेत्र में इंटर्नशिप"
        //                 },
        //                 {
        //                     "start_time": "00:00:19.680",
        //                     "end_time": "00:00:21.800",
        //                     "text": "wish to pursue for the studies from",
        //                     "target_text": "से आगे की पढ़ाई करना चाहते हैं"
        //                 },
        //                 {
        //                     "start_time": "00:00:21.810",
        //                     "end_time": "00:00:25.010",
        //                     "text": "abroad thank you",
        //                     "target_text": "विदेश में आपका धन्यवाद"
        //                 }
        //             ]
        //         }
        //     },
        //     "task_id": 3
        // }
          // --------------------- if task type is translation, submit translation with trg lang ------------- //
          await onTranslationTaskTypeSubmit(id, rsp_data);
        }
      } else {
        console.log("failed");
      }
    });
  };

  

  const submitTranslation = (id, source) => {

  }

  const renderViewButton = (tableData) => {
    return (
      (tableData.rowData[5] === "NEW" || tableData.rowData[5] === "INPROGRESS") && <CustomButton
        sx={{ borderRadius: 2}}
        label="View"
        onClick={() => {
          setOpenViewTaskDialog(true);
          setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const renderEditButton = (tableData) => {
    console.log("tableData ---- ", tableData);
    return(
      ((tableData.rowData[5] === "SELECTED_SOURCE" && (tableData.rowData[1] === "TRANSCRIPTION_EDIT" || tableData.rowData[1] === "TRANSLATION_EDIT")) 
      || (tableData.rowData[1] === "TRANSCRIPTION_REVIEW" || tableData.rowData[1] === "TRANSLATION_REVIEW")) && 
      <CustomButton
        sx={{ borderRadius: 2}}
        label="Edit"
        onClick={() => {
          console.log("Edit Button --- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const renderDeleteButton = (tableData) => {
    return (
      <CustomButton
        sx={{ borderRadius: 2, marginLeft: 2}}
        color="error"
        label="Delete"
        onClick={() => {
          console.log("Delete Button --- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const columns = [
    {
      name: "id",
      label: "#",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "task_type",
      label: "Task Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "video_name",
      label: "Video Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "source_language",
      label: "Source Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "target_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box sx={{display: 'flex'}}>
              {renderViewButton(tableMeta)}
              {renderEditButton(tableMeta)}
              {renderDeleteButton(tableMeta)}
            </Box>

            // <CustomButton
            //   sx={{ borderRadius: 2, marginRight: 2 }}
            //   label="View"
            //   onClick={() => {
            //     setOpenViewTaskDialog(true);
            //     setCurrentTaskDetails(tableMeta.rowData);
            //   }}
            // />
          );
        },
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={taskList} columns={columns} options={options} />
      </ThemeProvider>

      {openViewTaskDialog && (
        <ViewTaskDialog
          open={openViewTaskDialog}
          handleClose={() => setOpenViewTaskDialog(false)}
          compareHandler={(id, source, isSubmitCall) => {
            dispatch(clearComparisonTable());
            localStorage.setItem("sourceId", id);
            if (source.length) getTranscriptionSourceComparison(id, source, isSubmitCall);
            !isSubmitCall && navigate(`/comparison-table/${id}`);
          }}
          // submitHandler={({id, source}) => {

          // }}
          id={currentTaskDetails[0]}
        />
      )}
    </>
  );
};

export default TaskList;
