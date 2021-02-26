import React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface FilterControlComponentProps<T> {
  internalFilterID: string;
  filterID: string;
  label: string;
  locale?: string;
  initialValue?: T;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  onFilterChanged: (id: string, value: T) => void;
}

export interface FilterControlComponentState<T> {
  value?:T
}

export default class FilterControlComponent<T> extends React.Component<FilterControlComponentProps<T>, FilterControlComponentState<T>> {

  constructor(props: FilterControlComponentProps<T>) {
    super(props);
    this.state = {
      value:this.props.initialValue
    };
  }

  public static defaultProps = {
    style: {}
  };
  public state: FilterControlComponentState<T>;
  public props: FilterControlComponentProps<T>;

  public setState = (state: FilterControlComponentState<T> | ((prevState: Readonly<FilterControlComponentState<T>>, props: Readonly<FilterControlComponentProps<T>>) => FilterControlComponentState<T> | Pick<FilterControlComponentState<T>, never>) | Pick<FilterControlComponentState<T>, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return false;
  }

  public setValue(value: any, callback?: () => void) {
    this.setState({value}, callback);
  }

  public getValue(): any {
    return this.state.value;
  }

  public clearValue(callback?:()=>any) {
    this.setState({value:null}, callback);
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
