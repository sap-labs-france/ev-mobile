import React from "react";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import { Container, Spinner, View } from "native-base";
import { FlatList, RefreshControl, Platform } from "react-native";
import Constants from "../../../utils/Constants";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "../TransactionsCommonStyles";
import HeaderComponent from "../../../components/header/HeaderComponent";
import TransactionInProgressComponent from "../../../components/transaction/in-progress/TransactionInProgressComponent";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import ListEmptyTextComponent from "../../../components/list-empty-text/ListEmptyTextComponent";
import PropTypes from "prop-types";

export default class TransactionsInProgress extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      transactions: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      isPricingActive: false,
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
    // Set
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.setState({
      isPricingActive: securityProvider.isComponentPricingActive()
    });
    // Get the sites
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  _getTransationsInProgress = async (searchText = "", skip, limit) => {
    let transactions = [];
    try {
      // Get the Sites
      transactions = await this.centralServerProvider.getTransactionsActive( {}, { skip, limit });
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
    if ((skip + limit < count) || (count === -1)) {
      return <Spinner />;
    }
    return null;
  };

  refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const transactions = await this._getTransationsInProgress("", 0, skip + limit);
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        loading: false,
        transactions: transactions.result,
        count: transactions.count,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      });
    }
  };

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit < count) || (count === -1)) {
      // No: get next sites
      const transactions = await this._getTransationsInProgress("", skip + Constants.PAGING_SIZE, limit);
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
    const { loading, isAdmin, transactions, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("transactions.transactionsInProgress")}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <View style={style.content}>
            {loading ? (
              <Spinner style={style.spinner} />
            ) : (
              <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionInProgressComponent transaction={item} navigation={navigation}
                  isAdmin={isAdmin} isPricingActive={isPricingActive}/>}
                keyExtractor={(item) => `${item.id}`}
                refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
                ListFooterComponent={this._footerList}
                ListEmptyComponent={() => <ListEmptyTextComponent/>}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  };
}

TransactionsInProgress.propTypes = {
  navigation: PropTypes.object.isRequired
};

TransactionsInProgress.defaultProps = {};
