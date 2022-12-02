import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchVideoDetailsAPI extends API {
  constructor(url, lang, projectId, isAudio, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_VIDEO_DETAILS;
    this.url = url;
    this.lang = lang;
    this.projectId = projectId;
    this.isAudio = isAudio;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.video
    }?multimedia_url=${url}&lang=${lang}&project_id=${projectId}&is_audio_only=${isAudio}`;
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
