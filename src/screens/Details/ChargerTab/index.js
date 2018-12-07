import React, { Component } from "react";
import { Button, Icon, Text, Footer, FooterTab } from "native-base";
import { TabNavigator } from "react-navigation";
import Orientation from "react-native-orientation";

import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";

import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import GraphDetails from "../GraphDetails";
import styles from "./styles";

const _provider = ProviderFactory.getProvider();

class ChargerTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Set Admin
    await this._setIsAdmin();
  }

  componentDidUpdate() {
    this.isGraphTabActive();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  _setIsAdmin = async () => {
    let result = await _provider._isAdmin();
    this.setState({
     isAdmin: result
    });
 }

  isGraphTabActive = () => {
    if (this.props.navigationState.index === 2) {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
    }
  }

  render() {
    const navigation = this.props.navigation;
    const state = this.props.navigationState;
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab>
          <Button vertical active={state.index === 0} onPress={()=>navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>{I18n.t("details.connector")}</Text>
          </Button>
          { this.state.isAdmin && (
            <Button vertical active={state.index === 1} onPress={()=>navigation.navigate("ChargerDetails")}>
              <Icon type="MaterialIcons" name="info" />
              <Text>{I18n.t("details.informations")}</Text>
            </Button>
          )}
          <Button vertical active={this.state.isAdmin ? state.index === 2 : state.index === 1} onPress={()=>navigation.navigate("GraphDetails")}>
            <Icon type="MaterialIcons" name="timeline" />
            <Text>{I18n.t("details.graph")}</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const ChargerNavigation = TabNavigator(
  {
    ConnectorDetails: { screen: ConnectorDetails },
    ChargerDetails: { screen: ChargerDetails },
    GraphDetails: { screen: GraphDetails }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    initialRouteName: "ConnectorDetails",
    animationEnabled: false,
    tabBarComponent: props => {
      return (
        <ChargerTabs {...props} />
      );
    }
  }
);

export default ChargerNavigation;
