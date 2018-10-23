import React from "react";
import { Button, Icon, Text, Footer, FooterTab } from "native-base";
import { TabNavigator } from "react-navigation";

import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import GraphDetails from "../GraphDetails";
import styles from "./styles";

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
    tabBarComponent: props => {
      return (
        <Footer style={styles.footerContainer}>
          <FooterTab>
            <Button vertical active={props.navigationState.index === 0} onPress={()=>props.navigation.navigate("ConnectorDetails")}>
              <Icon type="Feather" name="zap"/>
              <Text>Connector</Text>
            </Button>
            <Button vertical active={props.navigationState.index === 1} onPress={()=>props.navigation.navigate("GraphDetails")}>
              <Icon type="MaterialIcons" name="timeline" />
              <Text>Graph</Text>
            </Button>
            <Button vertical active={props.navigationState.index === 2} onPress={()=>props.navigation.navigate("ChargerDetails")}>
              <Icon type="MaterialIcons" name="info" />
              <Text>Informations</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
);

export default Details;
