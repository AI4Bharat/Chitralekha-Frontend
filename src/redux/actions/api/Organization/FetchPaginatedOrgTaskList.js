import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchPaginatedOrgTaskListAPI extends API {
  constructor(id, offset, limit, search, filter, sortOptions, timeout = 2000) {
    super("GET", timeout, false);

    this.type = C.GET_ORG_TASK_LIST;
    this.id = id;
    this.offset = offset;
    this.limit = limit;
    this.search = search;
    this.filter = filter;
    this.sortOptions = sortOptions;

    const params = new URLSearchParams();
    params.append("limit", this.limit);
    params.append("offset", this.offset);

    if (this.sortOptions.sortBy !== "") {
      params.append("sort_by", this.sortOptions.sortBy);
    }

    if (this.sortOptions.order !== "") {
      params.append("reverse", this.sortOptions.order);
    }

    params.append("filter", JSON.stringify(this.filter));
    params.append("search", JSON.stringify(this.search));

    const baseUrl = `${ENDPOINTS.organization}${id}/list_org_tasks/`;
    const finalUrl = `${baseUrl}?${params.toString()}`;

    this.endpoint = `${super.apiEndPointAuto()}${finalUrl}`;
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
