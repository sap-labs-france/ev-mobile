import React, { Component } from "react";
import { FlatList, SectionList, Dimensions, Image } from "react-native";
import { Text, View, ListItem, Badge, Icon } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;

const type2 = require("../../../assets/connectorType/type2.gif");
const combo = require("../../../assets/connectorType/combo_ccs.gif");
const chademo = require("../../../assets/connectorType/chademo.gif");
const noConnector = require("../../../assets/connectorType/no-connector.gif");

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
            <Text style={styles.connectorTextInfoType}>Type ?</Text>
          </View>
          <View style={styles.status}>
            { item.currentConsumption !== 0  && item.status === "Occupied" ?
              <View style={{justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={{flexDirection: "row"}}>
                  <View style={{flexDirection: "row", width: 60}}>
                    <Text style={{fontWeight: "bold", fontSize: 17, textAlign: "center"}}>{(item.currentConsumption / 1000).toFixed(2)} <Text style={{fontWeight: "normal", fontSize: 10}}>kW(Instant)</Text></Text>
                  </View>
                  <View style={{flexDirection: "row", width: 36}}>
                    <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 17}}>{Math.trunc(item.power / 1000)} <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text></Text>
                  </View>
                </View>
              </View>
            : item.currentConsumption === 0 && item.status === "Occupied" ?
              <Text style={styles.statusText}>{item.status}</Text>
            : item.currentConsumption === 0 && item.status === "Available" ?
              <View style={{justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.statusText}>{item.status}</Text>
                <View style={{flexDirection: "row"}}>
                  <View style={{flexDirection: "row", width: 36}}>
                    <Image source={type2} style={{width: 35, height: 35}} />
                  </View>
                  <View style={{flexDirection: "row", width: 36}}>
                    <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 17}}>{Math.trunc(item.power / 1000)} <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text></Text>
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
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Text style={styles.statusText}>{item.status}</Text>
              <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "row", width: 60}}>
                  <Text style={{fontWeight: "bold", fontSize: 17, textAlign: "center"}}>{(item.currentConsumption / 1000).toFixed(2)} <Text style={{fontWeight: "normal", fontSize: 10}}>kW(Instant)</Text></Text>
                </View>
                <View style={{flexDirection: "row", width: 36}}>
                  <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 17}}>{Math.trunc(item.power / 1000)} <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text></Text>
                </View>
              </View>
            </View>
          : item.currentConsumption === 0 && item.status === "Occupied" ?
            <Text style={styles.statusText}>{item.status}</Text>
          : item.currentConsumption === 0 && item.status === "Available" ?
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Text style={styles.statusText}>{item.status}</Text>
              <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "row", width: 36}}>
                  <Image source={type2} style={{width: 35, height: 35}} />
                </View>
                <View style={{flexDirection: "row", width: 36}}>
                  <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 17}}>{Math.trunc(item.power / 1000)} <Text style={{fontWeight: "normal", fontSize: 10}}>kWMax</Text></Text>
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
          <Text style={styles.connectorTextInfoType}>Type ?</Text>
        </View>
      </View>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={{backgroundColor: "transparent", paddingBottom: 7, borderBottomColor: "#FFFFFF", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between"}} itemDivider>
          <View style={{backgroundColor: "#008080", flexDirection: "row"}}>
            <Text>{items.id}{/*items.siteArea.name*/} - Site Area</Text>
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
