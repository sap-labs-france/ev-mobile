import React from "react";
import { ScrollView, BackHandler } from "react-native";
import { Spinner, Container } from "native-base";
import HTMLView from "react-native-htmlview";
import computeStyleSheet from "./EulaStyles";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import HeaderComponent from "../../../components/header/HeaderComponent";

export default class Eula extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      I18nLocal: I18n.currentLocale().substr(0, 2),
      loading: true,
      eulaTextHtml: ""
    };
  }

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Load
    this.refresh();
  }

  refresh = async () => {
    // Call
    await this.endUserLicenseAgreement();
  };

  endUserLicenseAgreement = async () => {
    const { I18nLocal } = this.state;
    try {
      const result = await this.centralServerProvider.getEndUserLicenseAgreement({
        Language: I18nLocal
      });
      this.setState({
        loading: false,
        eulaTextHtml: result.text
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate("Login");
    // Do not bubble up
    return true;
  };

  render() {
    const style = computeStyleSheet();
    const { eulaTextHtml, loading } = this.state;
    return (
      <Container>
        <HeaderComponent
          title={I18n.t("authentication.eula")}
          leftAction={() => this.props.navigation.navigate("Login")}
          leftActionIcon={"navigate-before"}
        />
        {loading ? (
          <Spinner style={style.spinner} color="white" />
        ) : (
          <ScrollView style={style.container}>
            <HTMLView value={eulaTextHtml} />
          </ScrollView>
        )}
      </Container>
    );
  }
}
