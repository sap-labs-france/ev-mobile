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
          <Row style={{backgroundColor: "green"}} >
            <Text>{item.id} - <Text style={{fontStyle: "italic"}}>Brand</Text></Text>
          </Row>
          <Row>
            <Col style={{marginLeft: 15, backgroundColor: "purple"}}>
              <Badge style={{alignSelf: "flex-start", marginBottom: 5, marginTop: 10}} success>
                <Text>A</Text>
              </Badge>
              <Text style={{fontSize: 10, alignSelf: "flex-start"}}>Type 3</Text>
            </Col>
            <Col style={{marginRight: 15, backgroundColor: "tomato"}}>
              <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse" duration={3000}>
                <Badge style={{alignSelf: "flex-end", marginBottom: 5, marginTop: 10}} danger>
                    <Text>B</Text>
                </Badge>
              </Animatable.View>
              <Text style={{fontSize: 10, alignSelf: "flex-end"}}>50.2 Kw</Text>
              <Text style={{fontSize: 10, alignSelf: "flex-end"}}>Type 2</Text>
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
