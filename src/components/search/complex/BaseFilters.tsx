import React from 'react';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ComplexSearchComponent from '../../../components/search/complex/ComplexSearchComponent';

export interface Props {
}

interface State {
}

export default class BaseFilters extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private complexSearchComponent: ComplexSearchComponent;
  private headerComponent: HeaderComponent;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setHeaderComponent(headerComponent: HeaderComponent) {
    this.headerComponent = headerComponent;
    if (this.getComplexSearchComponent()) {
      this.headerComponent.setSearchComplexComponent(this.getComplexSearchComponent());
    }
}

  public getHeaderComponent(): HeaderComponent {
    return this.headerComponent;
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setComplexSearchComponent(complexSearchComponent: ComplexSearchComponent) {
    if (complexSearchComponent) {
      this.complexSearchComponent = complexSearchComponent;
      if (this.getHeaderComponent()) {
        this.getHeaderComponent().setSearchComplexComponent(complexSearchComponent);
      }
    }
  }

  public getComplexSearchComponent(): ComplexSearchComponent {
    return this.complexSearchComponent;
  }
}
