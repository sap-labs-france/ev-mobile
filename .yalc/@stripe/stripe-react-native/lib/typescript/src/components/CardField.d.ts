/// <reference types="react" />
import type { CardFieldInput, Nullable } from '../types';
import { AccessibilityProps, StyleProp, ViewStyle } from 'react-native';
/**
 *  Card Field Component Props
 */
export interface Props extends AccessibilityProps {
    style?: StyleProp<ViewStyle>;
    postalCodeEnabled?: boolean;
    cardStyle?: CardFieldInput.Styles;
    placeholder?: CardFieldInput.Placeholders;
    onCardChange?(card: CardFieldInput.Details): void;
    onFocus?(focusedField: Nullable<CardFieldInput.Names>): void;
}
/**
 *  Card Field Component
 *
 * @example
 * ```ts
 * <CardField
 *    postalCodeEnabled={false}
 *    onCardChange={(cardDetails) => {
 *    console.log('card details', cardDetails);
 *      setCard(cardDetails);
 *    }}
 *    style={{height: 50}}
 *  />
 * ```
 * @param __namedParameters Props
 * @returns JSX.Element
 * @category ReactComponents
 */
export declare function CardField({ onCardChange, onFocus, cardStyle, placeholder, postalCodeEnabled, ...props }: Props): JSX.Element;
