import React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import CentralServerProvider from '../../../../provider/CentralServerProvider';
import ProviderFactory from '../../../../provider/ProviderFactory';

export interface FilterControlComponentProps<T> {
  internalFilterID?: string;
  filterID: string;
  label?: string;
  locale?: string;
  initialValue?: T;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  onFilterChanged?: (id: string, value: T) => Promise<void> | void;
}

export interface FilterControlComponentState<T> {
  value?: T;
}

export default class FilterControlComponent<T> extends React.Component<FilterControlComponentProps<T>, FilterControlComponentState<T>> {
  public static defaultProps = {
    style: {}
  };
  public state: FilterControlComponentState<T>;
  public props: FilterControlComponentProps<T>;
  protected centralServerProvider: CentralServerProvider;

  public constructor(props: FilterControlComponentProps<T>) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
  }

  public async componentDidMount() {
    this.centralServerProvider = await ProviderFactory.getProvider();
  }

  public componentDidUpdate(prevProps: Readonly<FilterControlComponentProps<T>>, prevState: Readonly<FilterControlComponentState<T>>, snapshot?: any) {
    const { initialValue } = this.props;
    // If filter is not aware of initialValue change, set new initialValue to state
    if ( (initialValue !== prevProps.initialValue) && (this.state.value !== initialValue) ) {
      this.setState({value: initialValue });
    }
  }

  public setState = (
    state:
      | FilterControlComponentState<T>
      | ((
          prevState: Readonly<FilterControlComponentState<T>>,
          props: Readonly<FilterControlComponentProps<T>>
        ) => FilterControlComponentState<T> | Pick<FilterControlComponentState<T>, never>)
      | Pick<FilterControlComponentState<T>, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public canBeSaved() {
    return false;
  }

  public setValue(value: any, callback?: () => void) {
    this.setState({ value }, callback);
  }

  public getValue(): any {
    return this.state.value;
  }

  public clearValue(callback?: () => unknown) {
    // Prevent callers to setState when component not mounted.
    this.setState({value: null}, () => callback?.());
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
