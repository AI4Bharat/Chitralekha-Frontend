import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetVideoDetailsAPI extends API {
  constructor( video_url, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_VIDEO_TASK_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.listVideosTasks}?video_url=${video_url}`;
  }
  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.taskDetails = res; 
    } else {
      this.taskDetails = { error: 'No data received' }; 
    }
  }
  apiEndPoint() {
    return this.endpoint;
  }
  getHeaders() {
    const token = localStorage?.getItem('token');
    if (!token) {
      console.warn('Authorization token not found in localStorage');
    }

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `JWT ${token}` : undefined,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.taskDetails;
  }
}
