import React, { Component } from "react";
import { TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Button, Icon, Text, Footer, FooterTab, View, Spinner } from "native-base";
import { TabNavigator } from "react-navigation";
import Orientation from "react-native-orientation";

import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";

import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import GraphDetails from "../GraphDetails";
import styles from "./styles";
import Message from "../../../utils/Message";

const _provider = ProviderFactory.getProvider();

export class Header extends Component {

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
    await this._isAdmin();
  }

  _isAdmin = async () => {
    let result = await _provider._isAdmin();
    this.setState({
     isAdmin: result
    });
 }

  onStartTransaction = () => {
    const { charger } = this.props;
    Alert.alert(
      `${I18n.t("details.startTransaction")}`,
      `${I18n.t("details.startTransactionMessage")} ${charger.id} ?`,
      [
        {text: I18n.t("general.yes"), onPress: () => this.startTransaction()},
        {text: I18n.t("general.no")}
      ]
    );
  }

  onStopTransaction = async () => {
    const { charger } = this.props;
    const isAuthorised = await this._isAuthorizedStopTransaction();
    if (!isAuthorised) {
      Alert.alert(
        `${I18n.t("details.notAuthorisedTitle")}`,
        `${I18n.t("details.notAuthorised")}`,
        [
          {text: "Okay"},
        ]
      );
    } else {
      Alert.alert(
        `${I18n.t("details.stopTransaction")}`,
        `${I18n.t("details.stopTransactionMessage")} ${charger.id} ?`,
        [
          {text: I18n.t("general.yes"), onPress: () => this.stopTransaction()},
          {text: I18n.t("general.no")}
        ]
      );
    }
  }

  startTransaction = async () => {
    const { charger, connector } = this.props;
    this.setState({loadingTransaction: true});
    try {
      let status = await _provider.startTransaction(charger.id, connector.connectorId);
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

  stopTransaction = async () => {
    const { charger, connector } = this.props;
    this.setState({loadingTransaction: true});
    try {
      let status = await _provider.stopTransaction(charger.id, connector.activeTransactionID);
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
      let isAuthorised = await _provider.isAuthorizedStopTransaction(
        { Action: "StopTransaction", Arg1: this.props.charger.id, Arg2: this.props.connector.activeTransactionID }
      );
      if (isAuthorised) {
        return isAuthorised.IsAuthorized;
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
    const { charger, connector, alpha, navigation } = this.props;
    const { siteImage, loadingTransaction } = this.state;
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
            <Text style={styles.connectorName}>{I18n.t("details.connector")} {alpha}</Text>
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

class TabDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  async componentDidMount() {
    await this._isAdmin();
  }

  componentDidUpdate() {
    this.isGraphTabActive();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  _isAdmin = async () => {
    let result = await _provider._isAdmin();
    this.setState({
     isAdmin: result
    });
 }

  isGraphTabActive = () => {
    if (this.props.navigationState.index === 2) {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
    }
  }

  render() {
    const navigation = this.props.navigation;
    const state = this.props.navigationState;
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab>
          <Button vertical active={state.index === 0} onPress={()=>navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>{I18n.t("details.connector")}</Text>
          </Button>
          { this.state.isAdmin && (
            <Button vertical active={state.index === 1} onPress={()=>navigation.navigate("ChargerDetails")}>
              <Icon type="MaterialIcons" name="info" />
              <Text>{I18n.t("details.informations")}</Text>
            </Button>
          )}
          <Button vertical active={this.state.isAdmin ? state.index === 2 : state.index === 1} onPress={()=>navigation.navigate("GraphDetails")}>
            <Icon type="MaterialIcons" name="timeline" />
            <Text>{I18n.t("details.graph")}</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const Details = TabNavigator(
  {
    ConnectorDetails: { screen: ConnectorDetails },
    ChargerDetails: { screen: ChargerDetails },
    GraphDetails: { screen: GraphDetails }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    initialRouteName: "ConnectorDetails",
    animationEnabled: false,
    tabBarComponent: props => {
      return (
        <TabDetails {...props} />
      );
    }
  }
);

export default Details;
