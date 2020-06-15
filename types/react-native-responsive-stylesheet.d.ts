declare module 'react-native-responsive-stylesheet' {
  export default class ResponsiveStyleSheet {
    public static create(styles: object): void;
    public static createSized(direction: 'min-width' | 'max-width' | 'min-height' | 'max-height' | 'min-direction' | 'max-direction', map: object): void;
    public static createOriented(map: object): void;
    public static validSizes(direction: 'min-width' | 'max-width' | 'min-height' | 'max-height' | 'min-direction' | 'max-direction', sizes: string[]): void;
    public static getOrientation(): 'landscape' | 'portrait';
  }
}
