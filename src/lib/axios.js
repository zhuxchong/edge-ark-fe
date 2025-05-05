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

    const { error: err, errCode } = data || {
      error: "",
      errCode: "",
    };
    console.log("err", err);
    const returnData = {
      code: status || "no code",
      errMsg: err || "no code",
      errorCode: errCode,
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
