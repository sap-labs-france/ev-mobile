import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Text, View } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import Utils from "../../utils/Utils";
import ConnectorStatusComponent from "../ConnectorStatus";
import * as Animatable from "react-native-animatable";
import I18n from "../../I18n/I18n";
import computeStyleSheet from "./styles";

class ConnectorComponent extends ResponsiveComponent {
  _renderConnectorDetails = (connector, style) => {
    return (
      <View style={style.statusConnectorDetailsContainer}>
        {(connector.activeTransactionID !== 0) ?
          <View style={style.statusConnectorDetails}>
            <View style={style.statusConnectorDetail}>
              <Text style={style.value}>{(connector.currentConsumption / 1000) < 10 ? (connector.currentConsumption > 0 ? (connector.currentConsumption / 1000).toFixed(1) : 0) : Math.trunc(connector.currentConsumption / 1000)}</Text>
              <Text style={style.label} numberOfLines={1}>{I18n.t("details.instant")}</Text>
              <Text style={style.subLabel} numberOfLines={1}>(kW)</Text>
            </View>
            <View style={style.statusConnectorDetail}>
              <Text style={style.value}>{Math.round(connector.totalConsumption / 1000)}</Text>
              <Text style={style.label} numberOfLines={1}>{I18n.t("details.total")}</Text>
              <Text style={style.subLabel} numberOfLines={1}>(kW.h)</Text>
            </View>
          </View>
        :
          <View style={style.statusConnectorDetails}>
            <View style={style.statusConnectorDetail}>
              <Image style={style.sizeConnectorImage} source={Utils.getConnectorTypeImage(connector.type)}/>
              <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
              <Text style={style.subLabel} numberOfLines={1}></Text>
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
    const { index, connector, navigation, charger, siteID, siteImage } = this.props;
    const even = (index % 2 === 0);
    return (
      <TouchableOpacity style={style.statusConnectorContainer} onPress={()=> navigation.navigate("ChargerTab", { charger, index, siteID, siteImage, connector })}>
        <Animatable.View animation={even ? "slideInLeft" : "slideInRight"} iterationCount={1} >
          <View style={even ? style.leftConnectorContainer : style.rightConnectorContainer}>
            <Text style={style.statusDescription} numberOfLines={1}>
              {Utils.translateConnectorStatus(connector.status)}
            </Text>
            {even ?
              <View style={style.statusConnectorDetailContainer}>
                <ConnectorStatusComponent style={style.statusConnectorDetailLetter} connector={connector}/>
                {this._renderConnectorDetails(connector, style)}
              </View>
            :
              <View style={style.statusConnectorDetailContainer}>
                {this._renderConnectorDetails(connector, style)}
                <ConnectorStatusComponent style={style.statusConnectorDetailLetter} connector={connector}/>
              </View>
            }
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default ConnectorComponent;
