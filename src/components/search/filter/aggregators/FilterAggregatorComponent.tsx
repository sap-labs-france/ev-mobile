import React from 'react';
import SecuredStorage from '../../../../utils/SecuredStorage';
import FilterControlComponent from '../controls/FilterControlComponent';

export interface FilterAggregatorComponentProps {
  onFilterChanged?: (filters: any) => void;
}

interface FilterAggregatorComponentState {
}

export default abstract class FilterAggregatorComponent extends React.Component<FilterAggregatorComponentProps, FilterAggregatorComponentState> {
  public state: FilterAggregatorComponentState;
  public props: FilterAggregatorComponentProps;
  private filterControlComponents: FilterControlComponent<any>[] = [];

  constructor(props: FilterAggregatorComponentProps) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: FilterAggregatorComponentState | ((prevState: Readonly<FilterAggregatorComponentState>, props: Readonly<FilterAggregatorComponentProps>) => FilterAggregatorComponentState | Pick<FilterAggregatorComponentState, never>) | Pick<FilterAggregatorComponentState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public abstract notifyFilterChanged(): void;

  public async addFilter(newFilterComponent: FilterControlComponent<any>) {
    // Search
    if (this.filterControlComponents) {
      for (let index = 0; index < this.filterControlComponents.length; index++) {
        const filterControlComponent = this.filterControlComponents[index];
        if (filterControlComponent.getID() === newFilterComponent.getID()) {
          // Replace
          this.filterControlComponents.splice(index, 1, filterControlComponent);
          return;
        }
      }
      // Add new
      this.filterControlComponents.push(newFilterComponent);
    }
  }

  public setFilter = async (filterID: string, filterValue: any) => {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getID() === filterID) {
        // Set
        filterControlComponent.setValue(filterValue);
        break;
      }
    }
  }

  public clearFilter = async (filterID: string) => {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getID() === filterID) {
        // Set
        filterControlComponent.clearValue();
        break;
      }
    }
  }

  public getFilter = (ID: string): string => {
    // Search
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getID() === ID) {
        return filterControlComponent.getValue();
      }
    }
    return null;
  }

  public getFilters = (): any => {
    const filters: any = {};
    // Build
    for (const filterControlComponent of this.filterControlComponents) {
      filters[filterControlComponent.getID()] = filterControlComponent.getValue();
    }
    return filters;
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

  public getNumberOfFilters(): number {
    let numberOfFilter = 0
    for (const filterControlComponent of this.filterControlComponents) {
      if (filterControlComponent.getValue()) {
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
    this.notifyFilterChanged();
  }

  public saveFilters = async () => {
    // Build
    for (const filterControlComponent of this.filterControlComponents) {
      // Save
      if (filterControlComponent.canBeSaved()) {
        await SecuredStorage.saveFilterValue(filterControlComponent.getInternalID(), filterControlComponent.getValue());
      }
    }
  }
}
