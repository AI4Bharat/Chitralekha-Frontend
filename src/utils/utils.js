export function authenticateUser() {
    const access_token = localStorage.getItem("token");
    if (access_token) {
      return true;
    } else {
      return false;
    }
  }