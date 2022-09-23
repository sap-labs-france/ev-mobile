import React from 'react';
import { Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import computeStyleSheet from './ClusterComponentStyle';

export interface Props {
  cluster: any;
}

interface State {}

export default class ClusterComponent extends React.Component<Props, State> {

  public render() {
    const style = computeStyleSheet();
    const { geometry, onPress, id, properties } = this.props?.cluster;
    return (
      <Marker onPress={onPress} tracksViewChanges={false} key={id} coordinate={{longitude: geometry.coordinates[0], latitude: geometry.coordinates[1]}}>
        <View style={style.cluster}><Text style={style.text}>{properties?.point_count}</Text></View>
      </Marker>
    );
  }
}
