import React from "react";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import { Container, Spinner, View, List } from "native-base";
import { FlatList, RefreshControl, Platform } from "react-native";
import Constants from "../../utils/Constants";
import I18n from "../../I18n/I18n";
import Utils from "../../utils/Utils";
import computeStyleSheet from "./SessionsStyle";
import HeaderComponent from "../../components/header/HeaderComponent";
import SessionComponent from "../../components/session/SessionComponent";
import BackgroundComponent from "../../components/background/BackgroundComponent";

export default class Sessions extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      sessions: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      isAdmin: false
    };
  }

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Get the sites
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  _getTransations = async (searchText = "", skip, limit) => {
    let transactions = [];
    try {
      // Get the Sites
      transactions = await this.centralServerProvider.getTransactions( {}, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return transactions;
  };

  onBack = () => {
    // Do not bubble up
    return true;
  };

  _manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if (skip + limit < count) {
      return <Spinner />;
    }
    return null;
  };

  refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const transactions = await this._getTransations("", 0, skip + limit);
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        loading: false,
        transactions: transactions.result,
        count: transactions.count,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      })
    }
  };

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count) {
      // No: get next sites
      const transactions = await this._getTransations("", skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        transactions: [...prevState.transactions, ...transactions.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isAdmin } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("sidebar.sessions")}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <View style={style.content}>
            {loading ? (
              <Spinner style={style.spinner} />
            ) : (
              <FlatList
                data={this.state.transactions}
                renderItem={({ item }) => <SessionComponent session={item} navigation={navigation} isAdmin={isAdmin}/>}
                keyExtractor={(item) => `${item.id}`}
                refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
                indicatorStyle={"white"}
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
                ListFooterComponent={this._footerList}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  };
}
