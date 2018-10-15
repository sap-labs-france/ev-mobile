import React, { Component } from "react";
import { FlatList, Dimensions, Image } from "react-native";
import { Text, View, ListItem, Badge, Icon } from "native-base";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

const type2 = require("../../../assets/connectorType/type2.gif");
const combo = require("../../../assets/connectorType/combo_ccs.gif");
const chademo = require("../../../assets/connectorType/chademo.gif");
const noConnector = require("../../../assets/connectorType/no-connector.gif");

const deviceWidth = Dimensions.get("window").width;

class ChargerComponent extends Component {

  _renderItem = ({item, index}) => {
    let alpha = String.fromCharCode(65 + index);
    if (index % 2 === 0) {
      return (
        <Animatable.View animation="slideInLeft" iterationCount={1}>
          <View style={styles.connectorContainer}>
            <View style={styles.connectorStatus}>
              {item.status === "Available" && item.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badge} success>
                    <Text>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              : item.status === "Occupied" && item.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badge} danger>
                    <Text>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              : item.status === "Occupied" && item.currentConsumption !== 0 ?
                <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                  <Badge style={styles.badge} danger>
                    <Text>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              :
                <Animatable.View>
                  <Badge style={styles.badge} danger>
                    <Text>{alpha}</Text>
                  </Badge>
                </Animatable.View>
              }
            </View>
            <View style={styles.status}>
              { item.currentConsumption !== 0  && item.status === "Occupied" ?
                <View style={styles.statusDetailsContainer}>
                  <Text style={styles.statusText}>{item.status}</Text>
                  <View style={styles.rowSpaceBetween}>
                    <View style={styles.column}>
                      <Text style={styles.energy}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption / 1000).toFixed(1) : Math.trunc(item.currentConsumption / 1000)}</Text>
                      <Text style={styles.currentConsumptionUnity}>kW(Instant)</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.energy}>{Math.trunc(item.power / 1000)}</Text>
                      <Text style={styles.maxEnergy}>kWMax</Text>
                    </View>
                  </View>
                </View>
              : item.currentConsumption === 0 ?
                <View style={styles.statusDetailsContainerNoConsumption}>
                  <Text style={styles.statusText}>{item.status}</Text>
                  <View style={styles.rowSpaceBetween}>
                    <View style={styles.column}>
                      <Image style={styles.sizeConnectorImage} source={item.type === "T2" ? type2 : item.type === "CCS" ? combo : item.type === "C" ? chademo : noConnector} />
                    </View>
                    <View style={styles.maxPowerContainer}>
                      <Text style={styles.power}>{Math.trunc(item.power / 1000)}</Text>
                    </View>
                  </View>
                  <View style={styles.rowSpaceBetween}>
                    <View style={styles.column}>
                      <Text style={styles.connectorType}>{item.type === "T2" ? "Type 2" : item.type === "CCS" ? "CCS" : item.type === "C" ? "Type C" : "Unknown"}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.maxEnergy}>kWMax</Text>
                    </View>
                  </View>
                </View>
              :
                <Text style={styles.statusText}>{item.status}</Text>
              }
              {item.errorCode !== "NoError" && (
                <Text style={styles.connectorErrorCodeText}>{item.errorCode}</Text>
              )}
            </View>
          </View>
        </Animatable.View>
      );
    }
    return (
      <Animatable.View animation="slideInRight" iterationCount={1}>
        <View style={styles.connectorContainer}>
          <View style={styles.status}>
            { item.currentConsumption !== 0  && item.status === "Occupied" ?
              <View style={styles.statusDetailsContainer}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={styles.rowSpaceBetween}>
                  <View style={styles.column}>
                    <Text style={styles.energy}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption / 1000).toFixed(1) : Math.trunc(item.currentConsumption / 1000)}</Text>
                    <Text style={styles.currentConsumptionUnity}>kW(Instant)</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.energy}>{Math.trunc(item.power / 1000)}</Text>
                    <Text style={styles.maxEnergy}>kWMax</Text>
                  </View>
                </View>
              </View>
            : item.currentConsumption === 0 ?
              <View style={styles.statusDetailsContainerNoConsumption}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={styles.rowSpaceBetween}>
                  <View style={styles.column}>
                    <Image style={styles.sizeConnectorImage} source={item.type === "T2" ? type2 : item.type === "CCS" ? combo : item.type === "C" ? chademo : noConnector} />
                  </View>
                  <View style={styles.maxPowerContainer}>
                    <Text style={styles.power}>{Math.trunc(item.power / 1000)}</Text>
                  </View>
                </View>
                <View style={styles.rowSpaceBetween}>
                  <View style={styles.column}>
                    <Text style={styles.connectorType}>{item.type === "T2" ? "Type 2" : item.type === "CCS" ? "CCS" : item.type === "C" ? "Type C" : "Unknown"}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.maxEnergy}>kWMax</Text>
                  </View>
                </View>
              </View>
            :
              <Text style={styles.statusText}>{item.status}</Text>
            }
            {item.errorCode !== "NoError" && (
              <Text style={styles.connectorErrorCodeText}>{item.errorCode}</Text>
            )}
          </View>
          <View style={styles.connectorStatus}>
            {item.status === "Available" && item.currentConsumption === 0 ?
              <Animatable.View>
                <Badge style={styles.badge} success>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption === 0 ?
              <Animatable.View>
                <Badge style={styles.badge} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption !== 0 ?
              <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                <Badge style={styles.badge} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            :
              <Animatable.View>
                <Badge style={styles.badge} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            }
          </View>
        </View>
      </Animatable.View>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={styles.listDividerContainer} itemDivider>
          <Text style={styles.chargerName}>{items.id} | <Text style={styles.siteAreaName}>{items.siteArea.name}</Text></Text>
          <Animatable.Text animation="pulse" easing="ease-in" iterationCount="infinite">
            <Icon style={styles.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          </Animatable.Text>
        </ListItem>
        <FlatList style={styles.listContainer}
          data={items.connectors}
          renderItem={this._renderItem}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
