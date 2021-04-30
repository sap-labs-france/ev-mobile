import { PaymentMethodCreateParams, ApplePay, CreatePaymentMethodResult, RetrievePaymentIntentResult, ConfirmPaymentMethodResult, HandleCardActionResult, ConfirmSetupIntentResult, CreateTokenForCVCUpdateResult, ApplePayResult, ConfirmSetupIntent } from '../types';
/**
 * useStripe hook
 */
export declare function useStripe(): {
    retrievePaymentIntent: (clientSecret: string) => Promise<RetrievePaymentIntentResult>;
    confirmPayment: (paymentIntentClientSecret: string, data: PaymentMethodCreateParams.Params, options?: PaymentMethodCreateParams.Options) => Promise<ConfirmPaymentMethodResult>;
    createPaymentMethod: (data: PaymentMethodCreateParams.Params, options?: PaymentMethodCreateParams.Options) => Promise<CreatePaymentMethodResult>;
    handleCardAction: (paymentIntentClientSecret: string) => Promise<HandleCardActionResult>;
    isApplePaySupported: boolean;
    presentApplePay: (params: ApplePay.PresentParams) => Promise<ApplePayResult>;
    confirmApplePayPayment: (clientSecret: string) => Promise<ApplePayResult>;
    confirmSetupIntent: (paymentIntentClientSecret: string, data: ConfirmSetupIntent.Params, options?: ConfirmSetupIntent.Options) => Promise<ConfirmSetupIntentResult>;
    createTokenForCVCUpdate: (cvc: string) => Promise<CreateTokenForCVCUpdateResult>;
    updateApplePaySummaryItems: (summaryItems: ApplePay.CartSummaryItem[]) => Promise<ApplePayResult>;
    handleURLCallback: (url: string) => Promise<boolean>;
};
