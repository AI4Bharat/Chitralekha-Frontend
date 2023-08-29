const configs = {
  BASE_URL: "https://backend.chitralekha.ai4bharat.org/",
  BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
    ? process.env.REACT_APP_APIGW_BASE_URL
   : "https://backend.chitralekha.ai4bharat.org"
    //  : "https://backend.dev.chitralekha.ai4bharat.org"
    // : "http://127.0.0.1:8000",
};

export default configs;
