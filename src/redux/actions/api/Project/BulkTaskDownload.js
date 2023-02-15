import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class BulkTaskExportAPI extends API {
  constructor(exportType, taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.taskId = taskId;
    this.exportType = exportType;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }download_tasks/?task_ids=${taskId}&export_type=${exportType}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {}

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
