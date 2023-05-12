import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UploadToYoutubeAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("POST", timeout, false);
    this.taskId = taskId;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.youtube
    }upload_to_youtube`;
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
    return { task_ids: this.taskId };
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
