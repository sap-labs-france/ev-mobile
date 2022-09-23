export interface RequestError extends Error {
  request?: {
    status: number;
  };
  response?: {
    data: Record<string, any>;
  };
  config?: {
    data: string;
  };
}
