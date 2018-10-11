import React, { Component } from "react";
import { FlatList, SectionList, Dimensions, Image } from "react-native";
import { Text, View, ListItem, Badge, Icon } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
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
        <View style={styles.connectorContainer}>
          <View style={styles.connectorStatus}>
            {item.status === "Available" && item.currentConsumption === 0 ?
              <Animatable.View>
                <Badge style={{justifyContent: "center"}} success>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption === 0 ?
              <Animatable.View>
                <Badge style={{justifyContent: "center"}} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption !== 0 ?
              <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                <Badge style={{justifyContent: "center"}} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            :
              <Animatable.View>
                <Badge style={{justifyContent: "center"}} danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            }
          </View>
          <View style={styles.status}>
            { item.currentConsumption !== 0  && item.status === "Occupied" ?
              <View style={{width: deviceWidth / 4.4}}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", fontSize: 27, textAlign: "center"}}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption / 1000).toFixed(1) : Math.trunc(item.currentConsumption / 1000)}</Text>
                    <Text style={{fontWeight: "normal", fontSize: 10}}>kW(Instant)</Text>
                  </View>
                  <View style={{flexDirection: "column"}}>
                    <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 27}}>{Math.trunc(item.power / 1000)}</Text>
                    <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text>
                  </View>
                </View>
              </View>
            : item.currentConsumption === 0 ?
              <View style={{width: deviceWidth / 4.8}}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "column"}}>
                    <Image source={item.type === "T2" ? type2 : item.type === "CCS" ? combo : item.type === "C" ? chademo : noConnector} style={{width: 35, height: 35}} />
                    <Text style={{fontSize: 10, textAlign: "center"}}>{item.type === "T2" ? "Type 2" : item.type === "CCS" ? "CCS" : item.type === "C" ? "Type C" : "Unknown"}</Text>
                  </View>
                  <View style={{flexDirection: "column"}}>
                    <Text style={{fontWeight: "bold", fontSize: 27, textAlign: "center"}}>{Math.trunc(item.power / 1000)}</Text>
                    <Text style={{fontSize: 10, textAlign: "center"}}>kWMax</Text>
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
      );
    }
    return (
      <View style={styles.connectorContainer}>
        <View style={styles.status}>
          { item.currentConsumption !== 0  && item.status === "Occupied" ?
            <View style={{width: deviceWidth / 4.4}}>
              <Text style={styles.statusText}>{item.status}</Text>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "column"}}>
                  <Text style={{fontWeight: "bold", fontSize: 27, textAlign: "center"}}>{Math.trunc(item.currentConsumption / 1000) === 0 ? (item.currentConsumption / 1000).toFixed(1) : Math.trunc(item.currentConsumption / 1000)}</Text>
                  <Text style={{fontWeight: "normal", fontSize: 10}}>kW(Instant)</Text>
                </View>
                <View style={{flexDirection: "column"}}>
                  <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 27}}>{Math.trunc(item.power / 1000)}</Text>
                  <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text>
                </View>
              </View>
            </View>
          : item.currentConsumption === 0 ?
            <View style={{width: deviceWidth / 4.8}}>
              <Text style={styles.statusText}>{item.status}</Text>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "column"}}>
                  <Image source={item.type === "T2" ? type2 : item.type === "CCS" ? combo : item.type === "C" ? chademo : noConnector} style={{width: 35, height: 35}} />
                  <Text style={{fontSize: 10, textAlign: "center"}}>{item.type === "T2" ? "Type 2" : item.type === "CCS" ? "CCS" : item.type === "C" ? "Type C" : "Unknown"}</Text>
                </View>
                <View style={{flexDirection: "column"}}>
                  <Text style={{fontWeight: "bold", fontSize: 27, textAlign: "center"}}>{Math.trunc(item.power / 1000)}</Text>
                  <Text style={{fontSize: 10, textAlign: "center"}}>kWMax</Text>
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
              <Badge style={{justifyContent: "center"}} success>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          : item.status === "Occupied" && item.currentConsumption === 0 ?
            <Animatable.View>
              <Badge style={{justifyContent: "center"}} danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          : item.status === "Occupied" && item.currentConsumption !== 0 ?
            <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
              <Badge style={{justifyContent: "center"}} danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          :
            <Animatable.View>
              <Badge style={{justifyContent: "center"}} danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          }
        </View>
      </View>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={{backgroundColor: "transparent", paddingBottom: 7, borderBottomColor: "#FFFFFF", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between"}} itemDivider>
          <View style={{flexDirection: "row"}}>
            <Text style={{fontSize: 18, fontWeight: "bold"}}>{items.id} - {items.siteArea.name}</Text>
          </View>
          <Icon style={{color: "#32CD32", fontSize: 20}} type="FontAwesome" name="heartbeat" />
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
