import { Switch, Text, View } from 'native-base';
import React from 'react';
import BaseFilterProps from '../../../../../types/BaseFilterProps';
import ComplexSearchComponent from '../../ComplexSearchComponent';
import computeStyleSheet from '../FilterComponentStyles';

export interface Props extends BaseFilterProps {
  value?: boolean;
}

interface State {
  complexSearchComponentRef?: ComplexSearchComponent;
}

export default class SwitchFilterComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public static defaultProps = {
    value: false
  };

  constructor(props: Props) {
    super(props);
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

  public render = () => {
    const style = computeStyleSheet();
    const { complexSearchComponentRef } = this.state;
    const { filterID, label, value } = this.props;
    let currentFilterValue: boolean = value;
    if (complexSearchComponentRef) {
      currentFilterValue = complexSearchComponentRef.getFilter(filterID) === 'true';
    }
    return (
      <View style={style.rowFilter}>
        <Text style={style.textFilter}>{label}</Text>
        <Switch
          value={currentFilterValue}
          onValueChange={(newValue: boolean) => complexSearchComponentRef.setFilter(filterID, newValue + '')}
        />
      </View>
    );
  }
}
