import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import styles from "./styles";

const type2 = require("../../../assets/connectorType/type2.gif");
const combo = require("../../../assets/connectorType/combo_ccs.gif");
const chademo = require("../../../assets/connectorType/chademo.gif");
const noConnector = require("../../../assets/connectorType/no-connector.gif");

class ConnectorComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      item: this.props.item,
      alpha: this.props.alpha,
      navigation: this.props.nav,
      charger: this.props.charger,
      siteImage: this.props.sitePicture
    };
  }

  render() {
    const { index, item, alpha, navigation, charger, siteImage } = this.state;
    if (index % 2 === 0) {
      return (
        <TouchableOpacity onPress={()=>navigation.navigate("Details", {charger, alpha, siteImage, connector: item})}>
          <Animatable.View animation="slideInLeft" iterationCount={1}>
            <View style={styles.connectorContainer}>
              <View style={styles.connectorStatus}>
                { item.status === "Available" && item.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={styles.badge} success>
                      <Text style={styles.badgeText}>{alpha}</Text>
                    </Badge>
                  </Animatable.View>
                : (item.status === "Occupied" || item.status === "SuspendedEV") && item.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={styles.badge} danger>
                      <Text style={styles.badgeText}>{alpha}</Text>
                    </Badge>
                  </Animatable.View>
                : item.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                    <Badge style={styles.badge} danger>
                      <Text style={styles.badgeText}>{alpha}</Text>
                    </Badge>
                  </Animatable.View>
                :
                  <Animatable.View>
                    <Badge style={styles.badge} danger>
                      <Text style={styles.badgeText}>{alpha}</Text>
                    </Badge>
                  </Animatable.View>
                }
              </View>
              <View style={styles.status}>
              { item.currentConsumption !== 0 ?
                <View style={styles.statusDetailsContainer}>
                  <Text style={styles.statusText} numberOfLines={1}>
                    {item.status === "Faulted" ?
                      I18n.t("connector.faulted")
                    : item.status === "Occupied" ?
                      I18n.t("connector.occupied")
                    : item.status === "SuspendedEV" ?
                      I18n.t("connector.suspendedEV")
                    : item.status === "Charging" ?
                      I18n.t("connector.charging")
                    :
                      item.status
                    }
                    </Text>
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
                </View>
              :
                <View style={styles.statusDetailsContainerNoConsumption}>
                  <Text style={styles.statusText} numberOfLines={1}>
                    {item.status === "Faulted" ?
                      I18n.t("connector.faulted")
                    : item.status === "Available" ?
                      I18n.t("connector.available")
                    : item.status === "Occupied" ?
                      I18n.t("connector.occupied")
                    : item.status === "SuspendedEV" ?
                      I18n.t("connector.suspendedEV")
                    :
                      item.status
                    }
                  </Text>
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
                </View>
              }
              </View>
            </View>
          </Animatable.View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={()=>navigation.navigate("Details", {charger, alpha, siteImage, connector: item})}>
        <Animatable.View animation="slideInRight" iterationCount={1}>
          <View style={styles.connectorContainer}>
            <View style={styles.status}>
            { item.currentConsumption !== 0 ?
              <View style={styles.statusDetailsContainer}>
                <Text style={styles.statusText} numberOfLines={1}>
                  {item.status === "Faulted" ?
                    I18n.t("connector.faulted")
                  : item.status === "Occupied" ?
                    I18n.t("connector.occupied")
                  : item.status === "SuspendedEV" ?
                    I18n.t("connector.suspendedEV")
                  : item.status === "Charging" ?
                    I18n.t("connector.charging")
                  :
                    item.status
                  }
                  </Text>
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
                </View>
              :
                <View style={styles.statusDetailsContainerNoConsumption}>
                  <Text style={styles.statusText} numberOfLines={1}>
                    {item.status === "Faulted" ?
                      I18n.t("connector.faulted")
                    : item.status === "Available" ?
                      I18n.t("connector.available")
                    : item.status === "Occupied" ?
                      I18n.t("connector.occupied")
                    : item.status === "SuspendedEV" ?
                      I18n.t("connector.suspendedEV")
                    :
                      item.status
                    }
                  </Text>
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
                </View>
                }
              </View>
            <View style={styles.connectorStatus}>
              { item.status === "Available" && item.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badge} success>
                    <Text style={styles.badgeText}>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              : (item.status === "Occupied" || item.status === "SuspendedEV") && item.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badge} danger>
                    <Text style={styles.badgeText}>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              : item.currentConsumption !== 0 ?
                <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                  <Badge style={styles.badge} danger>
                    <Text style={styles.badgeText}>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              :
                <Animatable.View>
                  <Badge style={styles.badge} danger>
                    <Text style={styles.badgeText}>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              }
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default ConnectorComponent;
