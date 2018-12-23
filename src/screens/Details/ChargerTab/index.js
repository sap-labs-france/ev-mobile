import React from "react";
import { Button, Icon, Text, FooterTab, Footer } from "native-base";
import { TabNavigator } from "react-navigation";
import { ResponsiveComponent } from "react-native-responsive-ui";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import ChartDetails from "../ChartDetails";
import computeStyleSheet from "./styles";

const _provider = ProviderFactory.getProvider();

class ChargerTabs extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Set if Admin
    const isAdmin = (await _provider.getSecurityProvider()).isAdmin();
    this.setState({isAdmin});
  }

  componentWillUnmount() {
  }

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const state = this.props.navigationState;
    return (
      <Footer style={style.footerContainer}>
        <FooterTab>
          <Button vertical active={state.index === 0} onPress={()=>navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>{I18n.t("details.connector")}</Text>
          </Button>
          <Button vertical active={state.index === 1} onPress={()=>navigation.navigate("ChargerDetails")}>
            <Icon type="MaterialIcons" name="info" />
            <Text>{I18n.t("details.informations")}</Text>
          </Button>
          <Button vertical active={state.index === 2} onPress={()=>navigation.navigate("ChartDetails")}>
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
    ChartDetails: { screen: ChartDetails }
  },
  {
    initialRouteName: "ConnectorDetails",
    tabBarPosition: "bottom",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarComponent: props => {
      return (
        <ChargerTabs {...props} />
      );
    }
  }
);

export default ChargerNavigation;
