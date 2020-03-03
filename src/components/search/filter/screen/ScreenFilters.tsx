import React from 'react';
import CentralServerProvider from '../../../../provider/CentralServerProvider';
import ProviderFactory from '../../../../provider/ProviderFactory';
import SecurityProvider from '../../../../provider/SecurityProvider';
import FilterModalContainerComponent from '../containers/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../containers/FilterVisibleContainerComponent';

export interface ScreenFiltersProps {
}

export interface ScreenFiltersState {
  isAdmin?: boolean;
  hasSiteAdmin?: boolean;
  locale?: string;
}

export default class ScreenFilters extends React.Component<ScreenFiltersProps, ScreenFiltersState> {
  public state: ScreenFiltersState;
  public props: ScreenFiltersProps;
  private filterVisibleContainerComponent: FilterVisibleContainerComponent;
  private filterModalContainerComponent: FilterModalContainerComponent;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;

  constructor(props: ScreenFiltersProps) {
    super(props);
    this.state = {
      isAdmin: false,
      hasSiteAdmin: false,
      locale: null
    };
  }

  public async componentDidMount() {
    let locale = null;
    let isAdmin = false;
    let hasSiteAdmin = false;
    // Get Provider
    this.centralServerProvider = await ProviderFactory.getProvider();
    if (this.centralServerProvider) {
      locale = this.centralServerProvider.getUserLanguage();
      // Get Security
      this.securityProvider = this.centralServerProvider.getSecurityProvider();
      if (this.securityProvider) {
        isAdmin = this.securityProvider.isAdmin();
        hasSiteAdmin = this.securityProvider.hasSiteAdmin();
      }
    }
    this.setState({
      isAdmin,
      hasSiteAdmin,
      locale
    });
  }

  public setState = (state: ScreenFiltersState | ((prevState: Readonly<ScreenFiltersState>, props: Readonly<ScreenFiltersProps>) => ScreenFiltersState | Pick<ScreenFiltersState, never>) | Pick<ScreenFiltersState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getFilterModalContainerComponent(): FilterModalContainerComponent {
    return this.filterModalContainerComponent;
  }

  public setFilterModalContainerComponent(filterModalContainerComponent: FilterModalContainerComponent) {
    this.filterModalContainerComponent = filterModalContainerComponent;
  }

  public getFilterVisibleContainerComponent(): FilterVisibleContainerComponent {
    return this.filterVisibleContainerComponent;
  }

  public setFilterVisibleContainerComponent(filterVisibleContainerComponent: FilterVisibleContainerComponent) {
    this.filterVisibleContainerComponent = filterVisibleContainerComponent;
  }
}
