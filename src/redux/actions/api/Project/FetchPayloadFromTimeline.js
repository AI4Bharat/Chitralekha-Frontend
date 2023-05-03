import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchPayloadFromTimelineAPI extends API {
  constructor(id, taskType, time, limit, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_TRANSCRIPT_PAYLOAD;
    this.id = id;
    this.time = time;
    this.limit = limit;
    this.payloadEndpoint = taskType.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : ENDPOINTS.translation;
    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }get_sentence_from_timeline/?task_id=${id}&time=${time}&limit=${limit}`;
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
