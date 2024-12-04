import axios, { AxiosError, AxiosInstance, HttpStatusCode } from "axios";
import { toast } from "react-toastify";

import { AuthResponse } from "../types/auth.type";
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfileToLS } from "./auth";
import { path } from "../consts/const";

class Http {
  instance: AxiosInstance;
  private accessToken: string;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: "https://api-ecom.duthanhduoc.com",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = this.accessToken;
        }
        return config;
      },
      (err) => Promise.reject(err),
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse;
          this.accessToken = data.data.access_token;
          setProfileToLS(data.data.user);
          saveAccessTokenToLS(this.accessToken);
        } else if (url === "/logout") {
          this.accessToken = "";
          clearLS();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          console.log("data trả về", error);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;

          const message = data?.message || error.message;
          toast.error(message);
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS();
        }
        return Promise.reject(error);
      },
    );
  }
}

const http = new Http().instance;

export default http;
