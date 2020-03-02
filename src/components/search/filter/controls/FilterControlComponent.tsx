import React from 'react';
import FilterContainerComponent from '../containers/FilterContainerComponent';

export interface FilterControlComponentProps<T> {
  internalFilterID: string;
  filterID: string;
  label: string;
  locale?: string;
  initialValue?: T;
}

interface FilterControlComponentState {
}

export default class FilterControlComponent<T> extends React.Component<FilterControlComponentProps<T>, FilterControlComponentState> {
  public state: FilterControlComponentState;
  public props: FilterControlComponentProps<T>;
  private value: T = null;
  private filterContainerComponent: FilterContainerComponent;

  constructor(props: FilterControlComponentProps<T>) {
    super(props);
    this.value = this.props.initialValue;
    this.state = {
    };
  }

  public async setFilterContainerComponent(filterContainerComponent: FilterContainerComponent) {
    this.filterContainerComponent = filterContainerComponent;
  }

  public getFilterContainerComponent(): FilterContainerComponent {
    return this.filterContainerComponent;
  }

  public setState = (state: FilterControlComponentState | ((prevState: Readonly<FilterControlComponentState>, props: Readonly<FilterControlComponentProps<T>>) => FilterControlComponentState | Pick<FilterControlComponentState, never>) | Pick<FilterControlComponentState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return false;
  }

  public async setValue(value: any) {
    this.value = value;
  }

  public getValue(): any {
    return this.value;
  }

  public async clearValue() {
    this.value = null;
  }

  public getID(): string {
    const { filterID } = this.props;
    return filterID;
  }

  public getInternalID(): string {
    const { internalFilterID } = this.props;
    return internalFilterID;
  }
}
