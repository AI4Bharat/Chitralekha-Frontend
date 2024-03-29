import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateNewVideoAPI extends API {
  constructor(
    url,
    isAudio,
    projectId,
    language,
    description,
    create,
    gender,
    speakerInfo,
    speakerType,
    timeout = 2000
  ) {
    super("GET", timeout, false);
    this.type = C.CREATE_NEW_VIDEO;
    this.url = url;
    this.isAudio = isAudio;
    this.projectId = projectId;
    this.language = language;
    this.description = description;
    this.gender = gender;
    this.speakerInfo = speakerInfo;
    this.speakerType = speakerType;
    this.query =
      this.speakerType === "multiple"
        ? `?multimedia_url=${url}&lang=${language}&is_audio_only=${isAudio}&project_id=${projectId}&description=${description}&create=${create}&gender=${gender}&speaker_info=${JSON.stringify(
            speakerInfo
          )}&multiple_speaker=true`
        : `?multimedia_url=${url}&lang=${language}&is_audio_only=${isAudio}&project_id=${projectId}&description=${description}&create=${create}&gender=${gender}&multiple_speaker=false`;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.video}${this.query}`;
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
