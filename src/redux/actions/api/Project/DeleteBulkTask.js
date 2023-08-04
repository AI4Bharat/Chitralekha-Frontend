import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DeleteBulkTaskAPI extends API {
  constructor(flag, taskId, timeout = 2000) {
    super("DELETE", timeout, false);
    this.type = C.DELETE_BULK_TASK;
    this.taskId = taskId;
    this.flag = flag;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }delete_bulk_tasks/`;
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

  getBody() {
    return {
        task_ids: this.taskId,
        flag: this.flag
      };
  }

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
