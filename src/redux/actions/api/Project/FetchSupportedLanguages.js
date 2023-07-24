import API from "../../../api";
import C from "../../../constants";

export default class FetchSupportedLanguagesAPI extends API {
  constructor(taskType = "TRANSLATION", timeout = 2000) {
    super("GET", timeout, false);
    this.taskType = taskType;

    this.type = this.taskType.includes("TRANSCRIPTION")
      ? C.GET_SUPPORTED_TRANSCRIPTION_LANGUAGES
      : this.taskType.includes("TRANSLATION")
      ? C.GET_SUPPORTED_TRANSLATION_LANGUAGES
      : C.GET_SUPPORTED_VOICEOVER_LANGUAGES;


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
