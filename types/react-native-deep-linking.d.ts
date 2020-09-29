declare module 'react-native-deep-linking' {
  export default class DeepLinking {
    public static addScheme(scheme: string): void;
    public static evaluateUrl(url: string): void;
    public static addRoute(expression: string, callback: (response: any) => void): void;
  }
}
