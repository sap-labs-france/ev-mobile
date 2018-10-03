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
        <Grid>
          <Row style={styles.chargerName}>
            <Text>{item.id}</Text>
          </Row>
          <Row>
            <Col>
              <Badge style={{alignSelf: "flex-start", marginLeft: 10, marginBottom: 5}} success>
                <Text>A</Text>
              </Badge>
              <Text style={{alignSelf: "flex-start", fontSize: 13}}>Available</Text>
            </Col>
            <Col>
              <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse" duration={3000}>
                <Badge style={{alignSelf: "flex-end", marginRight: 13, marginBottom: 5}} danger>
                    <Text>B</Text>
                </Badge>
              </Animatable.View>
              <Text style={{alignSelf: "flex-end", fontSize: 13}}>Occupied</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text style={{fontSize: 13, alignSelf: "flex-end"}}>Brand |</Text>
            </Col>
            <Col>
              <Text style={{fontSize: 13, alignSelf: "flex-start"}}>Type</Text>
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
