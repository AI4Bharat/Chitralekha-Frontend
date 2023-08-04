import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "redux/constants";

export default class UploadToYoutubeAPI extends API {
  constructor(taskId, exportType, timeout = 2000) {
    super("POST", timeout, false);

    this.type = constants.UPLOAD_TO_YOUTUBE;

    this.taskId = taskId;
    this.exportType = exportType;
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
    return { task_ids: this.taskId, export_type: this.exportType };
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
