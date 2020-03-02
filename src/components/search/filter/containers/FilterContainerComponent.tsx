import React from 'react';
import FilterAggregatorComponent, { FilterAggregatorComponentProps } from '../aggregators/FilterAggregatorComponent';
import FilterAggregatorContainerComponent from '../aggregators/FilterAggregatorContainerComponent';

export interface FilterContainerComponentProps extends FilterAggregatorComponentProps {
  children?: React.ReactNode;
  containerID: string;
}

interface FilterContainerComponentState {
}

export default abstract class FilterContainerComponent extends FilterAggregatorComponent {
  public state: FilterContainerComponentState;
  public props: FilterContainerComponentProps;
  private filterAggregatorContainerComponent: FilterAggregatorContainerComponent;

  constructor(props: FilterContainerComponentProps) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: FilterContainerComponentState | ((prevState: Readonly<FilterContainerComponentState>, props: Readonly<FilterContainerComponentProps>) => FilterContainerComponentState | Pick<FilterContainerComponentState, never>) | Pick<FilterContainerComponentState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public abstract setVisible(visible: boolean): void;

  public async setFilterAggregatorContainerComponent(filterAggregatorContainerComponent: FilterAggregatorContainerComponent) {
    this.filterAggregatorContainerComponent = filterAggregatorContainerComponent;
  }  

  public getFilterAggregatorContainerComponent(): FilterAggregatorContainerComponent {
    return this.filterAggregatorContainerComponent;
  }  

  public notifyFilterChanged(): void {
    if (this.filterAggregatorContainerComponent) {
      this.filterAggregatorContainerComponent.applyFiltersAndNotify();
    }
  }

  public getID(): string {
    const { containerID } = this.props;
    return containerID;
  }
}
