import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export default class AxiosFactory {
  private static axiosInstance: AxiosInstance;
  private static readonly maxRetries: number = 3;

  private constructor() {}

  public static getAxiosInstance(instanceConfiguration?: { axiosConfig?: AxiosRequestConfig, axiosRetryConfig?: IAxiosRetryConfig }): AxiosInstance {
    if (!instanceConfiguration) {
      instanceConfiguration = {};
    }
    if (!AxiosFactory.axiosInstance) {
      AxiosFactory.axiosInstance = axios.create(instanceConfiguration.axiosConfig);
    }
    AxiosFactory.applyAxiosRetryConfiguration(AxiosFactory.axiosInstance, instanceConfiguration.axiosRetryConfig);
    return AxiosFactory.axiosInstance;
  }

  private static applyAxiosRetryConfiguration(axiosInstance: AxiosInstance, axiosRetryConfig?: IAxiosRetryConfig) {
    if (!axiosRetryConfig) {
      axiosRetryConfig = {} as IAxiosRetryConfig;
    }
    if (!axiosRetryConfig.retries) {
      axiosRetryConfig.retries = AxiosFactory.maxRetries;
    }
    if (!axiosRetryConfig.retryDelay) {
      axiosRetryConfig.retryDelay = axiosRetry.exponentialDelay.bind(this);
    }
    axiosRetry(axiosInstance, axiosRetryConfig);
  }
}
