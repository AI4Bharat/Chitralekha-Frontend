import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taskQueueStatusColumns, taskQueueStatusAdminColumns } from "config";
import { getColumns, getOptions } from "utils";

import MUIDataTable from "mui-datatables";

import { APITransport, FetchTaskQueueStatusAPI } from "redux/actions";

const QueueStatusTable = ({ queueType }) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [adminStatus, setAdminStatus] = useState(false)

  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progess, success, apiType, data } = apiStatus;

    if (!progess) {
      if (success) {
        if (apiType === "GET_TASK_QUEUE_STATUS") {
          if (data["admin_data"]==true){
            setAdminStatus(true)
            const result = data.data.map((item, index) => {
              return [
                index + 1,
                item.task_id,
                item.uuid,
                item.name,
                item.state,
                item.received_time,
                item.started_time,
                item.worker,
              ];
            });
            setTableData(result);
          }
          else{
            const result = data.data.map((item, index) => {
              return [
                index + 1,
                item.task_id,
                item.video_id,
                item.submitter_name,
                item.org_name,
                item.video_duration,
                item.status,
              ];
            });
            setTableData(result);
          }
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const fetchTaskQueueStatusList = async () => {
    const apiObj = new FetchTaskQueueStatusAPI(queueType);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    fetchTaskQueueStatusList();
    return () => setTableData([]);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {adminStatus==true?
      <MUIDataTable
        data={tableData}
        columns={getColumns(taskQueueStatusAdminColumns)}
        options={getOptions(apiStatus.loading)}
      />
      :<MUIDataTable
          data={tableData}
          columns={getColumns(taskQueueStatusColumns)}
          options={getOptions(apiStatus.loading)}
      />}
    </div>
  );
};

export default QueueStatusTable;
