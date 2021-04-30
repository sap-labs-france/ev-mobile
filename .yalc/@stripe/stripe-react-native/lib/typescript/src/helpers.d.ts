import type { StripeError } from './types';
/**
 * Determines whether or not this library is being used inside of
 * an "Expo" project by identifying if Expo's native module
 * infrastructure (react-native-unimodules) is available.
 */
export declare const shouldAttributeExpo: () => boolean;
export declare const isiOS: boolean;
export declare const isAndroid: boolean;
export declare function createError<T>(error: StripeError<T>): {
    code: T;
    message: string;
};
