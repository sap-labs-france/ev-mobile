import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class AxiosFactory {
  private static axiosInstance: AxiosInstance;

  // eslint-disable-next-line no-useless-constructor
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
}
