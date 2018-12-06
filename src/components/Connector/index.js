import React, { Component } from "react";
import { Image, TouchableOpacity, Text as TextRN } from "react-native";
import { Text, View, Badge } from "native-base";
import Utils from "../../utils/Utils";

import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import styles from "./styles";

class ConnectorComponent extends Component {
  renderStatus = (item) => {
    return (
      <View style={styles.status}>
        <View style={styles.statusDetailsContainer}>
          {(item.activeTransactionID !== 0) ?
            <View style={styles.rowSpaceBetween}>
              <View style={styles.column}>
                <Text style={styles.value}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption > 0 ? (item.currentConsumption / 1000).toFixed(1) : 0) : Math.trunc(item.currentConsumption / 1000)}</Text>
                <Text style={styles.label} numberOfLines={1}>{I18n.t("details.instant")}</Text>
                <Text style={styles.subLabel} numberOfLines={1}>(kW)</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.value}>{Math.round(item.totalConsumption / 1000)}</Text>
                <Text style={styles.label} numberOfLines={1}>{I18n.t("details.total")}</Text>
                <Text style={styles.subLabel} numberOfLines={1}>(kW.h)</Text>
              </View>
            </View>
          :
            <View style={styles.rowSpaceBetween}>
              <View style={styles.column}>
                <Image style={styles.sizeConnectorImage} source={Utils.getConnectorTypeImage(item.type)}/>
                <Text style={styles.label}>{Utils.translateConnectorType(item.type)}</Text>
                <Text style={styles.subLabel} numberOfLines={1}></Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.value}>{Math.trunc(item.power / 1000)}</Text>
                <Text style={styles.label} numberOfLines={1}>{I18n.t("details.maximum")}</Text>
                <Text style={styles.subLabel} numberOfLines={1}>(kW)</Text>
              </View>
            </View>
          }
        </View>
      </View>
    );
  }

  renderConnectorStatus = (item) => {
    const connectorAlpha = String.fromCharCode(64 + item.connectorId);
    return (
      <View style={styles.connectorStatus}>
        { item.status === "Available" && item.currentConsumption === 0 ?
          <Animatable.View>
            <Badge style={styles.badge} success>
              <TextRN style={styles.badgeText}>{connectorAlpha}</TextRN>
            </Badge>
          </Animatable.View>
        : (item.status === "Occupied" || item.status === "SuspendedEV") && item.currentConsumption === 0 ?
          <Animatable.View>
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{connectorAlpha}</TextRN>
            </Badge>
          </Animatable.View>
        : item.currentConsumption !== 0 ?
          <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{connectorAlpha}</TextRN>
            </Badge>
          </Animatable.View>
        : item.status === "Finishing" || item.status === "Preparing" ?
          <Animatable.View>
            <Badge style={styles.badge} warning>
              <TextRN style={styles.badgeText}>{connectorAlpha}</TextRN>
            </Badge>
          </Animatable.View>
        :
          <Animatable.View>
            <Badge style={styles.badge} danger>
              <TextRN style={styles.badgeText}>{connectorAlpha}</TextRN>
            </Badge>
          </Animatable.View>
        }
      </View>
    );
  }

  render() {
    const { index, item, nav, charger, sitePicture } = this.props;
    const even = (index % 2 === 0);
    return (
      <TouchableOpacity onPress={()=>nav.navigate("Details", {charger, index, siteImage: sitePicture, connector: item})}>
        <Animatable.View animation={even ? "slideInLeft" : "slideInRight"} iterationCount={1}>
          <View style={even ? styles.leftConnectorContainer : styles.rightConnectorContainer}>
            <Text style={styles.statusText} numberOfLines={1}>
              {Utils.translateConnectorStatus(item.status)}
            </Text>
            {even ?
              <View style={styles.leftStatusConnectorContainer}>
                {this.renderConnectorStatus(item)}
                {this.renderStatus(item)}
              </View>
            :
              <View style={styles.rightStatusConnectorContainer}>
                {this.renderStatus(item)}
                {this.renderConnectorStatus(item)}
              </View>
            }
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default ConnectorComponent;
