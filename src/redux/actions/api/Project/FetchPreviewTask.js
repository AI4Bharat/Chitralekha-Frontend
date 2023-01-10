import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchpreviewTaskAPI extends API {
  constructor( videoId,Task_type,timeout = 2000) {
    console.log(Task_type,"Task_typeTask_type",videoId)
    super("GET", timeout, false);
    this.type = C.GET_PREVIEW_TASK;
    this.payloadEndpoint = (Task_type === "TRANSCRIPTION_EDIT" || Task_type === "TRANSCRIPTION_REVIEW") ? ENDPOINTS.transcript : ENDPOINTS.translation
    this.endpoint = `${super.apiEndPointAuto()}${this.payloadEndpoint}?video_id=${videoId}`
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
