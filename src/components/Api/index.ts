import axios from "axios";
const axiosInstance = axios.create({
  baseURL: `https://201.131.21.31/`,
  //baseURL: `https://localhost:443/`,
  // ... other URLs can be swapped in as needed
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default axiosInstance;
