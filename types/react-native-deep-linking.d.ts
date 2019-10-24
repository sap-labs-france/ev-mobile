declare module 'react-native-deep-linking' {
  export default class DeepLinking {
    static addScheme(scheme: string): void;
    static evaluateUrl(url: string): void;
    static addRoute(expression: string, callback: (response: {tenant: string, hash: string}) => void): void;
  }
}
