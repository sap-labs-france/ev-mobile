import React, { Component } from "react";
import { FlatList } from "react-native";
import { Text, View, ListItem, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

class ChargerComponent extends Component {

  nextChar = (c) => {
    let i = (parseInt(c, 36) + 1 ) % 36;
    return (!i * 10 + i).toString(36);
  }

  _renderConnector({item}) {
    return (
      <Row style={{backgroundColor: "##BDB76B", marginLeft: 15, marginRight: 15}}>
        <Col style={{backgroundColor: "#FFA07A"}}>
          {item.connectorId % 2 !== 0 ?
            <Col>
              <Row style={{marginTop: 10, alignSelf: "flex-start", backgroundColor: "#6495ED"}}>
                {item.status === "Available" ?
                  <Badge success>
                    <Text>A</Text>
                  </Badge>
                : item.status === "Occupied" && item.currentConsumption === 0 ?
                  <Badge danger>
                    <Text>A</Text>
                  </Badge>
                : item.status === "Occupied" && item.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse" duration={1000}>
                    <Badge danger>
                      <Text>A</Text>
                    </Badge>
                  </Animatable.View>
                :
                  undefined
                }
                <Row style={{backgroundColor: "#A52A2A"}}>
                  <Col style={{backgroundColor: "#8A2BE2"}}>
                    <Text style={{marginTop: 3, fontWeight: "bold"}}>{item.status !== "Available" && item.currentConsumption !== 0 ? parseFloat((item.currentConsumption / 1000).toFixed(1)) + " kW/h"  : item.status}</Text>
                  </Col>
                </Row>
              </Row>
              <Row style={{alignSelf: "flex-start", backgroundColor: "#008B8B"}}>
                <Col>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-start"}}>Type ?</Text>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-start"}}>{Math.trunc(item.power / 1000)} kWMax</Text>
                </Col>
              </Row>
            </Col>
          :
            <Col>
              <Row style={{marginTop: 10, alignSelf: "flex-end", backgroundColor: "#98FB98"}}>
                <Row style={{backgroundColor: "#BC8F8F"}}>
                  <Col style={{backgroundColor: "	#EE82EE"}}>
                    <Text style={{marginTop: 3, fontWeight: "bold"}}>{item.status !== "Available" && item.currentConsumption !== 0 ? parseFloat((item.currentConsumption / 1000).toFixed(1)) + " kW/h"  : item.status}</Text>
                  </Col>
                </Row>
                {item.status === "Available" ?
                  <Badge success>
                    <Text>B</Text>
                  </Badge>
                : item.status === "Occupied" && item.currentConsumption === 0 ?
                  <Badge danger>
                    <Text>B</Text>
                  </Badge>
                : item.status === "Occupied" && item.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse" duration={1000}>
                    <Badge danger>
                      <Text>B</Text>
                    </Badge>
                  </Animatable.View>
                :
                  undefined
                }
              </Row>
              <Row style={{alignSelf: "flex-end", backgroundColor: "#008B8B"}}>
                <Col>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-end"}}>Type ?</Text>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-end"}}>{Math.trunc(item.power / 1000)} kWMax</Text>
                </Col>
              </Row>
            </Col>
          }
        </Col>
      </Row>
    );
  }

  _renderItem = ({item}) => {
    return (
      <ListItem>
        <Grid style={{backgroundColor: "pink"}}>
          <Row style={{backgroundColor: "#FF8C00"}}>
            <Text>{item.id} - <Text style={{fontStyle: "italic"}}>{item.chargePointVendor}</Text></Text>
          </Row>
          <FlatList data={item.connectors} renderItem={this._renderConnector} keyExtractor={connector => connector.connectorId.toString()} />
        </Grid>
      </ListItem>
    );
  }

  render() {
    let { items } = this.props;
    return (
      <View style={styles.container}>
        <FlatList data={items} renderItem={this._renderItem} keyExtractor={item => item.id}/>
      </View>
    );
  }
}

export default ChargerComponent;
