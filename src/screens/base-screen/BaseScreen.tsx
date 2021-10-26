import React from 'react';

import HeaderComponent from '../../components/header/HeaderComponent';
import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import SecurityProvider from '../../provider/SecurityProvider';
import BaseProps from '../../types/BaseProps';
import { BackHandler } from 'react-native';

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

  public constructor(props: Props) {
    super(props);
    this.mounted = false;
  }

  public isMounted(): boolean {
    return this.mounted;
  }

  public async componentDidMount() {
    // Get providers
    this.centralServerProvider = await ProviderFactory.getProvider();
    this.securityProvider = this.centralServerProvider.getSecurityProvider();
    // Add listeners
    this.componentFocusUnsubscribe = this.props.navigation.addListener('focus', this.componentDidFocus.bind(this));
    this.componentBlurUnsubscribe = this.props.navigation.addListener('blur', this.componentDidBlur.bind(this));
    // Ok
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.componentFocusUnsubscribe?.();
    this.componentBlurUnsubscribe?.();
  }

  public setHeaderComponent(headerComponent: HeaderComponent) {
    if (headerComponent) {
      this.headerComponent = headerComponent;
      // Set modal filter component
      if (this.headerComponent && this.screenFilters && this.screenFilters.getFilterModalContainerComponent()) {
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
    // Not Handled: has to be taken in the sub-classes
    return true;
  }

  public componentDidFocus(): void {}

  public componentDidBlur(): void {}
}
