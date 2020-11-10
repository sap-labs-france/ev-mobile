import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class AxiosFactory {
  private static axiosInstance: AxiosInstance;

  private constructor() {}

  public static getAxiosInstance(instanceConfiguration?: { axiosConfig?: AxiosRequestConfig }): AxiosInstance {
    if (!instanceConfiguration) {
      instanceConfiguration = {};
    }
    if (!AxiosFactory.axiosInstance) {
      AxiosFactory.axiosInstance = axios.create(instanceConfiguration.axiosConfig);
    }
    return AxiosFactory.axiosInstance;
  }
S}
