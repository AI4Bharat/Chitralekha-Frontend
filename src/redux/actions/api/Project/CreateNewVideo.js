import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateNewVideoAPI extends API {
  constructor(url, isAudio, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.CREATE_NEW_VIDEO;
    this.url = url;
    this.isAudio = isAudio;
    this.endpoint = `https://backend.chitralekha.ai4bharat.org/video/?multimedia_url=${url}&save_original_transcript=true&is_audio_only=${isAudio}`;
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
