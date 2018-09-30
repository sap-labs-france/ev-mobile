import React from "react";
import { ScrollView, BackHandler } from "react-native";
import { Spinner, Container } from "native-base";
import HTMLView from "react-native-htmlview";
import styles from "./styles";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Message from "../../../utils/Message";
import Utils from "../../../utils/Utils";

export default class Eula extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      I18nLocal: I18n.currentLocale().substr(0, 2),
      loading: true,
      eulaTextHtml: "",
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    this.endUserLicenseAgreement();
  }

  componentWillMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  endUserLicenseAgreement = async () => {
		const { I18nLocal } = this.state;
		try {
      let result = await CentralServerProvider.getEndUserLicenseAgreement(I18nLocal);
      this.setState({
        loading: false, 
        eulaTextHtml: result.text
      });
		} catch (error) {
      // Check request?
      if (error.request) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error.request);
      } else {
        Message.showError(I18n.t("general.unexpectedError"));
      }
		}
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    const { eulaTextHtml, loading } = this.state;
    return (
      <Container>
        {loading && (
          <Spinner style={styles.spinner} color="black" />
        )}
        {!loading && (
          <ScrollView style={styles.container}>
            <HTMLView value={eulaTextHtml} />
          </ScrollView>
        )}
      </Container>
    );
  }
}