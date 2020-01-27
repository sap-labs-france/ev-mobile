import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ComplexSearchComponent from '../../../components/search/complex/ComplexSearchComponent';
import ProviderFactory from '../../../provider/ProviderFactory';
import SecurityProvider from '../../../provider/SecurityProvider';

export interface BaseFiltersProps {
}

export interface BaseFiltersState {
  isAdmin?: boolean;
  locale?: string;
}

export default class BaseFilters extends React.Component<BaseFiltersProps, BaseFiltersState> {
  public state: BaseFiltersState;
  public props: BaseFiltersProps;
  private complexSearchComponent: ComplexSearchComponent;
  private headerComponent: HeaderComponent;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;

  constructor(props: BaseFiltersProps) {
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

  public setHeaderComponent(headerComponent: HeaderComponent) {
    this.headerComponent = headerComponent;
    if (this.getComplexSearchComponent()) {
      this.headerComponent.setSearchComplexComponent(this.getComplexSearchComponent());
    }
}

  public getHeaderComponent(): HeaderComponent {
    return this.headerComponent;
  }

  public setState = (state: BaseFiltersState | ((prevState: Readonly<BaseFiltersState>, props: Readonly<BaseFiltersProps>) => BaseFiltersState | Pick<BaseFiltersState, never>) | Pick<BaseFiltersState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setComplexSearchComponent(complexSearchComponent: ComplexSearchComponent) {
    if (complexSearchComponent) {
      this.complexSearchComponent = complexSearchComponent;
      if (this.getHeaderComponent()) {
        this.getHeaderComponent().setSearchComplexComponent(complexSearchComponent);
      }
    }
  }

  public getComplexSearchComponent(): ComplexSearchComponent {
    return this.complexSearchComponent;
  }
}
