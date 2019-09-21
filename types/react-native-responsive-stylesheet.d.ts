declare module 'react-native-responsive-stylesheet' {
    export default class ResponsiveStyleSheet {
      static create(styles: object): void;
      static createSized(direction:	"min-width"|"max-width"|"min-height"|"max-height"|"min-direction"|"max-direction", map: object): void;
      static createOriented(map: object): void;
      static validSizes(direction:	"min-width"|"max-width"|"min-height"|"max-height"|"min-direction"|"max-direction", sizes: string[]): void;
      static getOrientation():  "landscape"|"portrait";
    }
  }
  