import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { videoTaskListColumns } from "config";
import { getColumns, getOptions } from "utils";

//Themes
import { ThemeProvider } from "@mui/material";
import { tableTheme } from "theme";

//Components
import MUIDataTable from "mui-datatables";

//APIs
import { APITransport, FetchVideoTaskListAPI } from "redux/actions";

const VideoTaskList = (props) => {
  const dispatch = useDispatch();
  const { videoDetails } = props;

  const apiStatus = useSelector((state) => state.apiStatus);

  const fetchVideoTaskList = () => {
    const apiObj = new FetchVideoTaskListAPI(videoDetails);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    fetchVideoTaskList();
    // eslint-disable-next-line
  }, []);

  const videotaskList = useSelector((state) => state.getVideoTaskList.data);

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable
        title="Task List"
        data={videotaskList}
        columns={getColumns(videoTaskListColumns)}
        options={getOptions(apiStatus.loading)}
      />
    </ThemeProvider>
  );
};

export default VideoTaskList;
