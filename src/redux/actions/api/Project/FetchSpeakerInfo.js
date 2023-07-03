import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import contants from "../../../constants";

export default class FetchSpeakerInfoAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = contants.GET_SPEAKER_INFO;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.translation
    }get_speaker_info?task_id=${taskId}`;
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
