import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class BulkDownloadForVideoAPI extends API {
  constructor(id, exportType, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.BULK_VIDEO_DOWNLOAD;
    this.exportType = exportType;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.video
    }download_all?video_id=${id}&export_type=${exportType}`;
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
    return {};
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
