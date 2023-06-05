import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchPaginatedOrgTaskListAPI extends API {
  constructor(id, offset, limit, search, filter, timeout = 2000) {
    super("GET", timeout, false);

    this.type = C.GET_ORG_TASK_LIST;
    this.id = id;
    this.offset = offset;
    this.limit = limit;
    this.search = search;
    this.filter = filter;

    this.getTargetEndpoint = `${
      ENDPOINTS.organization
    }${id}/list_org_tasks/?limit=${this.limit}&offset=${
      this.offset
    }&filter=${JSON.stringify(this.filter)}&search=${JSON.stringify(
      this.search
    )}`;

    this.endpoint = `${super.apiEndPointAuto()}${this.getTargetEndpoint}`;
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
