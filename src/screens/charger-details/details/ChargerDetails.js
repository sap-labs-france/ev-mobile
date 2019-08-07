import React from "react";
import { ScrollView, Alert } from "react-native";
import { Container, View, Text, Button } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ChargerDetailsStyles";
import PropTypes from "prop-types";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import BaseScreen from "../../base-screen/BaseScreen";

export default class ChargerDetails extends BaseScreen {
  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
  }

  _resetHardConfirm() {
    const { charger } = this.props;
    Alert.alert(
      I18n.t("chargers.resetHard"),
      I18n.t("chargers.resetHardMessage", { chargeBoxID: charger.id }),
      [
        { text: I18n.t("general.yes"), onPress: () => this._reset(charger.id, "Hard") },
        { text: I18n.t("general.cancel") }
      ]
    );
  }

  _resetSoftConfirm() {
    const { charger } = this.props;
    Alert.alert(
      I18n.t("chargers.resetSoft"),
      I18n.t("chargers.resetSoftMessage", { chargeBoxID: charger.id }),
      [
        { text: I18n.t("general.yes"), onPress: () => this._reset(charger.id, "Soft") },
        { text: I18n.t("general.cancel") }
      ]
    );
  }

  async _reset(chargeBoxID, type) {
    try {
      // Start the Transaction
      const status = await this.centralServerProvider.reset(chargeBoxID, type);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
    }
  }

  _clearCacheConfirm() {
    const { charger } = this.props;
    Alert.alert(
      I18n.t("chargers.clearCache"),
      I18n.t("chargers.clearCacheMessage", { chargeBoxID: charger.id }),
      [
        { text: I18n.t("general.yes"), onPress: () => this._clearCache(charger.id) },
        { text: I18n.t("general.cancel") }
      ]
    );
  }

  async _clearCache(chargeBoxID) {
    try {
      // Start the Transaction
      const status = await this.centralServerProvider.clearCache(chargeBoxID);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
    }
  }

  render() {
    const style = computeStyleSheet();
    const { charger } = this.props;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.topViewContainer}>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                <Text style={style.value}>
                  {charger.chargePointVendor ? charger.chargePointVendor : "-"}
                </Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.model")}</Text>
                <Text style={style.value}>
                  {charger.chargePointModel ? charger.chargePointModel : "-"}
                </Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                <Text style={style.value}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                <Text style={style.value}>
                  {charger.firmwareVersion ? charger.firmwareVersion : "-"}
                </Text>
              </View>
            </View>
            <View style={style.bottomViewContainer}>
              <View style={style.actionContainer}>
                <Button rounded danger style={style.actionButton}
                    onPress={() => this._resetHardConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>{I18n.t("chargers.resetHard")}</Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button rounded warning style={style.actionButton}
                    onPress={() => this._resetSoftConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>{I18n.t("chargers.resetSoft")}</Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button rounded warning style={style.actionButton}
                    onPress={() => this._clearCacheConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>{I18n.t("chargers.clearCache")}</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </BackgroundComponent>
      </Container>
    );
  }
}

ChargerDetails.propTypes = {
  charger: PropTypes.object.isRequired,
  connector: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

ChargerDetails.defaultProps = {};
