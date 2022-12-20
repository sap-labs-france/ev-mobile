import React from 'react';
import { ViewStyle } from 'react-native';

import CentralServerProvider from '../../../../provider/CentralServerProvider';
import ProviderFactory from '../../../../provider/ProviderFactory';
import SecurityProvider from '../../../../provider/SecurityProvider';
import FilterModalContainerComponent from '../containers/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../containers/FilterVisibleContainerComponent';
import FilterControlComponent from '../controls/FilterControlComponent';

export interface ScreenFiltersProps<T> {
  onFilterChanged?: (filters: T) => void;
}

export interface ScreenFiltersState<T> {
  isAdmin?: boolean;
  hasSiteAdmin?: boolean;
  locale?: string;
  expanded?: boolean;
  filters?: T;
  modalFilters?: T;
}

export default class ScreenFilters<T, P extends ScreenFiltersProps<T> = ScreenFiltersProps<T>, S extends ScreenFiltersState<T> = ScreenFiltersState<T>> extends React.Component<P, S> {
  public state: S;
  public props: P;
  protected filterVisibleContainerComponent: FilterVisibleContainerComponent;
  protected filterModalContainerComponent: FilterModalContainerComponent;
  protected centralServerProvider: CentralServerProvider;
  protected securityProvider: SecurityProvider;
  private filterModalControlComponents: FilterControlComponent<any>[] = [];
  private filterVisibleControlComponents: FilterControlComponent<any>[] = [];
  private expandableView: any;

  public constructor(props: P) {
    super(props);
    this.state = {
      isAdmin: false,
      hasSiteAdmin: false,
      locale: null,
      expanded: false,
      filters: {} as T,
      modalFilters: {} as T
    } as S;
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

  public async loadInitialFilters(): Promise<void> {
    const initialFilters = await this.getInitialFilters();
    this.onFiltersChanged(initialFilters?.visibleFilters, initialFilters?.modalFilters, true);
  }

  protected getInitialFilters(): Promise<{visibleFilters: T, modalFilters: T}> {
    return Promise.resolve({visibleFilters: null, modalFilters: null});
  }

  public areModalFiltersActive() {
    const { modalFilters } = this.state;
    const nonNullFiltersValues =  Object.values(modalFilters).filter((filterValue) => filterValue)
    return nonNullFiltersValues?.length > 0;
  }

  public openModal() {
    this.filterModalContainerComponent.setVisible(true);
  }

  // Check if at least one filter is available
  public canFilter() {
    return this.filterModalContainerComponent?.countFilters() > 0;
  }

  onFiltersChanged(newVisibleFilters: T = {} as T, newModalFilters: T = {} as T, applyFilters?: boolean) {
    const { onFilterChanged } = this.props;
    const filters = { ...this.state.filters, ...newVisibleFilters, ...newModalFilters };
    const modalFilters = { ...this.state.modalFilters, ...newModalFilters};
    this.setState({ filters, modalFilters }, applyFilters ? () => onFilterChanged(filters) : () => {});
  }

  public setViewExpanded = (expanded: boolean, styleFrom?: ViewStyle, styleTo?: ViewStyle) => {
    if (expanded && styleFrom && styleTo) {
      this.expandableView.animate({ from: styleFrom, to: styleTo }, 250);
    } else {
      this.expandableView.animate({ from: styleTo, to: styleFrom }, 250);
    }
    this.setState({ expanded });
  };

  public setExpandableView = (expandableView: any) => {
    if (expandableView) {
      this.expandableView = expandableView;
    }
  };

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

  public addModalFilter(newFilterComponent: FilterControlComponent<any>) {
    if (newFilterComponent) {
      this.addFilter(this.filterModalControlComponents, newFilterComponent);
    }
  }

  public addVisibleFilter(newFilterComponent: FilterControlComponent<any>) {
    if (newFilterComponent) {
      this.addFilter(this.filterVisibleControlComponents, newFilterComponent);
    }
  }

  private addFilter(filterControlComponents: FilterControlComponent<any>[], newFilterComponent: FilterControlComponent<any>) {
    // Search
    if (filterControlComponents) {
      for (let index = 0; index < filterControlComponents.length; index++) {
        const filterControlComponent = filterControlComponents[index];
        if (filterControlComponent.getID() === newFilterComponent.getID()) {
          // Replace
          filterControlComponents.splice(index, 1, newFilterComponent);
          return;
        }
      }
      // Add new
      filterControlComponents.push(newFilterComponent);
    }
  }
}
