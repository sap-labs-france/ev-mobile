import React, { Component } from "react";
import { TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Button, Icon, Text, View, Spinner } from "native-base";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import styles from "./styles";
import Message from "../../../utils/Message";

const _provider = ProviderFactory.getProvider();

export class ChargerHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteID: this.props.navigation.state.params.siteID,
      siteImage: "",
      isAdmin: false,
      loadingTransaction: false
    };
    // Get the Site Image
    this._getSiteImage();    
  }

  async componentDidMount() {
    // Init
    await this._setIsAdmin();
  }

  _setIsAdmin = async () => {
    const isAdmin = await _provider._isAdmin();
    this.setState({
      isAdmin
    });
 }

  onStartTransaction = () => {
    const { charger } = this.props;
    Alert.alert(
      `${I18n.t("details.startTransaction")}`,
      `${I18n.t("details.startTransactionMessage")} ${charger.id} ?`,
      [
        {text: I18n.t("general.yes"), onPress: () => this._startTransaction()},
        {text: I18n.t("general.no")}
      ]
    );
  }

  onStopTransaction = async () => {
    const { charger } = this.props;
    // Check
    const isAuthorised = await this._isAuthorizedStopTransaction();
    if (!isAuthorised) {
      Alert.alert(
        `${I18n.t("details.notAuthorisedTitle")}`,
        `${I18n.t("details.notAuthorised")}`,
        [
          {text: I18n.t("general.ok")},
        ]
      );
    } else {
      Alert.alert(
        `${I18n.t("details.stopTransaction")}`,
        `${I18n.t("details.stopTransactionMessage")} ${charger.id} ?`,
        [
          {text: I18n.t("general.yes"), onPress: () => this._stopTransaction()},
          {text: I18n.t("general.no")}
        ]
      );
    }
  }

  _startTransaction = async () => {
    const { charger, connector } = this.props;
    this.setState({loadingTransaction: true});
    try {
      // Start the Transaction
      let status = await _provider.startTransaction(charger.id, connector.connectorId);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({loadingTransaction: false});
  }

  _stopTransaction = async () => {
    const { charger, connector } = this.props;
    this.setState({loadingTransaction: true});
    try {
      // Stop the Transaction
      let status = await _provider.stopTransaction(charger.id, connector.activeTransactionID);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({loadingTransaction: false});
  }

  _isAuthorizedStopTransaction = async () => {
    try {
      let result = await _provider.isAuthorizedStopTransaction(
        { Action: "StopTransaction", Arg1: this.props.charger.id, Arg2: this.props.connector.activeTransactionID }
      );
      if (result) {
        return result.IsAuthorized;
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getSiteImage = async () => {
    try {
      let result = await _provider.getSiteImage(
        { ID: this.state.siteID }
      );
      if (result) {
        this.setState({siteImage: result.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const { charger, connector, navigation } = this.props;
    const { siteImage, loadingTransaction } = this.state;
    const connectorLetter = String.fromCharCode(64 + connector.connectorId);
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.arrowIconColumn}>
            <Button transparent onPress={() => navigation.navigate("Chargers")}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
          </View>
          <View style={styles.chargerNameColumn}>
            <Text style={styles.chargerName}>{charger.id}</Text>
            <Text style={styles.connectorName}>({I18n.t("details.connector")} {connectorLetter})</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <ImageBackground style={styles.backgroundImage} source={siteImage ? {uri: siteImage} : undefined}>
          { loadingTransaction ?
            <Spinner color="white" style={styles.spinner} />
          :
            <View>
              {this.state.isAdmin && (
                <View style={styles.transactionContainer}>
                  {connector.activeTransactionID === 0 ?
                    <TouchableOpacity onPress={() => this.onStartTransaction()}>
                      <View style={styles.outerCircle}>
                        <View style={styles.innerCircleStartTransaction}>
                          <Icon style={styles.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  :
                    <TouchableOpacity onPress={() => this.onStopTransaction()}>
                      <View style={styles.outerCircle}>
                        <View style={styles.innerCircleStopTransaction}>
                          <Icon style={styles.startStopTransactionIcon} type="MaterialIcons" name="stop" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              )}
            </View>
          }
          </ImageBackground>
        </View>
      </View>
    );
  }
}

export default ChargerHeader;
