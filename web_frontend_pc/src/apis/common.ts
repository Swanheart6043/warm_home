import { message } from "antd";
import axios from "axios";

axios.defaults.baseURL = "192.168.1.200";

axios.interceptors.request.use(async (requestConfig) => {
  return requestConfig;
});

axios.interceptors.response.use((response) => {
  const { success, errMsg } = response.data || {};
  if (success) {
    return response.data;
  }
  message.error(errMsg);
});

export default axios