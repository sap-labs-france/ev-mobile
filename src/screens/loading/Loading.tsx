import React from 'react';
import {View} from 'react-native';
import {Spinner} from 'native-base';
import Utils from '../../utils/Utils';

export interface Props {}

interface State {}

export default class Loading extends React.Component<Props, State> {
  public render() {
    return (
      <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Spinner color={Utils.getCurrentCommonColor().disabledDark}/>
      </View>
    );
  }
}
