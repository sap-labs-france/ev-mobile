import React from 'react';

import ProviderFactory from '../../../../provider/ProviderFactory';
import SecuredStorage from '../../../../utils/SecuredStorage';
import FilterControlComponent from '../controls/FilterControlComponent';

export interface FilterContainerComponentProps {
  onFilterChanged?: (filters: any, applyFilters: boolean) => void;
  visible?: boolean;
  children?: React.ReactNode;
}

export interface FilterContainerComponentState {
  visible?: boolean;
}

export default abstract class FilterContainerComponent extends React.Component<
FilterContainerComponentProps,
FilterContainerComponentState
> {
  public static defaultProps = {
    visible: false
  };
  public state: FilterContainerComponentState;
  public props: FilterContainerComponentProps;
  private filterControlComponents: FilterControlComponent<any>[] = [];

  public constructor(props: FilterContainerComponentProps) {
    super(props);
    this.state = {
      visible: props.visible ?? false
    };
  }

  public setState = (
    state:
    | FilterContainerComponentState
    | ((
      prevState: Readonly<FilterContainerComponentState>,
      props: Readonly<FilterContainerComponentProps>
    ) => FilterContainerComponentState | Pick<FilterContainerComponentState, never>)
    | Pick<FilterContainerComponentState, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public setVisible = (visible: boolean) => {
    this.setState({ visible });
  };

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
  }

  public setFilterControlComponents(filterControlComponents: FilterControlComponent<any>[]) {
    this.filterControlComponents = filterControlComponents;
  }

  public setFilter(filterID: string, filterValue: any) {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      // Set
      if (filterControlComponent.getID() === filterID) {
        filterControlComponent.setValue(filterValue, this.notifyFilterChanged.bind(this));
        break;
      }
    }
  }

  public clearFilter = async (filterID: string) => {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getID() === filterID) {
        // Set
        filterControlComponent.clearValue(this.notifyFilterChanged.bind(this));
        break;
      }
    }
  };

  public getFilter = (id: string): any => {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getID() === id) {
        return filterControlComponent.getValue();
      }
    }
    return null;
  };

  public getFilters = (): any => {
    const filters: any = {};
    // Build
    for (const filterControlComponent of this.filterControlComponents) {
      filters[filterControlComponent.getID()] = filterControlComponent.getValue();
    }
    return filters;
  };

  public countFilters(): number {
    return React.Children.toArray(this.props.children).length;
  }

  public async applyFiltersAndNotify() {
    // Save
    await this.saveFilters();
    // Trigger notif
    this.notifyFilterChanged();
  }

  public clearFilters() {
    // Clear
    for (const filterControlComponent of this.filterControlComponents) {
      filterControlComponent.clearValue();
    }
  }

  public async clearFiltersAndNotify() {
    // Clear
    this.clearFilters();
    // Save
    await this.saveFilters();
    // Trigger notif
    this.notifyFilterChanged();
  }

  public async saveFilters() {
    // Build
    for (const filterControlComponent of this.filterControlComponents) {
      // Save
      if (filterControlComponent.canBeSaved()) {
        // Get Provider
        const centralServerProvider = await ProviderFactory.getProvider();
        // Get Token
        const user = centralServerProvider.getUserInfo();
        // Save
        await SecuredStorage.saveFilterValue(user, filterControlComponent.getInternalID(), filterControlComponent.getValue());
      }
    }
  }
}
