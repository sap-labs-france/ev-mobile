import { Switch, Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import ProviderFactory from '../../../../../provider/ProviderFactory';
import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<string> {}

interface State extends FilterControlComponentState<string> {
  switchValue?: boolean;
}

export default class MyUserSwitchFilterControlComponent extends FilterControlComponent<string> {
  public state: State;
  public props: Props;
  private userID: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      switchValue: !!this.getValue(),
      value: this.props.initialValue
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public canBeSaved() {
    return true;
  }

  public async componentDidMount() {
    // Get corresponding
    const centralServerProvider = await ProviderFactory.getProvider();
    if (centralServerProvider) {
      this.userID = centralServerProvider.getUserInfo().id;
    }
  }

  private onValueChanged = async (newValue: boolean) => {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      if (newValue) {
        this.setValue(this.userID, () => {
          onFilterChanged(this.getID(), this.userID);
        });
      } else {
        this.clearValue(() => {
          onFilterChanged(this.getID(), null);
        });
      }
    }
    // Update
    this.setState({ switchValue: newValue });
  };

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { label, style } = this.props;
    const { switchValue } = this.state;
    return (
      <View style={StyleSheet.compose(internalStyle.rowFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <Switch style={internalStyle.switchFilter} value={switchValue} onValueChange={this.onValueChanged} />
      </View>
    );
  };
}
