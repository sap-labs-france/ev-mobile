import { View } from "native-base";
import React from "react";
import I18n from "../../I18n/I18n";
import BaseProps from "../../types/BaseProps";
import ConnectorStats from "../../types/ConnectorStats";
import Constants from "../../utils/Constants";
import Utils from "../../utils/Utils";
import ConnectorStatusComponent from "./ConnectorStatusComponent";
import computeStyleSheet from "./ConnectorStatusesContainerComponentStyles";

export interface Props extends BaseProps {
  connectorStats: ConnectorStats;
}

interface State {
}

export default class ConnectorStatusesContainerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }
  
  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { connectorStats, navigation } = this.props;
    return (
      <View style={style.container}>
        <ConnectorStatusComponent
          navigation={navigation}
          value={connectorStats.availableConnectors}
          text={Utils.translateConnectorStatus(Constants.CONN_STATUS_AVAILABLE)}
          type={Constants.CONN_STATUS_AVAILABLE}
        />
        <ConnectorStatusComponent
          navigation={navigation}
          value={
            connectorStats.suspendedConnectors +
            connectorStats.finishingConnectors +
            connectorStats.preparingConnectors +
            connectorStats.unavailableConnectors
          }
          text={I18n.t("connector.notCharging")}
          type={Constants.CONN_STATUS_SUSPENDED_EVSE}
        />
        <ConnectorStatusComponent
          navigation={navigation}
          value={connectorStats.chargingConnectors}
          text={Utils.translateConnectorStatus(Constants.CONN_STATUS_CHARGING)}
          type={Constants.CONN_STATUS_CHARGING}
        />
      </View>
    );
  }
}
