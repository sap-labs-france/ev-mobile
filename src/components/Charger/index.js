import React, { Component } from "react";
import { FlatList, SectionList, Dimensions } from "react-native";
import { Text, View, ListItem, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

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
                <Badge success>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption === 0 ?
              <Animatable.View>
                <Badge danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            : item.status === "Occupied" && item.currentConsumption !== 0 ?
              <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                <Badge danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            :
              <Animatable.View>
                <Badge danger>
                  <Text>{alpha}</Text>
                </Badge>
              </Animatable.View>
            }
            <Text style={styles.connectorTextInfo}>Type ?</Text>
            <Text style={styles.connectorTextInfo}>{Math.trunc(item.power / 1000)} kWMax</Text>
          </View>
          <View style={styles.status}>
            { item.currentConsumption !== 0  && item.status === "Occupied" ?
              <Text style={styles.statusText}>{(item.currentConsumption / 1000).toFixed(2)} kWh</Text>
            : item.currentConsumption === 0 && item.status === "Occupied" ?
              <Text style={styles.statusText}>{item.status}</Text>
            : item.currentConsumption === 0 && item.status === "Available" ?
              <Text style={styles.statusText}>{item.status}</Text>
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
              <Text style={styles.statusText}>{(item.currentConsumption / 1000).toFixed(2)} kWh</Text>
            : item.currentConsumption === 0 && item.status === "Occupied" ?
              <Text style={styles.statusText}>{item.status}</Text>
            : item.currentConsumption === 0 && item.status === "Available" ?
              <Text style={styles.statusText}>{item.status}</Text>
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
              <Badge success>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          : item.status === "Occupied" && item.currentConsumption === 0 ?
            <Animatable.View>
              <Badge danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          : item.status === "Occupied" && item.currentConsumption !== 0 ?
            <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
              <Badge danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          :
            <Animatable.View>
              <Badge danger>
                <Text>{alpha}</Text>
              </Badge>
            </Animatable.View>
          }
          <Text style={styles.connectorTextInfo}>Type ?</Text>
          <Text style={styles.connectorTextInfo}>{Math.trunc(item.power / 1000)} kWMax</Text>
        </View>
      </View>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <ListItem style={{backgroundColor: "transparent", paddingBottom: 5, justifyContent: "space-between"}} itemDivider>
            <Text>{items.id}</Text>
            <Text>{/*items.siteArea.name*/}Site Area</Text>
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
