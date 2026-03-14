import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

// attach JWT token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${parsedUser.token}`;
  }
  return config;
});

// transform error responses into user-friendly messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // server responded with an error status
    if (error.response) {
      const status = error.response.status;
      const serverMsg = error.response.data?.message;

      // use the server message if available, otherwise give a clear reason
      if (serverMsg) {
        error.userMessage = serverMsg;
      } else if (status === 400) {
        error.userMessage = "The information you provided is invalid. Please check your input and try again.";
      } else if (status === 401) {
        error.userMessage = "Your session has expired. Please log in again.";
      } else if (status === 403) {
        error.userMessage = "You do not have permission to perform this action.";
      } else if (status === 404) {
        error.userMessage = "The requested resource was not found. It may have been removed.";
      } else if (status >= 500) {
        error.userMessage = "The server encountered an error. Please try again in a few minutes.";
      } else {
        error.userMessage = "Something went wrong. Please try again.";
      }
    } else if (error.request) {
      // request was sent but no response received (network error)
      error.userMessage = "Unable to connect to the server. Please check your internet connection and try again.";
    } else {
      error.userMessage = "An unexpected error occurred. Please refresh the page and try again.";
    }

    return Promise.reject(error);
  }
);

export default API;