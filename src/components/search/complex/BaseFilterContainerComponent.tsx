import React from 'react';
import SecuredStorage from '../../../utils/SecuredStorage';
import BaseFilterComponent from './filter/BaseFilterControlComponent';

export interface BaseFilterContainerComponentProps {
  onFilterChanged?: (filters: any, closed: boolean) => void;
}

interface BaseFilterContainerComponentState {
}

export default class BaseFilterContainerComponent<P, S> extends React.Component<BaseFilterContainerComponentProps, BaseFilterContainerComponentState> {
  public state: BaseFilterContainerComponentState;
  public props: BaseFilterContainerComponentProps;
  private filterComponents: BaseFilterComponent[] = [];

  constructor(props: BaseFilterContainerComponentProps) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: BaseFilterContainerComponentState | ((prevState: Readonly<BaseFilterContainerComponentState>, props: Readonly<BaseFilterContainerComponentProps>) => BaseFilterContainerComponentState | Pick<BaseFilterContainerComponentState, never>) | Pick<BaseFilterContainerComponentState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async addFilter(newFilterComponent: BaseFilterComponent) {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === newFilterComponent.getID()) {
        return;
      }
    }
    // Add new
    this.filterComponents.push(newFilterComponent);
  }

  public setFilter = async (filterID: string, filterValue: any) => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === filterID) {
        // Set
        filterContainerComponent.setValue(filterValue);
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public clearFilter = async (filterID: string) => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === filterID) {
        // Set
        filterContainerComponent.clearValue();
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public getFilter = (ID: string): string => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === ID) {
        return filterContainerComponent.getValue();
      }
    }
    return null;
  }

  public getFilters = (): any => {
    const filters: any = {};
    // Build
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getValue()) {
        filters[filterContainerComponent.getID()] = filterContainerComponent.getValue();
      }
    }
    return filters;
  }

  public onFilterChanged = (closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (onFilterChanged) {
      onFilterChanged(this.getFilters(), closed);
    }
  }

  public async applyFiltersAndNotify() {
    // Save
    await this.saveFilters();
    // Trigger notif
    this.onFilterChanged(true);
  }

  public clearFilters() {
    // Clear
    for (const filterContainerComponent of this.filterComponents) {
      filterContainerComponent.clearValue();
    }
  }

  public getNumberOfFilters(): number {
    let numberOfFilter = 0
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getValue()) {
        numberOfFilter++;
      }
    }
    return numberOfFilter;
  }

  public async clearFiltersAndNotify() {
    // Clear
    await this.clearFilters();
    // Save
    await this.saveFilters();
    // Trigger notif
    this.onFilterChanged(true);
  }

  private saveFilters = async () => {
    // Build
    for (const filterContainerComponent of this.filterComponents) {
      // Save
      if (filterContainerComponent.canBeSaved()) {
        await SecuredStorage.saveFilterValue(filterContainerComponent.getInternalID(), filterContainerComponent.getValue());
      }
    }
  }
}
