import DeepLinking from 'react-native-deep-linking';
import { Linking } from 'react-native';

export default class DeepLinkingManager {
  public static getInstance() {
    return new DeepLinkingManager();
  }

  public initialize() {
    // Activate Deep Linking
    DeepLinking.addScheme('emobility://');
    // Add Route
    DeepLinking.addRoute('/resetPassword/:tenant/:hash', (response: any) => {
      console.log('====================================');
      console.log({response});
      console.log('====================================');
    });
    // Init
    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url);
      }
    }).catch((err) => {
      // tslint:disable-next-line: no-console
      console.error('An error occurred', err)
    });
  }

  public startListening() {
    Linking.addEventListener('url', this.handleUrl);
  }

  public stopListening() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  public handleUrl = ({ url }: { url: string }) => {
    console.log('====================================');
    console.log("handleUrl");
    console.log({url});
    console.log('====================================');
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }
}