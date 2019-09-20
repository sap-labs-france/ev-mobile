import { Button, Container, Text, View } from "native-base";
import React from "react";
import { Alert, ScrollView } from "react-native";
import BaseProps from "types/BaseProps";
import ChargingStation from "types/ChargingStation";
import Connector from "types/Connector";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import I18n from "../../../I18n/I18n";
import Message from "../../../utils/Message";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import computeStyleSheet from "./ChargerDetailsStyles";

export interface Props extends BaseProps {
  charger: ChargingStation;
  connector: Connector;
}

interface State {
}

export default class ChargerDetails extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
  }

  public resetHardConfirm() {
    const { charger } = this.props;
    Alert.alert(I18n.t("chargers.resetHard"), I18n.t("chargers.resetHardMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.reset(charger.id, "Hard") },
      { text: I18n.t("general.cancel") }
    ]);
  }

  public resetSoftConfirm() {
    const { charger } = this.props;
    Alert.alert(I18n.t("chargers.resetSoft"), I18n.t("chargers.resetSoftMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.reset(charger.id, "Soft") },
      { text: I18n.t("general.cancel") }
    ]);
  }

  public async reset(chargeBoxID: string, type: "Soft"|"Hard") {
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
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
  }

  public clearCacheConfirm() {
    const { charger } = this.props;
    Alert.alert(I18n.t("chargers.clearCache"), I18n.t("chargers.clearCacheMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.clearCache(charger.id) },
      { text: I18n.t("general.cancel") }
    ]);
  }

  public async clearCache(chargeBoxID: string) {
    try {
      // Clear Cache
      const status = await this.centralServerProvider.clearCache(chargeBoxID);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
  }

  public render() {
    const style = computeStyleSheet();
    const { charger } = this.props;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={this.props.navigation} active={false}>
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.topViewContainer}>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                <Text style={style.value}>{charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.model")}</Text>
                <Text style={style.value}>{charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                <Text style={style.value}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                <Text style={style.value}>{charger.firmwareVersion ? charger.firmwareVersion : "-"}</Text>
              </View>
            </View>
            <View style={style.bottomViewContainer}>
              <View style={style.actionContainer}>
                <Button rounded danger style={style.actionButton} onPress={() => this.resetHardConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t("chargers.resetHard")}
                  </Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button rounded warning style={style.actionButton} onPress={() => this.resetSoftConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t("chargers.resetSoft")}
                  </Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button rounded warning style={style.actionButton} onPress={() => this.clearCacheConfirm()}>
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t("chargers.clearCache")}
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </BackgroundComponent>
      </Container>
    );
  }
}
