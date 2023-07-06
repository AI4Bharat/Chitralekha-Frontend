import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UpdateSpeakerInfoAPI extends API {
  constructor(taskId, speakerInfo, timeout = 2000) {
    super("POST", timeout, false);
    this.taskId = taskId;
    this.speakerInfo = speakerInfo;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.translation
    }update_speaker_info`;
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
      task_id: this.taskId,
      speaker_info: this.speakerInfo,
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
