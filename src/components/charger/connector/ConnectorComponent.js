import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View, Icon } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import Utils from "../../../utils/Utils";
import * as Animatable from "react-native-animatable";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ConnectorComponentStyles";
import PropTypes from "prop-types";
import Constants from "../../../utils/Constants";
import ConnectorStatusComponent from "../../connector-status/ConnectorStatusComponent";
import SvgUri from "react-native-svg-uri";
import { scale } from "react-native-size-matters";

export default class ConnectorComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      showBatteryLevel: false
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Refresh every minutes
    this.timerAnimation = setInterval(() => {
      // Animate
      this._animate();
    }, Constants.ANIMATION_PERIOD_MILLIS);
  }

  componentWillUnmount() {
    // Stop the timer
    if (this.timerAnimation) {
      clearInterval(this.timerAnimation);
    }
  }

  _animate() {
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

  _renderFirstConnectorDetails = (connector) => (
    <ConnectorStatusComponent connector={connector} text={Utils.translateConnectorStatus(connector.status)} />
  );

  _renderSecondConnectorDetails = (connector, style) =>
    connector.activeTransactionID !== 0 ? (
      <View style={style.connectorDetail}>
        <Animatable.View
          animation={!this.state.showBatteryLevel ? "fadeIn" : "fadeOut"}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>
            {connector.currentConsumption / 1000 < 10
              ? connector.currentConsumption > 0
                ? (connector.currentConsumption / 1000).toFixed(1)
                : 0
              : Math.trunc(connector.currentConsumption / 1000)}
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
        <Image style={style.connectorImage} source={Utils.getConnectorTypeImage(connector.type)} />
        <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
      </View>
    );

  _renderThirdConnectorDetails = (connector, style) =>
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

  render() {
    const style = computeStyleSheet();
    const { connector, navigation, charger, index, siteAreaID } = this.props;
    return (
      <TouchableOpacity
        style={style.container}
        onPress={() =>
          navigation.navigate("ChargerTabDetails", {
            chargerID: charger.id,
            connectorID: connector.connectorId,
            siteAreaID
          })
        }>
        <Animatable.View animation={"flipInX"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
          <View style={style.connectorContainer}>
            <View style={style.connectorDetailContainer}>
              {this._renderFirstConnectorDetails(connector)}
              {this._renderSecondConnectorDetails(connector, style)}
              {this._renderThirdConnectorDetails(connector, style)}
              <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

ConnectorComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  charger: PropTypes.object.isRequired,
  connector: PropTypes.object.isRequired,
  siteAreaID: PropTypes.string,
  index: PropTypes.number
};

ConnectorComponent.defaultProps = {};
