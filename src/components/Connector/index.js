import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View } from "native-base";
import Utils from "../../utils/Utils";
import ConnectorStatusComponent from "../ConnectorStatus";

import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import styles from "./styles";

class ConnectorComponent extends Component {
  _renderConnectorDetails = (item) => {
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

  render() {
    const { index, item, nav, charger, siteID } = this.props;
    const even = (index % 2 === 0);
    return (
      <TouchableOpacity onPress={()=>nav.navigate("Details", {charger, index, siteID: siteID, connector: item})}>
        <Animatable.View animation={even ? "slideInLeft" : "slideInRight"} iterationCount={1}>
          <View style={even ? styles.leftConnectorContainer : styles.rightConnectorContainer}>
            <Text style={styles.statusDescription} numberOfLines={1}>
              {Utils.translateConnectorStatus(item.status)}
            </Text>
            {even ?
              <View style={styles.leftStatusConnectorContainer}>
                <View style={styles.statusConnectorLetter}>
                  <ConnectorStatusComponent item={item}/>
                </View>
                {this._renderConnectorDetails(item)}
              </View>
            :
              <View style={styles.rightStatusConnectorContainer}>
                {this._renderConnectorDetails(item)}
                <View style={styles.statusConnectorLetter}>
                  <ConnectorStatusComponent item={item}/>
                </View>
              </View>
            }
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default ConnectorComponent;
