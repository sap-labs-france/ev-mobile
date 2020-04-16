import React from 'react';
import { BackHandler } from 'react-native';
import { NavigationEventSubscription } from 'react-navigation';
import HeaderComponent from '../../components/header/HeaderComponent';
import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';

export interface Props extends BaseProps {
}

interface State {
}

export default class BaseScreen<P, S> extends React.Component<Props, State> {
  protected mounted: boolean;
  protected centralServerProvider: CentralServerProvider;
  private didFocus: NavigationEventSubscription;
  private didBlur: NavigationEventSubscription;
  private headerComponent: HeaderComponent;
  private screenFilters: ScreenFilters;

  constructor(props: Props) {
    super(props);
    this.mounted = false;
  }

  public isMounted(): boolean {
    return this.mounted;
  }

  public async componentDidMount() {
    // Add listeners
    this.didFocus = this.props.navigation.addListener('didFocus', this.componentDidFocus.bind(this));
    this.didBlur = this.props.navigation.addListener('didBlur', this.componentDidBlur.bind(this));
    // Get provider
    this.centralServerProvider = await ProviderFactory.getProvider();
    // Remove Backhandler for Android
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    // Ok
    this.mounted = true;
  }

  public async componentWillUnmount() {
    this.mounted = false;
    // Remove listeners
    if (this.didFocus) {
      this.didFocus.remove();
    }
    if (this.didBlur) {
      this.didBlur.remove();
    }
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
    return false;
  }

  public async componentDidFocus() {
    BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
  }

  // tslint:disable-next-line: no-empty
  public async componentDidBlur() {}
}
