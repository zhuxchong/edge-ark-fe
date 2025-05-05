import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: `https://tjrmfvnikw.ap-southeast-2.awsapprunner.com`,
});

instance.interceptors.request.use(
  (config) => {
    const customConfig = config;

    return customConfig;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => {
    const { data } = res;
    return Promise.resolve(data);
  },
  (error) => {
    const { data = {}, status, config } = error.response;
    const { customHandleError } = config;

    const { errorDesc, errCode } = data || {
      errorDesc: "",
      errCode: "",
    };
    console.log("errCode", errCode, data, status);

    const returnData = {
      code: status || "no code",
      errMsg: errorDesc || "no code",
      errorCode: errCode || "no errorCode",
      __requestRejected: true,
      entireErrorResponse: JSON.stringify(error.response || {}),
      entireError: JSON.stringify(error || {}),
    };

    if (!customHandleError) {
    }
    return Promise.reject(returnData);
  }
);

export default instance;

export const get = (url, config) => {
  return instance.get(url, config);
};

export const post = (url, body, config) => {
  return instance.post(url, body, config);
};
