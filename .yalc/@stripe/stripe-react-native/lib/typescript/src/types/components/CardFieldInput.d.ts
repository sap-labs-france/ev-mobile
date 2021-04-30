import type { NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import type { Nullable } from '../';
export declare namespace CardFieldInput {
    type Names = 'CardNumber' | 'Cvc' | 'ExpiryDate' | 'PostalCode';
    interface Details {
        last4: string;
        expiryMonth: string;
        expiryYear: string;
        postalCode?: string;
        brand: Brand;
        complete: boolean;
    }
    interface Styles {
        borderWidth?: number;
        backgroundColor?: string;
        borderColor?: string;
        borderRadius?: number;
        textColor?: string;
        fontSize?: number;
        placeholderColor?: string;
        cursorColor?: string;
        textErrorColor?: string;
    }
    interface Placeholders {
        number?: string;
        expiration?: string;
        cvc?: string;
        postalCode?: string;
    }
    type Brand = 'AmericanExpress' | 'DinersClub' | 'Discover' | 'JCB' | 'MasterCard' | 'UnionPay' | 'Visa' | 'Unknown';
    interface NativeProps {
        style?: StyleProp<ViewStyle>;
        value?: Partial<Details>;
        postalCodeEnabled?: boolean;
        onCardChange(event: NativeSyntheticEvent<Details>): void;
        onFocusChange(event: NativeSyntheticEvent<{
            focusedField: Nullable<Names>;
        }>): void;
        cardStyle?: Styles;
        placeholder?: Placeholders;
    }
}
