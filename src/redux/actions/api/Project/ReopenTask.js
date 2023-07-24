import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ReopenTaskAPI extends API {
  constructor(id, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.REOPEN_TASK;
    this.id = id;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }${id}/reopen_translation_task/`;
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
