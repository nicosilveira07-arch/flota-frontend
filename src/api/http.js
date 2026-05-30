import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// REQUEST INTERCEPTOR
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", {
      message: error.message,
      status: error.response?.status || "NO_STATUS",
      data: error.response?.data || "NO_RESPONSE"
    });

    return Promise.reject(error);
  }
)

export default http;