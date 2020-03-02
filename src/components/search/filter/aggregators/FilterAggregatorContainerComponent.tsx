import { View } from 'native-base';
import React from 'react';
import FilterContainerComponent from '../containers/FilterContainerComponent';

export interface Props {
  children?: React.ReactNode;
  onFilterChanged?: (filters: any) => void;
}

interface State {
}

export default class FilterAggregatorContainerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private filterContainerComponents: FilterContainerComponent[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async addFilterContainerComponent(newFilterContainerComponent: FilterContainerComponent) {
    // Search
    for (const filterContainerComponent of this.filterContainerComponents) {
      if (filterContainerComponent.getID() === newFilterContainerComponent.getID()) {
        return;
      }
    }
    // Add new
    this.filterContainerComponents.push(newFilterContainerComponent);
  }

  public getFilterContainerComponent(containerID: string): FilterContainerComponent {
    // Search
    for (const filterContainerComponent of this.filterContainerComponents) {
      if (filterContainerComponent.getID() === containerID) {
        return filterContainerComponent;
      }
    }
    return null;
  }

  public setVisible(visible: boolean) {
    for (const filterContainerComponent of this.filterContainerComponents) {
      filterContainerComponent.setVisible(visible);
    }
  }

  public getFilterContainerComponents(): FilterContainerComponent[] {
    return this.filterContainerComponents;
  }

  public async applyFiltersAndNotify() {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    if (onFilterChanged) {
      let aggregatedFilters = {};
      for (const filterContainerComponent of this.filterContainerComponents) {
        const newFilters = filterContainerComponent.getFilters();
        aggregatedFilters = { ...aggregatedFilters, ...newFilters };
      }
      onFilterChanged(aggregatedFilters);
    }
  }

  public getNumberOfFilters(): number {
    let numberOfFilter = 0
    for (const filterContainerComponent of this.filterContainerComponents) {
      numberOfFilter += filterContainerComponent.getNumberOfFilters();
    }
    return numberOfFilter;
  }

  private saveFilters = async () => {
    // Build
    for (const filterContainerComponent of this.filterContainerComponents) {
      // Save
      await filterContainerComponent.saveFilters();
    }
  }

  public render = () => {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}
