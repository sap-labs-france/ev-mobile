import type { ApplePay, ApplePayError, StripeError } from '../types';
export interface Props {
    /**
     *
     * @example
     * ```ts
     * const { presentApplePay } = useApplePay({
     *  onShippingMethodSelected: (shippingMethod, handler) => {
     *    handler([
     *      { label: 'Example item name 1', amount: '11.00' },
     *      { label: 'Example item name 2', amount: '25.00' },
     *   ]);
     *  }
     * })
     * ```
     */
    onShippingMethodSelected?: (shippingMethod: ApplePay.ShippingMethod, handler: (summaryItems: ApplePay.CartSummaryItem[]) => Promise<{
        error?: StripeError<ApplePayError>;
    }>) => void;
    /**
     *
     * @example
     * ```ts
     * const { presentApplePay } = useApplePay({
     *  onShippingContactSelected: (shippingContact, handler) => {
     *    handler([
     *      { label: 'Example item name 1', amount: '11.00' },
     *      { label: 'Example item name 2', amount: '25.00' },
     *   ]);
     *  }
     * })
     * ```
     */
    onShippingContactSelected?: (shippingContact: ApplePay.ShippingContact, handler: (summaryItems: ApplePay.CartSummaryItem[]) => Promise<{
        error?: StripeError<ApplePayError>;
    }>) => void;
}
/**
 * useApplePay hook
 */
export declare function useApplePay({ onShippingMethodSelected, onShippingContactSelected, }?: Props): {
    loading: boolean;
    presentApplePay: (params: ApplePay.PresentParams) => Promise<import("../types").ApplePayResult>;
    confirmApplePayPayment: (clientSecret: string) => Promise<import("../types").ApplePayResult>;
    isApplePaySupported: boolean;
};
