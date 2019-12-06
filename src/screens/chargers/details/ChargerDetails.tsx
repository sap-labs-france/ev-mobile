import I18n from "i18n-js";
import { Button, Container, Icon, Spinner, Text, View } from "native-base";
import React from "react";
import { Alert, ScrollView } from "react-native";
import HeaderComponent from "../../../components/header/HeaderComponent";
import BaseProps from "../../../types/BaseProps";
import ChargingStation from "../../../types/ChargingStation";
import Connector from "../../../types/Connector";
import Message from "../../../utils/Message";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import computeStyleSheet from "./ChargerDetailsStyles";

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  isAdmin?: boolean;
  charger: ChargingStation;
  connector: Connector;
}

export default class ChargerDetails extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      isAdmin: false,
      charger: null,
      connector: null,
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    const chargerID = Utils.getParamFromNavigation(this.props.navigation, "chargerID", null);
    const connectorID: number = parseInt(Utils.getParamFromNavigation(this.props.navigation, "connectorID", null), 10);
    // Get Charger
    const charger = await this.getCharger(chargerID);
    // Get the provider
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    // Set
    this.setState({
      loading: false,
      charger,
      connector: charger ? charger.connectors[connectorID - 1] : null,
      isAdmin: securityProvider ? securityProvider.isAdmin() : false
    });
  }

  public getCharger = async (chargerID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      return charger;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
    return null;
  };

  public resetHardConfirm() {
    const { charger } = this.state;
    Alert.alert(I18n.t("chargers.resetHard"), I18n.t("chargers.resetHardMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.reset(charger.id, "Hard") },
      { text: I18n.t("general.cancel") }
    ]);
  }

  public resetSoftConfirm() {
    const { charger } = this.state;
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
    const { charger } = this.state;
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, isAdmin, charger, connector } = this.state;
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <Container style={style.container}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={charger ? charger.id : I18n.t("connector.unknown")}
            subTitle={`(${I18n.t("details.connector")} ${connectorLetter})`}
            leftAction={() => this.onBack()}
            leftActionIcon={"navigate-before"}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.topViewContainer}>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                <Text style={style.value}>{charger && charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t("details.model")}</Text>
                <Text style={style.value}>{charger && charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
              </View>
              {isAdmin &&
                <View>
                  <View style={style.descriptionContainer}>
                    <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                    <Text style={style.value}>{charger && charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
                  </View>
                  <View style={style.descriptionContainer}>
                    <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                    <Text style={style.value}>{charger && charger.firmwareVersion ? charger.firmwareVersion : "-"}</Text>
                  </View>
                </View>
              }
            </View>
            {isAdmin &&
              <View style={style.bottomViewContainer}>
                <View style={style.actionContainer}>
                  <Button rounded={true} iconLeft={true} danger={true} style={style.actionButton} onPress={() => this.resetHardConfirm()}>
                    <Icon type="MaterialIcons" name='repeat' />
                    <Text uppercase={false} style={style.actionButtonText}>
                      {I18n.t("chargers.resetHard")}
                    </Text>
                  </Button>
                </View>
                <View style={style.actionContainer}>
                  <Button rounded={true} iconLeft={true} warning={true} style={style.actionButton} onPress={() => this.resetSoftConfirm()}>
                    <Icon type="MaterialIcons" name='layers-clear' />
                    <Text uppercase={false} style={style.actionButtonText}>
                      {I18n.t("chargers.resetSoft")}
                    </Text>
                  </Button>
                </View>
                <View style={style.actionContainer}>
                  <Button rounded={true} iconLeft={true} warning={true} style={style.actionButton} onPress={() => this.clearCacheConfirm()}>
                    <Icon type="MaterialIcons" name='refresh' />
                    <Text uppercase={false} style={style.actionButtonText}>
                      {I18n.t("chargers.clearCache")}
                    </Text>
                  </Button>
                </View>
              </View>
            }
          </ScrollView>
        </Container>
      )
    );
  }
}
