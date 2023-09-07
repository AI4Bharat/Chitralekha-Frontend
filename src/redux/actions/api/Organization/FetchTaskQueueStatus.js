import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchTaskQueueStatusAPI extends API {
  constructor(queueType, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_TASK_QUEUE_STATUS;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }inspect_queue/?queue=${queueType}`;
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
