import axios from "axios";
import { getAuthToken, getLoggedInUserId } from "./AuthApiService";

const API_BASE_URL = 'http://localhost:8082/tasks';

const taskApiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Function to attach JWT token to requests
taskApiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Function to handle authentication failures
taskApiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API request error:', error);
    if (error.response && error.response.status === 401) {
      window.location.href = "/login"; // Redirect to login on authentication failure
    }
    return Promise.reject(error);
  }
);

export const retrieveAllTasks = () => {
  const userId = getLoggedInUserId();
  return taskApiClient.get(`/${userId}`); // Use correct URL pattern
};


export const createTask = (task) => {
  const userId = getLoggedInUserId();
  return taskApiClient.post("", { ...task, userId });
};
