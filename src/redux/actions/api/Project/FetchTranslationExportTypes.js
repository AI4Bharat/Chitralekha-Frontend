import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchTranslationExportTypesAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_TRANSLATION_EXPORT_TYPE;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.translation}get_translation_export_types/`;
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
