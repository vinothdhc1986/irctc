import axios from "axios";
import APIConfig from "./apiConfig";

const PGApiClient = axios.create({
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

export default PGApiClient;
function getUrl(config) {
  if (config.baseURL) {
    return config.url.replace(config.baseURL, "");
  }
  return config.url;
} // Intercept all requests
// PGApiClient.interceptors.request.use(
//   config => {
//     console.log(
//       `%c ${config.method.toUpperCase()} - ${getUrl(config)}:`,
//       "color: #0086b3; font-weight: bold",
//       config
//     );
//     return config;
//   },
//   error => Promise.reject(error)
// ); // Intercept all responses
// PGApiClient.interceptors.response.use(
//   async response => {
//     console.log(
//       `%c ${response.status} - ${getUrl(response.config)}:`,
//       "color: #008000; font-weight: bold",
//       response
//     );
//     return response;
//   },
//   error => {
//     console.log(
//       `%c ${error.response.status} - ${getUrl(error.response.config)}:`,
//       "color: #a71d5d; font-weight: bold",
//       error.response
//     );
//     return Promise.reject(error);
//   }
// );
