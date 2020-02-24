import React from 'react';
import FilterModalContainerComponent from '../FilterModalContainerComponent';

export interface BaseFilterControlProps {
  internalFilterID: string;
  filterID: string;
  label: string;
  locale?: string;
  initialValue?: any;
}

interface BaseFilterControlState {
}

export default class BaseFilterControlComponent extends React.Component<BaseFilterControlProps, BaseFilterControlState> {
  public state: BaseFilterControlState;
  public props: BaseFilterControlProps;
  private value: any = null;
  private filterContainerComponent: FilterModalContainerComponent;

  constructor(props: BaseFilterControlProps) {
    super(props);
    this.value = this.props.initialValue;
    this.state = {
    };
  }

  public async setFilterContainerComponent(filterContainerComponent: FilterModalContainerComponent) {
    // Add filter
    await filterContainerComponent.addFilter(this);
    // Update
    this.filterContainerComponent = filterContainerComponent;
  }

  public getFilterContainerComponent(): FilterModalContainerComponent {
    return this.filterContainerComponent;
  }

  public setState = (state: BaseFilterControlState | ((prevState: Readonly<BaseFilterControlState>, props: Readonly<BaseFilterControlProps>) => BaseFilterControlState | Pick<BaseFilterControlState, never>) | Pick<BaseFilterControlState, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return false;
  }

  public setValue(value: any) {
    this.value = value;
  }

  public getValue(): any {
    return this.value;
  }

  public clearValue() {
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
