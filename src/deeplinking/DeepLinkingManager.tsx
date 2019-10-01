import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { NavigationActions, NavigationContainerComponent } from 'react-navigation';
import I18n from '../I18n/I18n';
import CentralServerProvider from '../provider/CentralServerProvider';
import Message from '../utils/Message';

export default class DeepLinkingManager {
  private navigator: NavigationContainerComponent;
  private centralServerProvider: CentralServerProvider;

  public static getInstance() {
    return new DeepLinkingManager();
  }

  public initialize(navigator: NavigationContainerComponent, centralServerProvider: CentralServerProvider) {
    // Keep
    this.navigator = navigator;
    this.centralServerProvider = centralServerProvider;
    // Activate Deep Linking
    DeepLinking.addScheme('eMobility://');
    DeepLinking.addScheme('emobility://');
    // Init Route
    this.addResetPasswordRoute();
    // Init URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url);
      }
    }).catch((err) => {
      // tslint:disable-next-line: no-console
      console.error('An error occurred', err)
    });
  }

  private addResetPasswordRoute = () => {
    // Add Route
    DeepLinking.addRoute('/resetPassword/:tenant/:hash', (response: {tenant: string, hash: string}) => {
        // Check params
      if (!response.tenant) {
        Message.showError(I18n.t('authentication.mandatoryTenant'));
      }
      // Get the Tenant
      const tenant = this.centralServerProvider.getTenant(response.tenant);
      if (!tenant) {
        Message.showError(I18n.t('authentication.unknownTenant'));
      }
      if (!response.hash) {
        Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
      }
      // Disable
      this.centralServerProvider.setAutoLoginDisabled(true);
      // Navigate
      this.navigator.dispatch(
        NavigationActions.navigate({
          routeName: 'ResetPassword',
          params: { tenant: response.tenant, hash: response.hash }
        })
      );
    });
  }

  public startListening() {
    Linking.addEventListener('url', this.handleUrl);
  }

  public stopListening() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  public handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }
}
