import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import ProviderFactory from '../../../../provider/ProviderFactory';
import SecurityProvider from '../../../../provider/SecurityProvider';
import FilterAggregatorContainerComponent from '../aggregators/FilterAggregatorContainerComponent';

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
  private filterAggregatorContainerComponent: FilterAggregatorContainerComponent;
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

  public getFilterAggregatorContainerComponent(): FilterAggregatorContainerComponent {
    return this.filterAggregatorContainerComponent;
  }

  public setFilterAggregatorContainerComponent(filterAggregatorContainerComponent: FilterAggregatorContainerComponent) {
    this.filterAggregatorContainerComponent = filterAggregatorContainerComponent;
  }
}
