import React, { useState, useEffect } from "react";
import { getColumns, getOptions } from "utils";
import { taskQueueStatusColumns } from "config";
import { useDispatch, useSelector } from "react-redux";

//Components
import MUIDataTable from "mui-datatables";

//APIs
import { APITransport, FetchTaskQueueStatusAPI } from "redux/actions";

const TaskQueueStatus = () => {
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);

  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progess, success, apiType, data } = apiStatus;

    if (!progess) {
      if (success) {
        if (apiType === "GET_TASK_QUEUE_STATUS") {
          const result = data.data.map((item, index) => {
            return [
              index + 1,
              item.task_id,
              item.video_id,
              item.submitter_name,
              item.org_name,
              item.video_duration,
            ];
          });

          setTableData(result);
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const fetchTaskQueueStatusList = async () => {
    const apiObj = new FetchTaskQueueStatusAPI();
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    fetchTaskQueueStatusList();

    return () => setTableData([]);

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <MUIDataTable
        title="Tasks Queue Status"
        data={tableData}
        columns={getColumns(taskQueueStatusColumns)}
        options={getOptions(apiStatus.loading)}
      />
    </div>
  );
};

export default TaskQueueStatus;
