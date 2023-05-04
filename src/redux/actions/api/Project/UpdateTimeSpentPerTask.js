//API to update time spent in a task.

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateTimeSpentPerTask extends API {
  constructor(taskId = "", time_spent = "", timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.UPDATE_TIME_SPENT;
    this.taskId = taskId;
    this.time_spent = time_spent;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.task}${this.taskId}/update_time_spent/`;
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
      time_spent: this.time_spent
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization":`JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
