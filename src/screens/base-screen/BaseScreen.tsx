import React from 'react';

import HeaderComponent from '../../components/header/HeaderComponent';
import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import SecurityProvider from '../../provider/SecurityProvider';
import BaseProps from '../../types/BaseProps';
import { BackHandler, NativeEventSubscription } from 'react-native';

export interface Props extends BaseProps {}

interface State {}

export default class BaseScreen<P, S> extends React.Component<Props, State> {
  protected mounted: boolean;
  protected centralServerProvider: CentralServerProvider;
  protected securityProvider: SecurityProvider;
  private headerComponent: HeaderComponent;
  private screenFilters: ScreenFilters;
  private componentFocusUnsubscribe: () => void;
  private componentBlurUnsubscribe: () => void;
  backHandler: NativeEventSubscription;

  public constructor(props: Props) {
    super(props);
    this.mounted = false;
  }

  public isMounted(): boolean {
    return this.mounted;
  }

  public async componentDidMount() {
    const { navigation } = this.props;
    // Get providers
    this.centralServerProvider = await ProviderFactory.getProvider();
    this.securityProvider = this.centralServerProvider?.getSecurityProvider();
    // Add listeners
    this.componentFocusUnsubscribe = navigation?.addListener('focus', () => this.componentDidFocus());
    this.componentBlurUnsubscribe = navigation?.addListener('blur', () => this.componentDidBlur());
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
    // Ok
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.componentFocusUnsubscribe?.();
    this.componentBlurUnsubscribe?.();
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
  }

  public setHeaderComponent(headerComponent: HeaderComponent) {
    if (headerComponent) {
      this.headerComponent = headerComponent;
      // Set modal filter component
      if (this.headerComponent && this.screenFilters?.getFilterModalContainerComponent()) {
        this.headerComponent.setFilterModalContainerComponent(this.screenFilters.getFilterModalContainerComponent());
      }
    }
  }

  public getHeaderComponent(): HeaderComponent {
    return this.headerComponent;
  }

  public setScreenFilters(screenFilters: ScreenFilters) {
    if (screenFilters) {
      this.screenFilters = screenFilters;
      // Set modal filter component
      if (this.headerComponent && this.screenFilters.getFilterModalContainerComponent()) {
        this.headerComponent.setFilterModalContainerComponent(this.screenFilters.getFilterModalContainerComponent());
      }
    }
  }

  public getScreenFilters(): ScreenFilters {
    return this.screenFilters;
  }

  public onBack(): boolean {
    this.props.navigation.goBack();
    return true;
  }

  public componentDidFocus(): void {
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
  }

  public componentDidBlur(): void {
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
  }
}
