export interface ActionResponse {
  status: string;
  error: string;
}

export interface BillingOperationResult {
  succeeded: boolean;
  error?: Error;
  internalData?: unknown;
}

export enum RestResponse {
  SUCCESS = 'Success',
}
