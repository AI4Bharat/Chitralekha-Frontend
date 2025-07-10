import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class Compare extends API {
  constructor(videoid,  timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.CREATE_BULK_PROJECTS;
    this.videoid = videoid;
    this.endpoint = `${super.apiEndPointAuto()}/translation/retrieve_all_translations/?video_id=${videoid}`
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

  getBody() {
    return {
    };
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
