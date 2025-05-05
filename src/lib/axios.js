// lib/axios.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
// import { Modal } from "antd";
// import { get as lodashGet } from "lodash";
//import dict from "@/utils/errDict";
//import { TOKEN_KEY, GO_TO_LOGIN } from "@/utils/constants";
//import emit from "@/utils/event";

// 创建 axios 实例，baseURL 从环境变量中读取
const instance = axios.create({
  baseURL: `http://localhost:8081`,
});

instance.interceptors.request.use(
  (config) => {
    const customConfig = config;
    // const noAuth = customConfig.noAuth;
    // if (!customConfig.noAuth && typeof window !== "undefined") {
    //   const token = localStorage.getItem(TOKEN_KEY);
    //   if (token) {
    //     customConfig.headers = customConfig.headers || {};
    //     customConfig.headers["Authorization"] = `Bearer ${token}`;
    //   } else {
    //     emit.emit(GO_TO_LOGIN);
    //     return Promise.reject("No authorization, need to login first");
    //   }
    // }

    // if ("noAuth" in customConfig) {
    //   delete customConfig.noAuth;
    // }
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
    // if (status == "401" || status == "403") {
    //   emit.emit(GO_TO_LOGIN);
    // }

    const returnData = {
      code: status || "no code",
      errMsg: errorDesc || "no code",
      errorCode: errCode || "no errorCode",
      __requestRejected: true,
      entireErrorResponse: JSON.stringify(error.response || {}),
      entireError: JSON.stringify(error || {}),
    };

    if (!customHandleError) {
      // Modal.error({
      //   title: "Error",
      //   content:
      //     dict[errCode] || errorDesc || "System Error, Please Contact Admin",
      //   onOk() {
      //     // Handle error
      //   },
      // });
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
