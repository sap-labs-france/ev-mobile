import React from 'react';
import Utils from '../../utils/Utils';
import {ActivityIndicator, View} from 'react-native';

export interface Props {}

interface State {}

export default class Loading extends React.Component<Props, State> {
  public render() {
    return (
      <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={Utils.getCurrentCommonColor().disabledDark}/>
      </View>
    );
  }
}
