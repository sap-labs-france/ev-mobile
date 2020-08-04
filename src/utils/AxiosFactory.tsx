import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export default class AxiosFactory {
  private static axiosInstance: AxiosInstance;
  private static readonly maxRetries: number = 3;

  private constructor() {}

  public static getAxiosInstance(axiosConfig?: AxiosRequestConfig, axiosRetryConfig?: IAxiosRetryConfig): AxiosInstance {
    if (!AxiosFactory.axiosInstance) {
      AxiosFactory.axiosInstance = axios.create(axiosConfig);
    }
    AxiosFactory.applyAxiosRetryConfiguration(AxiosFactory.axiosInstance, axiosRetryConfig);
    return AxiosFactory.axiosInstance;
  }

  private static applyAxiosRetryConfiguration(axiosInstance: AxiosInstance, axiosRetryConfig?: IAxiosRetryConfig) {
    if (!axiosRetryConfig || !axiosRetryConfig.retries) {
      axiosRetryConfig.retries = AxiosFactory.maxRetries;
    }
    if (!axiosRetryConfig || !axiosRetryConfig.retryDelay) {
      axiosRetryConfig.retryDelay = axiosRetry.exponentialDelay.bind(this);
    }
    axiosRetry(axiosInstance, axiosRetryConfig);
  }
}
