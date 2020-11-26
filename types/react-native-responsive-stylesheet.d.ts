declare module 'react-native-responsive-stylesheet' {
  export default class ResponsiveStyleSheet {
    public static create(styles: Record<string, unknown>): void;
    public static createSized(direction: 'min-width' | 'max-width' | 'min-height' | 'max-height' | 'min-direction' | 'max-direction', map: Record<string, unknown>): void;
    public static createOriented(map: Record<string, unknown>): void;
    public static validSizes(direction: 'min-width' | 'max-width' | 'min-height' | 'max-height' | 'min-direction' | 'max-direction', sizes: string[]): void;
    public static getOrientation(): 'landscape' | 'portrait';
  }
}
