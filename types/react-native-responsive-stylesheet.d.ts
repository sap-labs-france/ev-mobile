declare module 'react-native-responsive-stylesheet' {
  import { StyleSheet } from 'react-native';
  export interface OrientedStylesSheets<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>> {
    landscape?: T;
    portrait?: T;
  }
  export default class ResponsiveStylesSheet {
    public static create<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(styles: T | StyleSheet.NamedStyles<T>): T;
    public static createSized<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
      direction: 'min-width' | 'max-width' | 'min-height' | 'max-height' | 'min-direction' | 'max-direction',
      map: Record<number, T>
    ): T[];
    public static createOriented<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(map: OrientedStylesSheets<T>): T;
  }
}
