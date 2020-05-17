import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';

import I18nManager from '../../../I18n/I18nManager';
import ChargerComponent from '../../../components/charger/ChargerComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargePointStatus } from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import { GlobalFilters } from '../../../types/Filter';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import ChargersFilters, { ChargersFiltersDef } from './ChargersFilters';
import computeStyleSheet from './ChargersStyles';

export interface Props extends BaseProps {
}

interface State {
  chargers?: ChargingStation[];
  loading?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  initialFilters?: ChargersFiltersDef;
  filters?: ChargersFiltersDef;
}

export default class Chargers extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private siteAreaID: string;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      chargers: [],
      loading: true,
      refreshing: false,
      isAdmin: false,
      initialFilters: {},
      filters: {},
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    this.siteAreaID = Utils.getParamFromNavigation(this.props.navigation, 'siteAreaID', null);
    await super.componentDidMount();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async loadInitialFilters() {
    const connectorStatus = await SecuredStorage.loadFilterValue(
      GlobalFilters.ONLY_AVAILABLE_CHARGERS) as ChargePointStatus;
    const connectorType = await SecuredStorage.loadFilterValue(
      GlobalFilters.CONNECTOR_TYPES) as string;
    this.setState({
      initialFilters: { connectorStatus, connectorType },
      filters: { connectorStatus, connectorType}
    });
  }

  public getChargers = async (searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> => {
    let chargers: DataResult<ChargingStation>;
    try {
      // Get with the Site Area
      chargers = await this.centralServerProvider.getChargers({
        Search: searchText,
        SiteAreaID: this.siteAreaID,
        Issuer: true,
        ConnectorStatus: this.state.filters.connectorStatus,
        ConnectorType: this.state.filters.connectorType
      }, { skip, limit });
      // Check
      if (chargers.count === -1) {
        // Request nbr of records
        const chargersNbrRecordsOnly = await this.centralServerProvider.getChargers({
            Search: searchText,
            SiteAreaID: this.siteAreaID,
            Issuer: true,
            ConnectorStatus: this.state.filters.connectorStatus
          }, Constants.ONLY_RECORD_COUNT_PAGING);
        // Set
        chargers.count = chargersNbrRecordsOnly.count;
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnexpectedError', this.props.navigation, this.refresh);
    }
    return chargers;
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const chargers = await this.getChargers(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: chargers ? [...prevState.chargers, ...chargers.result] : prevState.chargers,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public onBack = (): boolean => {
    if (this.siteAreaID) {
      // Go Back
      this.props.navigation.goBack();
    } else {
      // Go back to the top
      this.props.navigation.goBack(null);
    }
    // Do not bubble up
    return true;
  };

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const chargers = await this.getChargers(this.searchText, 0, skip + limit);
      // Get the provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Add Chargers
      this.setState(() => ({
        loading: false,
        chargers: chargers ? chargers.result : [],
        count: chargers ? chargers.count : 0,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      }));
    }
  };

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public getSiteIDFromChargers(): string {
    const { chargers } = this.state;
    // Find the first available Site ID
    if (chargers && chargers.length > 0) {
      for (const charger of chargers) {
        if (charger.siteArea) {
          return charger.siteArea.siteID;
        }
      }
    }
    return null;
  }

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  }

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, chargers, isAdmin, initialFilters,
      skip, count, limit, filters } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) =>
            this.setHeaderComponent(headerComponent)}
          navigation={navigation}
          title={I18n.t('chargers.title')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('chargers.chargers')}` : null}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
          filters={filters}
        />
        <SimpleSearchComponent
          onChange={(searchText) => this.search(searchText)}
          navigation={navigation}
        />
        <View style={style.content}>
          {loading ? (
            <Spinner style={style.spinner} />
          ) : (
            <View style={style.content}>
              <ChargersFilters
                initialFilters={initialFilters}
                onFilterChanged={(newFilters: ChargersFiltersDef) => this.setState({ filters: newFilters }, () => this.refresh())}
                ref={(chargersFilters: ChargersFilters) =>
                  this.setScreenFilters(chargersFilters)}
              />
              <FlatList
                data={chargers}
                renderItem={({ item }) =>
                  <ChargerComponent charger={item} isAdmin={isAdmin} navigation={navigation}
                    isSiteAdmin={this.centralServerProvider.getSecurityProvider().isSiteAdmin(item.siteArea.siteID)} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noChargers')} />}
              />
            </View>
          )}
        </View>
      </Container>
    );
  }
}
