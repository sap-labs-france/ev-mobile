import { Switch, Text, View } from "native-base";
import React from "react";
import BaseFilterProps from "../../../../../types/BaseFilterProps";
import ComplexSearchComponent from "../../ComplexSearchComponent";
import computeStyleSheet from "../FilterComponentStyles";

export interface Props extends BaseFilterProps {
  initialValue?: boolean;
  userID: string;
}

interface State {
  complexSearchComponentRef?: ComplexSearchComponent;
}

export default class MyUserSwitchFilterComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private currentValue: boolean = false;
  public static defaultProps = {
    value: false
  };

  constructor(props: Props) {
    super(props);
    this.currentValue = this.props.initialValue;
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setSearchComplexComponentRef(complexSearchComponentRef: ComplexSearchComponent) {
    this.setState({
      complexSearchComponentRef
    });
  }

  private onValueChanged = (newValue: boolean) => {
    const { filterID, userID } = this.props;
    const { complexSearchComponentRef } = this.state;
    // Set Filter
    complexSearchComponentRef.setFilter(filterID, newValue ? userID : null)
    // Keep latest value
    this.currentValue = newValue;
  }

  public render = () => {
    const style = computeStyleSheet();
    const { label } = this.props;
    return (
      <View style={style.rowFilter}>
        <Text style={style.textFilter}>{label}</Text>
        <Switch
          style={style.switchFilter}
          value={this.currentValue}
          onValueChange={this.onValueChanged}
        />
      </View>
    );
  }
}
