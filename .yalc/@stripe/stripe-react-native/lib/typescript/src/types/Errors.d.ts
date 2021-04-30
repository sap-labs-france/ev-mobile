export declare enum ConfirmPaymentError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum CardActionError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum ConfirmSetupIntentError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export declare enum CreatePaymentMethodError {
    Failed = "Failed"
}
export declare enum RetrievePaymentIntentError {
    Canceled = "Canceled"
}
export declare enum ApplePayError {
    Canceled = "Canceled",
    Failed = "Failed",
    Unknown = "Unknown"
}
export interface StripeError<T> {
    message: string;
    code: T;
}
