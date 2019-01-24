import React from "react";
import { ScrollView } from "react-native";
import { Container, View, Text, Spinner } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";
import HeaderComponent from "../../../components/Header";
import Utils from "../../../utils/Utils";
import ProviderFactory from "../../../provider/ProviderFactory";

const _provider = ProviderFactory.getProvider();

class ChargerDetails extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      chargerID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "chargerID", null),
      connectorID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "connectorID", null),
      charger: null,
      connector: null,
      firstLoad: true,
    };
  }

  async componentDidMount() {
    // Refresh Charger
    await this._getCharger();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      firstLoad: false
    });
  }

  _getCharger = async () => {
    try {
      let charger = await _provider.getCharger(
        { ID: this.state.chargerID }
      );
      this.setState({
        charger: charger,
        connector: charger.connectors[this.state.connectorID - 1]
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { charger, connectorID, firstLoad } = this.state;
    const connectorLetter = String.fromCharCode(64 + connectorID);
    return (
      <Container>
        {firstLoad ?
          <Spinner color="white" style={style.spinner} />
        :
          <View>
            <HeaderComponent
              title={charger.id} subTitle={`${I18n.t("details.connector")} ${connectorLetter}`}
              leftAction={() => navigation.navigate("Chargers", { siteAreaID: charger.siteAreaID })} leftActionIcon={"arrow-back" } />
            <ScrollView style={style.scrollViewContainer}>
              <View style={style.container}>
                <View style={style.columnContainer}>
                  <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                  <Text style={style.value}>{charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
                </View>
                <View style={style.columnContainer}>
                  <Text style={style.label}>{I18n.t("details.model")}</Text>
                  <Text style={style.value}>{charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
                </View>
                <View style={style.columnContainer}>
                  <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                  <Text style={style.value}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
                </View>
                <View style={style.columnContainer}>
                  <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                  <Text style={style.value}>{charger.firmwareVersion ? charger.firmwareVersion : "-"}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        }
      </Container>
    );
  }
}

export default ChargerDetails;
