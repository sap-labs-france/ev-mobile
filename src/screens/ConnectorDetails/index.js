import React, { Component } from "react";
import { Image } from "react-native";
import { Container, Header, Content, Spinner, Left, Right, Body, Button, Icon, View } from "native-base";

import styles from "./styles";

class ConnectorDetails extends Component {

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
          </Body>
          <Right>
            <Button transparent>
              <Icon active name="options" />
            </Button>
          </Right>
        </Header>
      </Container>
    );
  }
}

export default ConnectorDetails;
