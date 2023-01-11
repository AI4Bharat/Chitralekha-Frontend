import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchAllowedTasksAPI extends API {
  constructor(videoId, taskType,language, timeout = 2000) {
    console.log(taskType,"taskType")
    super("GET", timeout, false);
    this.type = C.GET_ALLOWED_TASK;
    this.videoId = videoId;
    this.taskType = taskType;
    this.language = language;
    this.queryStr = taskType === "TRANSLATION" ? `&target_language=${language}`:""
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.task}get_allowed_task/?video_id=${videoId}&type=${taskType}${this.queryStr}`;
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
