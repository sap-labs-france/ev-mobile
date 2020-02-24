import { Switch, Text, View } from 'native-base';
import React from 'react';
import ProviderFactory from '../../../../../provider/ProviderFactory';
import BaseFilterControlComponent, { BaseFilterControlProps } from '../BaseFilterControlComponent';
import computeStyleSheet from '../BaseFilterControlComponentStyles';

export interface Props extends BaseFilterControlProps {
}

interface State {
  switchValue?: boolean;
}

export default class MyUserSwitchFilterControlComponent extends BaseFilterControlComponent {
  public state: State;
  public props: Props;
  private userID: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      switchValue: !!this.getValue()
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

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
    // Set Filter
    if (newValue) {
      await this.getFilterContainerComponent().setFilter(this.getID(), this.userID);
    } else {
      await this.getFilterContainerComponent().clearFilter(this.getID());
    }
    // Update
    this.setState({ switchValue: newValue });
  }

  public render = () => {
    const style = computeStyleSheet();
    const { label } = this.props;
    const { switchValue } = this.state;
    return (
      <View style={style.rowFilter}>
        <Text style={style.textFilter}>{label}</Text>
        <Switch
          style={style.switchFilter}
          value={switchValue}
          onValueChange={this.onValueChanged}
        />
      </View>
    );
  }
}
