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
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

export default http;