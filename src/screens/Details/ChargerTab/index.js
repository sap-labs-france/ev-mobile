import React from "react";
import { Button, Icon, Text, FooterTab, Footer } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";

const _provider = ProviderFactory.getProvider();

class ChargerTab extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    const navigation = this.props.navigation;
    // Set if Admin
    const isAdmin = (await _provider.getSecurityProvider()).isAdmin();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({isAdmin});
    // Navigate to the first screen
    navigation.navigate("ConnectorDetails", params);
  }

  componentWillUnmount() {
  }

  render() {
    const style = computeStyleSheet();
    const { isAdmin } = this.state;
    const navigation = this.props.navigation;
    const { index, params } = this.props.navigation.state;
    return (
      <Footer style={style.footerContainer}>
        <FooterTab>
          <Button vertical active={index === 0} onPress={()=> navigation.navigate("ConnectorDetails", params)}>
            <Icon type="FontAwesome" name="bolt"/>
            <Text>{I18n.t("details.connector")}</Text>
          </Button>
          <Button vertical active={index === 1} onPress={()=> navigation.navigate("ChartDetails", params)}>
            <Icon type="MaterialIcons" name="timeline" />
            <Text>{I18n.t("details.graph")}</Text>
          </Button>
          { isAdmin ?
              <Button vertical active={index === 2} onPress={()=> navigation.navigate("ChargerDetails", params)}>
                <Icon type="MaterialIcons" name="info" />
                <Text>{I18n.t("details.informations")}</Text>
              </Button>
            :
              undefined
          }
        </FooterTab>
      </Footer>
    );
  }
}

export default ChargerTab;
