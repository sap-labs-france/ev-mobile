import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import ProviderFactory from '../../../provider/ProviderFactory';
import SecurityProvider from '../../../provider/SecurityProvider';
import FilterModalContainerComponent from './FilterModalContainerComponent';

export interface BaseScreenFiltersProps {
}

export interface BaseScreenFiltersState {
  isAdmin?: boolean;
  hasSiteAdmin?: boolean;
  locale?: string;
}

export default class BaseScreenFilters extends React.Component<BaseScreenFiltersProps, BaseScreenFiltersState> {
  public state: BaseScreenFiltersState;
  public props: BaseScreenFiltersProps;
  private filterContainerComponent: FilterModalContainerComponent;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;

  constructor(props: BaseScreenFiltersProps) {
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

  public setState = (state: BaseScreenFiltersState | ((prevState: Readonly<BaseScreenFiltersState>, props: Readonly<BaseScreenFiltersProps>) => BaseScreenFiltersState | Pick<BaseScreenFiltersState, never>) | Pick<BaseScreenFiltersState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getFilterContainerComponent(): FilterModalContainerComponent {
    return this.filterContainerComponent;
  }

  public setFilterContainerComponent(filterContainerComponent: FilterModalContainerComponent) {
    this.filterContainerComponent = filterContainerComponent;
  }
}
