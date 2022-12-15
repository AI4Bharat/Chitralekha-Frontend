import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchProjectMembersAPI extends API {
  constructor(id, taskType, allowedTaskType,timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_PROJECT_MEMBERS;
    this.id = id;
    this.taskType = taskType;
    this.queryStr = taskType ? `?task_type=${taskType}`:""
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.project
    }${id}/users/${this.queryStr}`;
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
