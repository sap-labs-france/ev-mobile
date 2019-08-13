import React from "react";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import { Text, Container, Spinner } from "native-base";
import { FlatList, RefreshControl } from "react-native";
import Constants from "../../utils/Constants";
import I18n from "../../I18n/I18n";
import Utils from "../../utils/Utils";
import computeStyleSheet from "./AllSessionsStyle";
import HeaderComponent from "../../components/header/HeaderComponent";
import SessionComponent from "../../components/session/SessionComponent";
import BackgroundComponent from "../../components/background/BackgroundComponent";


export default class AllSessions extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      sessions: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
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
      transactions = await this.centralServerProvider.getTransactions( null, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return transactions;
  };

  onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  refresh = async () => {
    const transactions = await this._getTransations();
    if (!transactions) {
      transactions = []
    }
    this.setState({
      loading: false,
      count: transactions.count,
      transactions:transactions.result
    })
  };

  render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("sidebar.sessions")}
            showSearchAction={true}
            searchRef={this.searchRef}
            leftAction={this.onBack}
            leftActionIcon={"navigate-before"}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <FlatList
            data={this.state.transactions}
            renderItem={({ item }) => <SessionComponent session={item} navigation={navigation}/>}
            keyExtractor={(item) => `${item.id}`}
            refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
            onEndReached={this._onEndScroll}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this._footerList}
          />
        </BackgroundComponent>
      </Container>
    );
  };
}
