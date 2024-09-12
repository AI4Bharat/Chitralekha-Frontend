import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetVideoTaskDetailsAPI extends API {
  constructor(videoId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_VIDEO_TASK_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getVideoTasks}?video_id=${videoId}`;
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Authorization token not found in localStorage');
    }

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.taskDetails;
  }
}
