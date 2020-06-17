import React from 'react';

import CentralServerProvider from '../../../../provider/CentralServerProvider';
import ProviderFactory from '../../../../provider/ProviderFactory';
import SecurityProvider from '../../../../provider/SecurityProvider';
import FilterModalContainerComponent from '../containers/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../containers/FilterVisibleContainerComponent';
import FilterControlComponent from '../controls/FilterControlComponent';

export interface ScreenFiltersProps {
}

export interface ScreenFiltersState {
  isAdmin?: boolean;
  hasSiteAdmin?: boolean;
  locale?: string;
  expanded?: boolean;
}

export default class ScreenFilters extends React.Component<ScreenFiltersProps, ScreenFiltersState> {
  public state: ScreenFiltersState;
  public props: ScreenFiltersProps;
  private filterVisibleContainerComponent: FilterVisibleContainerComponent;
  private filterModalContainerComponent: FilterModalContainerComponent;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;
  private filterModalControlComponents: FilterControlComponent<any>[] = [];
  private filterVisibleControlComponents: FilterControlComponent<any>[] = [];
  private expandableView: any;

  constructor(props: ScreenFiltersProps) {
    super(props);
    this.state = {
      isAdmin: false,
      hasSiteAdmin: false,
      locale: null,
      expanded: false,
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

  public setViewExpanded = (expanded: boolean, styleFrom?: object, styleTo?: object) => {
    if (expanded && styleFrom && styleTo) {
      this.expandableView.animate({ from: styleFrom, to: styleTo }, 250);
    } else {
      this.expandableView.animate({ from: styleTo, to: styleFrom }, 250);
    }
    this.setState({expanded});
  }

  public setExpandableView = (expandableView: any) => {
    if (expandableView) {
      this.expandableView = expandableView;
    }
  }

  public setState = (state: ScreenFiltersState | ((prevState: Readonly<ScreenFiltersState>, props: Readonly<ScreenFiltersProps>) => ScreenFiltersState | Pick<ScreenFiltersState, never>) | Pick<ScreenFiltersState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getFilterModalContainerComponent(): FilterModalContainerComponent {
    return this.filterModalContainerComponent;
  }

  public setFilterModalContainerComponent(filterModalContainerComponent: FilterModalContainerComponent) {
    if (filterModalContainerComponent) {
      this.filterModalContainerComponent = filterModalContainerComponent;
      this.filterModalContainerComponent.setFilterControlComponents(this.filterModalControlComponents);
    }
  }

  public getFilterVisibleContainerComponent(): FilterVisibleContainerComponent {
    return this.filterVisibleContainerComponent;
  }

  public setFilterVisibleContainerComponent(filterVisibleContainerComponent: FilterVisibleContainerComponent) {
    if (filterVisibleContainerComponent) {
      this.filterVisibleContainerComponent = filterVisibleContainerComponent;
      this.filterVisibleContainerComponent.setFilterControlComponents(this.filterVisibleControlComponents);
    }
  }

  public async addModalFilter(newFilterComponent: FilterControlComponent<any>) {
    if (newFilterComponent) {
      this.addFilter(this.filterModalControlComponents, newFilterComponent);
    }
  }

  public async addVisibleFilter(newFilterComponent: FilterControlComponent<any>) {
    if (newFilterComponent) {
      this.addFilter(this.filterVisibleControlComponents, newFilterComponent);
    }
  }

  private async addFilter(filterControlComponents: FilterControlComponent<any>[], newFilterComponent: FilterControlComponent<any>) {
    // Search
    if (filterControlComponents) {
      for (let index = 0; index < filterControlComponents.length; index++) {
        const filterControlComponent = filterControlComponents[index];
        if (filterControlComponent.getID() === newFilterComponent.getID()) {
          // Replace
          filterControlComponents.splice(index, 1, filterControlComponent);
          return;
        }
      }
      // Add new
      filterControlComponents.push(newFilterComponent);
    }
  }
}
