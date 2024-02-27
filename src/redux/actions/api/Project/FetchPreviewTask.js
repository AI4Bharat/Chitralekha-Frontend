import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchpreviewTaskAPI extends API {
  constructor(videoId, taskType, targetLanguage, timeout = 2000) {
    super("GET", timeout, false);

    this.type = C.GET_PREVIEW_TASK;

    this.payloadEndpoint = taskType.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : ENDPOINTS.translation;

    this.queryString = taskType.includes("TRANSCRIPTION")
      ? ""
      : `&target_language=${targetLanguage}`;

    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }?video_id=${videoId}${this.queryString}`;
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
