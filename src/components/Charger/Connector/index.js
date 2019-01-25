import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import Utils from "../../../utils/Utils";
import ConnectorStatusComponent from "../../ConnectorStatus";
import * as Animatable from "react-native-animatable";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";
import PropTypes from "prop-types";
import Constants from "../../../utils/Constants";
import { scale } from "react-native-size-matters";

export default class ConnectorComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      showBatteryLevel: false
    };
    // No animation
    this.animationDuration = 0;
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
    // Init animation
    this.animationDuration = 1000;
    // Switch battery/Consumptio
    this.setState({
      showBatteryLevel: !this.state.showBatteryLevel
    })
  }

  _renderConnectorDetails = (connector, style) => {
    return (
      <View style={style.statusConnectorDetailsContainer}>
        {(connector.activeTransactionID !== 0) ?
          <View style={style.statusConnectorDetails}>
            <View style={style.statusConnectorDetail}>
              <Animatable.View animation={!this.state.showBatteryLevel ? "fadeIn" : "fadeOut"}
                  style={style.animatableValue}
                  duration={this.animationDuration}>
                <Text style={style.value}>100</Text>
                <Text style={style.label} numberOfLines={1}>{I18n.t("details.instant")}</Text>
                <Text style={style.subLabel} numberOfLines={1}>(kW)</Text>
              </Animatable.View>
              <Animatable.View animation={this.state.showBatteryLevel ? "fadeIn" : "fadeOut"}
                  style={style.animatableValue}
                  duration={this.animationDuration}>
                <Text style={style.value}>{connector.currentStateOfCharge}</Text>
                <Text style={style.label} numberOfLines={1}>{I18n.t("details.battery")}</Text>
                <Text style={style.subLabel} numberOfLines={1}>(%)</Text>
              </Animatable.View>
            </View>
            <View style={style.statusConnectorDetail}>
              <Text style={style.value}>100</Text>
              <Text style={style.label} numberOfLines={1}>{I18n.t("details.total")}</Text>
              <Text style={style.subLabel} numberOfLines={1}>(kW.h)</Text>
            </View>
          </View>
        :
          <View style={[style.statusConnectorDetails, style.statusConnectorDetailsStandalone]}>
            <View style={style.statusConnectorDetail}>
              <Image style={style.sizeConnectorImage} source={Utils.getConnectorTypeImage(connector.type)}/>
              <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
              <Text style={style.subLabel} numberOfLines={1}/>
            </View>
            <View style={style.statusConnectorDetail}>
              <Text style={style.value}>{Math.trunc(connector.power / 1000)}</Text>
              <Text style={style.label} numberOfLines={1}>{I18n.t("details.maximum")}</Text>
              <Text style={style.subLabel} numberOfLines={1}>(kW)</Text>
            </View>
          </View>
        }
      </View>
    );
  }

  render() {
    const style = computeStyleSheet();
    const { index, connector, navigation, charger } = this.props;
    const even = (index % 2 === 0);
    return (
      charger.connectors.length > 1
      ?
        <TouchableOpacity style={style.statusLeftRightConnectorContainer}
            onPress={()=> navigation.navigate("ChargerTabNavigator", { chargerID: charger.id, connectorID: connector.connectorId })}>
          <Animatable.View animation={even ? "slideInLeft" : "slideInRight"} iterationCount={1} >
            <View style={even ? [style.connectorContainer, style.leftConnectorContainer] : [style.connectorContainer, style.rightConnectorContainer]}>
              <Text style={style.statusDescription} numberOfLines={1}>
                {Utils.translateConnectorStatus(connector.status)}
              </Text>
              {even ?
                <View style={[style.statusConnectorDetailContainer, style.leftStatusConnectorDetailsContainer]}>
                  <ConnectorStatusComponent style={[style.statusConnectorDetailLetter, style.leftStatusConnectorDetailLetter]} connector={connector}/>
                  {this._renderConnectorDetails(connector, style)}
                </View>
              :
                <View style={[style.statusConnectorDetailContainer, style.rightStatusConnectorDetailsContainer]}>
                  {this._renderConnectorDetails(connector, style)}
                  <ConnectorStatusComponent style={[style.statusConnectorDetailLetter, style.rightStatusConnectorDetailLetter]} connector={connector}/>
                </View>
              }
            </View>
          </Animatable.View>
        </TouchableOpacity>
      :
      <TouchableOpacity style={style.statusConnectorContainer} onPress={()=> navigation.navigate("ChargerTabNavigator", { chargerID: charger.id, connectorID: connector.connectorId })}>
        <Animatable.View animation={"fadeInUp"} iterationCount={1} >
          <View style={style.connectorContainer}>
            <Text style={style.statusDescription} numberOfLines={1}>
              {Utils.translateConnectorStatus(connector.status)}
            </Text>
            <View style={style.statusConnectorDetailContainer}>
              <ConnectorStatusComponent style={style.statusConnectorDetailLetter} connector={connector}/>
              {this._renderConnectorDetails(connector, style)}
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
  index: PropTypes.number.isRequired
};

ConnectorComponent.defaultProps = {
};
