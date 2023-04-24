import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { videoTaskListColumns } from "../../../config/tableColumns";
import { getColumns, getOptions } from "../../../utils/tableUtils";

//Themes
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";

//APIs
import FetchVideoTaskListAPI from "../../../redux/actions/api/Project/FetchVideoTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";

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
        options={getOptions(apiStatus.progress)}
      />
    </ThemeProvider>
  );
};

export default VideoTaskList;
