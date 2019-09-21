import moment from "moment";
import { Button, Icon, Text, View } from "native-base";
import React from "react";
import { Alert } from "react-native";
import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import BaseProps from "../../types/BaseProps";
import ChargingStation from "../../types/ChargingStation";
import computeStyleSheet from "./ChargerComponentStyles";
import ConnectorComponent from "./connector/ConnectorComponent";

export interface Props extends BaseProps {
  charger: ChargingStation;
}

interface State {
  isChargerDead?: boolean;
}

export default class ChargerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      isChargerDead: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public componentDidMount() {
    // Check if charger is dead
    this.checkHeartbeat();
  }

  public checkHeartbeat = () => {
    const { charger } = this.props;
    const lastHeartbeatMinutes = new Date(charger.lastHeartBeat).getMinutes();
    // Is last heartbeat has been sent more than 5 minutes ago ?
    if (new Date().getMinutes() - lastHeartbeatMinutes > 5) {
      this.setState({ isChargerDead: true });
    } else {
      this.setState({ isChargerDead: false });
    }
  };

  public showHeartbeatStatus = () => {
    const { charger } = this.props;
    const { isChargerDead } = this.state;
    let message = I18n.t("chargers.heartBeatOkMessage", { chargeBoxID: charger.id });
    if (isChargerDead) {
      message = I18n.t("chargers.heartBeatKoMessage", {
        chargeBoxID: charger.id,
        lastHeartBeat: moment(new Date(charger.lastHeartBeat),null, true).fromNow(true)
      });
    }
    Alert.alert(I18n.t("chargers.heartBeat"), message, [{ text: I18n.t("general.ok") }]);
  };

  public render() {
    const style = computeStyleSheet();
    const { charger, navigation } = this.props;
    const { isChargerDead } = this.state;
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <Text style={style.headerName}>{charger.id}</Text>
          {isChargerDead ? (
            <Button
              transparent={true}
              style={style.heartbeatButton}
              onPress={() => {
                this.showHeartbeatStatus();
              }}>
              <Animatable.Text animation="fadeIn" easing="ease-in-out" iterationCount="infinite" direction="alternate-reverse">
                <Icon style={style.deadHeartbeatIcon} type="FontAwesome" name="heartbeat" />
              </Animatable.Text>
            </Button>
          ) : (
            <Button
              transparent={true}
              style={style.heartbeatButton}
              onPress={() => {
                this.showHeartbeatStatus();
              }}>
              <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: "center" }}>
                <Icon style={style.heartbeatIcon} type="FontAwesome" name="heartbeat" />
              </Animatable.Text>
            </Button>
          )}
        </View>
        <View style={style.connectorsContainer}>
          {charger.connectors.map((connector, index) => (
            <ConnectorComponent
              key={`${charger.id}~${connector.connectorId}`}
              charger={charger}
              connector={connector}
              siteAreaID={siteAreaID}
              index={index}
              navigation={navigation}
            />
          ))}
        </View>
      </View>
    );
  }
}
