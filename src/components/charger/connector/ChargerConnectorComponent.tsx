import { Icon, Text, View } from "native-base";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import I18n from "../../../I18n/I18n";
import BaseProps from "../../../types/BaseProps";
import ChargingStation from "../../../types/ChargingStation";
import Connector from "../../../types/Connector";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import ConnectorStatusComponent from "../../connector-status/ConnectorStatusComponent";
import computeStyleSheet from "./ChargerConnectorComponentStyles";

// const type2 = require("../../../../assets/connectorType/type2.svg");

export interface Props extends BaseProps {
  charger: ChargingStation;
  connector: Connector;
}

interface State {
  showBatteryLevel?: boolean;
}

export default class ChargerConnectorComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private timerAnimation: number;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      showBatteryLevel: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Refresh every minutes
    this.timerAnimation = setInterval(() => {
      // Animate
      this.animate();
    }, Constants.ANIMATION_PERIOD_MILLIS);
  }

  public componentWillUnmount() {
    // Stop the timer
    if (this.timerAnimation) {
      clearInterval(this.timerAnimation);
    }
  }

  public animate() {
    const { connector } = this.props;
    if (connector && connector.currentStateOfCharge === 0) {
      // SoC not supported
      return;
    }
    // Switch battery/Consumption
    this.setState({
      showBatteryLevel: !this.state.showBatteryLevel
    });
  }

  public renderFirstConnectorDetails = (connector: Connector) => (
    <ConnectorStatusComponent navigation={this.props.navigation} connector={connector} text={Utils.translateConnectorStatus(connector.status)} />
  );

  public renderSecondConnectorDetails = (connector: Connector, style: any) =>
    connector.activeTransactionID !== 0 ? (
      <View style={style.connectorDetail}>
        <Animatable.View
          animation={!this.state.showBatteryLevel ? "fadeIn" : "fadeOut"}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>
            {connector.currentConsumption / 1000 < 10
              ? connector.currentConsumption > 0
                ? (I18n.toNumber(Math.round(connector.currentConsumption / 10) / 100, { strip_insignificant_zeros: true }))
                : 0
              : I18n.toNumber(Math.trunc(connector.currentConsumption / 1000), { strip_insignificant_zeros: true })}
          </Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t("details.instant")}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (kW)
          </Text>
        </Animatable.View>
        <Animatable.View
          animation={this.state.showBatteryLevel ? "fadeIn" : "fadeOut"}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>{connector.currentStateOfCharge}</Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t("details.battery")}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (%)
          </Text>
        </Animatable.View>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        {/* <SvgUri width="50" height="50" source={{uri:'http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg'}} /> */}
        {/* <SvgUri width="50" height="50" source={{uri:'https://slf.evse.cfapps.eu10.hana.ondemand.com/assets/img/connectors/type1-ccs.svg'}} /> */}
        {/* <SvgUri width="50" height="50" source={type2} /> */}
        <Image style={style.connectorImage} source={Utils.getConnectorTypeImage(connector.type)} />
        <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
      </View>
    );

  public renderThirdConnectorDetails = (connector: Connector, style: any) =>
    connector.activeTransactionID !== 0 ? (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{Math.round(connector.totalConsumption / 1000)}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t("details.total")}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW.h)
        </Text>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{Math.trunc(connector.power / 1000)}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t("details.maximum")}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW)
        </Text>
      </View>
    );

  public render() {
    const style = computeStyleSheet();
    const { connector, navigation, charger } = this.props;
    return (
      <TouchableOpacity
        style={style.container}
        disabled={charger.inactive}
        onPress={() =>
          navigation.navigate("ChargerDetailsTabs", {
            chargerID: charger.id,
            connectorID: connector.connectorId
          })
        }>
        <Animatable.View animation={"flipInX"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
          <View style={style.connectorContainer}>
            <View style={style.connectorDetailContainer}>
              {this.renderFirstConnectorDetails(connector)}
              {this.renderSecondConnectorDetails(connector, style)}
              {this.renderThirdConnectorDetails(connector, style)}
              {!charger.inactive && <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />}
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}
