import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ToggleCSVUploadAPI extends API {
  constructor(orgId, enableUpload, timeout = 2000) {
    super("POST", timeout, false);
    this.orgId = orgId;
    this.enableUpload = enableUpload;
    this.type = C.TOGGLE_MAILS;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.organization
    }enable_org_csv_upload/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.toggleMails = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      org_id: this.orgId,
      enable_upload: this.enableUpload,
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
    return this.toggleMails;
  }
}
