import React, { Component } from "react";
import { Button, Icon, Text, Footer, FooterTab } from "native-base";
import { TabNavigator } from "react-navigation";

import Orientation from "react-native-orientation";

import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import GraphDetails from "../GraphDetails";
import styles from "./styles";

class TabDetails extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.isGraphTabActive();
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations();
  }

  isGraphTabActive = () => {
    if (this.props.navigationState.index === 1) {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
    }
  }

  render() {
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab>
          <Button vertical active={this.props.navigationState.index === 0} onPress={()=>this.props.navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>Connector</Text>
          </Button>
          <Button vertical active={this.props.navigationState.index === 1} onPress={()=>this.props.navigation.navigate("GraphDetails")}>
            <Icon type="MaterialIcons" name="timeline" />
            <Text>Graph</Text>
          </Button>
          <Button vertical active={this.props.navigationState.index === 2} onPress={()=>this.props.navigation.navigate("ChargerDetails")}>
            <Icon type="MaterialIcons" name="info" />
            <Text>Informations</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const Details = TabNavigator(
  {
    ConnectorDetails: { screen: ConnectorDetails },
    GraphDetails: { screen: GraphDetails },
    ChargerDetails: { screen: ChargerDetails }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    initialRouteName: "ConnectorDetails",
    animationEnabled: false,
    tabBarComponent: props => {
      return (
        <TabDetails {...props} />
      );
    }
  }
);

export default Details;
