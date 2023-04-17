import React from 'react';

import BaseProps from '../../types/BaseProps';
import { ChargePointStatus } from '../../types/ChargingStation';
import ConnectorStats from '../../types/ConnectorStats';
import ConnectorStatusComponent from './ConnectorStatusComponent';
import computeStyleSheet from './ConnectorStatusesContainerComponentStyles';
import { View } from 'react-native';

export interface Props extends BaseProps {
  connectorStats: ConnectorStats;
}

interface State {}

export default class ConnectorStatusesContainerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { connectorStats, navigation } = this.props;
    return (
      <View style={style.container}>
        <View style={{ flex: 1 }}>
          <ConnectorStatusComponent
            navigation={navigation}
            value={connectorStats?.availableConnectors}
            status={ChargePointStatus.AVAILABLE}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ConnectorStatusComponent
            navigation={navigation}
            value={connectorStats?.unavailableConnectors + connectorStats?.faultedConnectors}
            status={ChargePointStatus.UNAVAILABLE}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ConnectorStatusComponent navigation={navigation} value={connectorStats?.chargingConnectors} status={ChargePointStatus.CHARGING} />
        </View>
        <View style={{ flex: 1 }}>
          <ConnectorStatusComponent
            navigation={navigation}
            value={connectorStats?.suspendedConnectors + connectorStats?.finishingConnectors + connectorStats?.preparingConnectors}
            text={'connector.notCharging'}
            status={ChargePointStatus.SUSPENDED_EVSE}
          />
        </View>
      </View>
    );
  }
}
