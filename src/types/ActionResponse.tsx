export interface ActionResponse {
  status: string;
  error: string;
}

export interface BillingOperationResponse extends ActionResponse {
  internalData: Record<string, unknown>;
  succeeded: boolean;
}
