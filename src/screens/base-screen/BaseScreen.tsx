import React from 'react';
import { BackHandler } from 'react-native';
import { NavigationEventSubscription } from 'react-navigation';
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

  constructor(props: Props) {
    super(props);
    this.mounted = false;
    // Add listeners
    this.didFocus = props.navigation.addListener('didFocus', this.componentDidFocus.bind(this));
    this.didBlur = props.navigation.addListener('didBlur', this.componentDidBlur.bind(this));
  }

  public isMounted(): boolean {
    return this.mounted;
  }

  public async componentDidMount() {
    this.mounted = true;
    this.centralServerProvider = await ProviderFactory.getProvider();
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
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
