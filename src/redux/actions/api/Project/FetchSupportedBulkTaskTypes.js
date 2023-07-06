import { endpoints } from "config";
import constants from "redux/constants";
import API from "redux/api";

export default class FetchSupportedBulkTaskTypeAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_SUPPORTED_BULK_TASK_TYPE;
    this.endpoint = `${super.apiEndPointAuto()}${
      endpoints.task
    }get_supported_bulk_task_types/`;
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
