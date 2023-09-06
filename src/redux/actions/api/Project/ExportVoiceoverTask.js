import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "redux/constants";

export default class ExportVoiceoverTaskAPI extends API {
  constructor(taskId, exportType, bgMusic, timeout = 2000) {
    super("GET", timeout, false);

    this.type = constants.EXPORT_VOICEOVER_TASK;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.voiceover
    }export_voiceover/?task_id=${taskId}&export_type=${exportType}&bg_music=${bgMusic}`;
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
