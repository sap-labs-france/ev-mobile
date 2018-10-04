import React, { Component } from "react";
import { FlatList } from "react-native";
import { Text, View, ListItem, Badge } from "native-base";

import * as Animatable from "react-native-animatable";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

class ChargerComponent extends Component {

  _renderItem({item}) {
    return (
      <ListItem>
        <Grid style={{backgroundColor: "pink"}}>
          <Row style={{backgroundColor: "#FF8C00"}}>
            <Text>{item.id} - <Text style={{fontStyle: "italic"}}>Brand</Text></Text>
          </Row>
          <Row style={{backgroundColor: "##BDB76B"}}>
            <Col style={{marginLeft: 15, backgroundColor: "#FFA07A"}}>
              <Row style={{marginTop: 10, alignSelf: "flex-start", backgroundColor: "#6495ED"}}>
                <Badge success>
                  <Text>A</Text>
                </Badge>
                <Row style={{backgroundColor: "#A52A2A"}}>
                  <Col style={{backgroundColor: "##8A2BE2"}}>
                    <Text style={{marginTop: 3}}>Available</Text>
                  </Col>
                </Row>
              </Row>
              <Row style={{alignSelf: "flex-start", backgroundColor: "#008B8B"}}>
                <Col>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-start"}}>Type 3</Text>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-start"}}>20 kWMax</Text>
                </Col>
              </Row>
            </Col>
            <Col style={{marginRight: 15, backgroundColor: "#FFA07A"}}>
              <Row style={{marginTop: 10, alignSelf: "flex-end", backgroundColor: "#6495ED"}}>
                <Row style={{backgroundColor: "#A52A2A"}}>
                  <Col style={{backgroundColor: "##8A2BE2"}}>
                    <Text style={{marginTop: 3}}>25 kW/h</Text>
                  </Col>
                </Row>
                <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse" duration={3000}>
                  <Badge danger>
                      <Text>B</Text>
                  </Badge>
                </Animatable.View>
              </Row>
              <Row style={{alignSelf: "flex-end", backgroundColor: "#008B8B"}}>
                <Col>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-end"}}>Type 3</Text>
                  <Text style={{fontSize: 8.5, alignSelf: "flex-end"}}>20 kWMax</Text>
                </Col>
              </Row>
            </Col>
          </Row>
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
