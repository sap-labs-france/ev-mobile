import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import ProviderFactory from '../../../provider/ProviderFactory';
import SecurityProvider from '../../../provider/SecurityProvider';
import FilterContainerComponent from './FilterContainerComponent';

export interface BaseScreenFiltersProps {
}

export interface BaseScreenFiltersState {
  isAdmin?: boolean;
  locale?: string;
}

export default class BaseScreenFilters extends React.Component<BaseScreenFiltersProps, BaseScreenFiltersState> {
  public state: BaseScreenFiltersState;
  public props: BaseScreenFiltersProps;
  private filterContainerComponent: FilterContainerComponent;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;

  constructor(props: BaseScreenFiltersProps) {
    super(props);
    this.state = {
      isAdmin: false,
      locale: null
    };
  }

  public async componentDidMount() {
    let locale = null;
    let isAdmin = false;
    // Get Provider
    this.centralServerProvider = await ProviderFactory.getProvider();
    if (this.centralServerProvider) {
      locale = this.centralServerProvider.getUserLanguage();
      // Get Security
      this.securityProvider = this.centralServerProvider.getSecurityProvider();
      if (this.securityProvider) {
        isAdmin = this.securityProvider.isAdmin();
      }
    }
    this.setState({
      isAdmin,
      locale
    });
  }

  public setState = (state: BaseScreenFiltersState | ((prevState: Readonly<BaseScreenFiltersState>, props: Readonly<BaseScreenFiltersProps>) => BaseScreenFiltersState | Pick<BaseScreenFiltersState, never>) | Pick<BaseScreenFiltersState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getFilterContainerComponent(): FilterContainerComponent {
    return this.filterContainerComponent;
  }

  public setFilterContainerComponent(filterContainerComponent: FilterContainerComponent) {
    this.filterContainerComponent = filterContainerComponent;
  }
}
