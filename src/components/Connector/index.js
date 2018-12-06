import React, { Component } from "react";
import { Image, TouchableOpacity, Text as TextRN } from "react-native";
import { Text, View, Badge } from "native-base";
import Constants from "../../utils/Constants";

import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import styles from "./styles";

const type2 = require("../../../assets/connectorType/type2.gif");
const combo = require("../../../assets/connectorType/combo_ccs.gif");
const chademo = require("../../../assets/connectorType/chademo.gif");
const noConnector = require("../../../assets/connectorType/no-connector.gif");

class ConnectorComponent extends Component {
  _translateStatus = (status) => {
    switch (status) {
      case Constants.CONN_STATUS_AVAILABLE:
        return I18n.t("connector.available");
      case Constants.CONN_STATUS_CHARGING:
        return I18n.t("connector.charging");
      case Constants.CONN_STATUS_FAULTED:
        return I18n.t("connector.faulted");
      case Constants.CONN_STATUS_RESERVED:
        return I18n.t("connector.reserved");
      case Constants.CONN_STATUS_FINISHING:
        return I18n.t("connector.finishing");
      case Constants.CONN_STATUS_PREPARING:
        return I18n.t("connector.preparing");
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
        return I18n.t("connector.suspendedEVSE");
      case Constants.CONN_STATUS_SUSPENDED_EV:
        return I18n.t("connector.suspendedEV");
      case Constants.CONN_STATUS_UNAVAILABLE:
        return I18n.t("connector.unavailable");
      default:
      return I18n.t("connector.unknown");
    }
  }

  renderStatus  = () => {
    const { item } = this.props;
    return (
      <View style={styles.status}>
        <View style={styles.statusDetailsContainer}>
          <Text style={styles.statusText} numberOfLines={1}>
            {this._translateStatus(item.status)}
          </Text>
          {item.currentConsumption > 0 ?
            <View style={styles.rowSpaceBetween}>
              <View style={styles.column}>
                  <Text style={styles.energy}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption / 1000).toFixed(1) : Math.trunc(item.currentConsumption / 1000)}</Text>
                  <Text style={styles.currentConsumptionUnity} numberOfLines={1}>kW(Instant)</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.energy}>{Math.round(item.totalConsumption / 1000)}</Text>
                <Text style={styles.maxEnergy} numberOfLines={1}>Total kW</Text>
              </View>
            </View>
          :
            <View style={styles.rowSpaceBetween}>
              <View style={styles.column}>
                <Image style={styles.sizeConnectorImage} source={item.type === "T2" ? type2 : item.type === "CCS" ? combo : item.type === "C" ? chademo : noConnector} />
                <Text style={styles.connectorType}>{item.type === "T2" ? "Type 2" : item.type === "CCS" ? "CCS" : item.type === "C" ? "Type C" : "Unknown"}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.power}>{Math.trunc(item.power / 1000)}</Text>
                <Text style={styles.maxEnergy} numberOfLines={1}>kWMax</Text>
              </View>
            </View>
          }
        </View>
      </View>
    );
  }

  renderConnectorStatus = () => {
    const { item, alpha } = this.props;
    return (
      <View style={styles.connectorStatus}>
        { item.status === "Available" && item.currentConsumption === 0 ?
          <Animatable.View>
            <Badge style={styles.badge} success>
              <TextRN style={styles.badgeText}>{alpha}</TextRN>
            </Badge>
          </Animatable.View>
        : (item.status === "Occupied" || item.status === "SuspendedEV") && item.currentConsumption === 0 ?
          <Animatable.View>
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{alpha}</TextRN>
            </Badge>
          </Animatable.View>
        : item.currentConsumption !== 0 ?
          <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{alpha}</TextRN>
            </Badge>
          </Animatable.View>
        : item.status === "Finishing" || item.status === "Preparing" ?
          <Animatable.View>
            <Badge style={styles.badge} warning>
              <TextRN style={styles.badgeText}>{alpha}</TextRN>
            </Badge>
          </Animatable.View>
        :
          <Animatable.View>
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{alpha}</TextRN>
            </Badge>
          </Animatable.View>
        }
      </View>
    );
  }

  render() {
    const { index, item, alpha, nav, charger, sitePicture } = this.props;
    if (index % 2 === 0) {
      return (
        <TouchableOpacity onPress={()=>nav.navigate("Details", {charger, alpha, siteImage: sitePicture, connector: item})}>
          <Animatable.View animation="slideInLeft" iterationCount={1}>
            <View style={styles.rightConnectorContainer}>
              {this.renderConnectorStatus()}
              {this.renderStatus()}
            </View>
          </Animatable.View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={()=>nav.navigate("Details", {charger, alpha, siteImage: sitePicture, connector: item})}>
        <Animatable.View animation="slideInRight" iterationCount={1}>
          <View style={styles.leftConnectorContainer}>
            {this.renderStatus()}
            {this.renderConnectorStatus()}
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default ConnectorComponent;
