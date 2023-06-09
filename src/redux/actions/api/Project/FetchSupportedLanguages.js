import API from "../../../api";
import C from "../../../constants";

export default class FetchSupportedLanguagesAPI extends API {
  constructor(taskType = "TRANSLATION", timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_SUPPORTED_LANGUAGES;
    this.taskType = taskType;
    this.query = this.taskType.includes("TRANSCRIPTION")
      ? "transcript/get_transcription_supported_languages"
      : this.taskType.includes("TRANSLATION")
      ? "translation/get_translation_supported_languages"
      : "voiceover/get_voiceover_supported_languages";
    this.endpoint = `${super.apiEndPointAuto()}/${this.query}`;
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
