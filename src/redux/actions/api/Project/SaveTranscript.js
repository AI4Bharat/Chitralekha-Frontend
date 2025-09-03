import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class SaveTranscriptAPI extends API {
  // static isSaveInProgress = false;

  constructor(payload, taskType, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_TRANSCRIPT;
    this.payload = payload;
    this.payloadEndpoint = taskType?.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : taskType?.includes("VOICEOVER")
      ? ENDPOINTS.voiceover
      : ENDPOINTS.translation;
    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }save/`;
  }

  // static setSaveInProgress(status) {
  //   SaveTranscriptAPI.isSaveInProgress = status;
  // }

  // static shouldSkipAutoSave() {
  //   return SaveTranscriptAPI.isSaveInProgress;
  // }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
      
      // Remove this entire block - time tracking is now handled in backend
      // if (this.payload.session_start) {
      //   this.updateTimeSpent();
      // }
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.payload;
  }

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
