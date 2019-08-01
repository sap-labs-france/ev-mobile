import React from "react";
import { ScrollView, BackHandler } from "react-native";
import { Spinner, Container } from "native-base";

import HTMLView from "react-native-htmlview";

import styles from "./EulaStyles";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";

const _provider = ProviderFactory.getProvider();

export default class Eula extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      I18nLocal: I18n.currentLocale().substr(0, 2),
      loading: true,
      eulaTextHtml: ""
    };
  }

  componentWillMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    this.endUserLicenseAgreement();
  }

  endUserLicenseAgreement = async () => {
    const { I18nLocal } = this.state;
    try {
      const result = await _provider.getEndUserLicenseAgreement({
        Language: I18nLocal
      });
      this.setState({
        loading: false,
        eulaTextHtml: result.text
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  };

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    const { eulaTextHtml, loading } = this.state;
    return (
      <Container>
        {loading && <Spinner style={styles.spinner} color="white" />}
        {!loading && (
          <ScrollView style={styles.container}>
            <HTMLView value={eulaTextHtml} />
          </ScrollView>
        )}
      </Container>
    );
  }
}
