import React from 'react';
import FilterAggregatorComponent, { FilterAggregatorComponentProps } from '../aggregators/FilterAggregatorComponent';

export interface FilterContainerComponentProps extends FilterAggregatorComponentProps {
  children?: React.ReactNode;
}

interface FilterContainerComponentState {
}

export default abstract class FilterContainerComponent extends FilterAggregatorComponent {
  public state: FilterContainerComponentState;
  public props: FilterContainerComponentProps;

  constructor(props: FilterContainerComponentProps) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: FilterContainerComponentState | ((prevState: Readonly<FilterContainerComponentState>, props: Readonly<FilterContainerComponentProps>) => FilterContainerComponentState | Pick<FilterContainerComponentState, never>) | Pick<FilterContainerComponentState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public abstract setVisible(visible: boolean): void;

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters());
  }
}
