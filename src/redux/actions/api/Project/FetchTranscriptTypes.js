import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchTranscriptTypesAPI extends API {
  constructor(sourceType, id, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_TRANSCRIPT_TYPES;
    this.id = id;
    this.sourceTypeEndpoint = sourceType === "TRANSCRIPTION_EDIT" ? `${ENDPOINTS.transcript}get_transcript_types/` : `${ENDPOINTS.translation}get_translation_types/`;
    this.endpoint = `${super.apiEndPointAuto()}${this.sourceTypeEndpoint}`;
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
