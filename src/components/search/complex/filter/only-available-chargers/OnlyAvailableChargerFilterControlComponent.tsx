import { Switch, Text, View } from 'native-base';
import React from 'react';
import { ChargePointStatus } from '../../../../../types/ChargingStation';
import BaseFilterControlComponent, { BaseFilterControlProps } from '../BaseFilterControlComponent';
import computeStyleSheet from '../BaseFilterControlComponentStyles';

export interface Props extends BaseFilterControlProps {
}

interface State {
  switchValue?: boolean;
}

export default class OnlyAvailableChargerFilterControlComponent extends BaseFilterControlComponent {
  public state: State;
  public props: Props;
  private status: ChargePointStatus = ChargePointStatus.AVAILABLE;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return true;
  }

  public async componentDidMount() {
    // Set
    this.setState({
      switchValue: !!this.getValue()
    })
  }

  private onValueChanged = async (newValue: boolean) => {
    // Set Filter
    if (newValue) {
      await this.getFilterContainerComponent().setFilterValue(this.getID(), this.status);
    } else {
      await this.getFilterContainerComponent().clearFilterValue(this.getID());
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
