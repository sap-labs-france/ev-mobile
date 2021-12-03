import React from 'react';
import { Marker } from 'react-native-maps';
import { View } from 'native-base';
import { Text } from 'react-native';
import computeStyleSheet from './MapClusterStyle';

export interface Props {
  cluster: any;
}

interface State {}

export default class MapCluster extends React.Component<Props, State> {

  public render() {
    const style = computeStyleSheet();
    const { geometry, onPress, id, properties } = this.props?.cluster;
    return (
      <Marker onPress={onPress} tracksViewChanges={false} key={id} coordinate={{longitude: geometry.coordinates[0], latitude: geometry.coordinates[1]}}>
        <View style={style.cluster}><Text>{properties?.point_count}</Text></View>
      </Marker>
    );
  }
}
