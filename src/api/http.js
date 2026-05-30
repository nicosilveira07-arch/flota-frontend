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
http.interceptors.request.use(
  (config) => {
    console.log("REQUEST:", {
      baseURL: config.baseURL,
      url: config.url,
      completa: `${config.baseURL}${config.url}`,
    });

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
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
export default http;