import axios from "axios";

const authApiClient = axios.create({
  baseURL: 'http://localhost:8081/auth', // Updated baseURL to match backend on port 8081
});

// Combine username and password into a single object for loginApi
const loginCredentials = (username, password) => ({ username, password });

export const registerApi = (user) => authApiClient.post('/register', user);

export const loginApi = async (username, password) => {
  try {
    const response = await authApiClient.post('/login', loginCredentials(username, password));


    if (response.status === 200 && response.data) {
      const { token, userId } = response.data; // ✅ Extract both token and userId
      storeAuthToken(token);
      saveLoggedUser(userId, username); // ✅ Save correct userId

      return token;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error("Invalid credentials");
  }
};





export const saveLoggedUser = (userId, username) => {

  sessionStorage.setItem('activeUserId', String(userId)); // Ensure it's a string
  sessionStorage.setItem('authenticatedUser', username);
};


export const storeAuthToken = (token) => localStorage.setItem('authToken', token);
export const getAuthToken = () => localStorage.getItem('authToken');

export const isUserLoggedIn = () => !!getAuthToken(); // Check token existence instead of session storage

export const getLoggedInUserId = () => {
  const storedUserId = sessionStorage.getItem('activeUserId');
  return storedUserId;
};

export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');


export const logout = () => {
  localStorage.removeItem('authToken');
  sessionStorage.clear();
};

// Function to attach JWT token to requests except for authentication endpoints
authApiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Function to handle authentication failures
authApiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = "/login"; // Redirect to login on authentication failure
    }
    return Promise.reject(error);
  }
);
