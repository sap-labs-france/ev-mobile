import Container from "native-base/Container";
import Spinner from "native-base/Spinner";
import React from "react";
import HTMLView from "react-native-htmlview";
import ScrollView from "react-native/ScrollView";
import HeaderComponent from "../../../components/header/HeaderComponent";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import computeStyleSheet from "./EulaStyles";

import I18n from "../../../I18n/I18n";

export interface Props {
}

interface State {
  i18nLocale: string;
  loading: boolean;
  eulaTextHtml: string;
}

export default class Eula extends BaseScreen<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      i18nLocales: I18n.currentLocale().substr(0, 2),
      loading: true,
      eulaTextHtml: ""
    };
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Load
    this.refresh();
  }

  public refresh = async () => {
    await this.endUserLicenseAgreement();
  };

  public endUserLicenseAgreement = async () => {
    const { i18nLocale } = this.state;
    try {
      const result = await this.centralServerProvider.getEndUserLicenseAgreement({
        Language: i18nLocale
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate("Login");
    // Do not bubble up
    return true;
  };

  public render() {
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
