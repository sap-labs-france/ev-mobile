import React from 'react';
import ComplexSearchComponent from './ComplexSearchComponent';

export interface BaseFilterProps {
  internalFilterID: string;
  filterID: string;
  label: string;
  locale?: string;
  initialValue?: any;
}

interface State {
}

export default class BaseFilterComponent extends React.Component<BaseFilterProps, State> {
  public state: State;
  public props: BaseFilterProps;
  private value: any = null;
  private complexSearchComponent: ComplexSearchComponent;

  constructor(props: BaseFilterProps) {
    super(props);
    this.value = this.props.initialValue;
    this.state = {
    };
  }

  public async setComplexSearchComponent(complexSearchComponent: ComplexSearchComponent) {
    // Add filter
    await complexSearchComponent.addFilter(this);
    // Update
    this.complexSearchComponent = complexSearchComponent;
  }

  public getComplexSearchComponent(): ComplexSearchComponent {
    return this.complexSearchComponent;
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<BaseFilterProps>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
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
