import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import SiteComponent from '../../components/site/SiteComponent';
import BaseProps from '../../types/BaseProps';
import { DataResult } from '../../types/DataResult';
import Site from '../../types/Site';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './SitesStyles';

export interface Props extends BaseProps {
}

interface State {
  sites?: Site[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
}

export default class Sites extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      sites: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // No Site Management: Go to chargers
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    if (securityProvider && !securityProvider.isComponentOrganizationActive()) {
      this.props.navigation.navigate('Chargers');
    }
  }

  public getSites = async (searchText = '', skip: number, limit: number): Promise<DataResult<Site>> => {
    let sites: DataResult<Site>;
    try {
      // Get the Sites
      sites = await this.centralServerProvider.getSites({ Search: searchText, WithAvailableChargers: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return sites;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate({ routeName: 'HomeNavigator' });
    // Do not bubble up
    return true;
  };

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const sites = await this.getSites(this.searchText, 0, skip + limit);
      // Add sites
      this.setState({
        loading: false,
        count: sites ? sites.count : 0,
        sites: sites ? sites.result : []
      });
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

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const sites = await this.getSites(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        sites: sites ? [...prevState.sites, ...sites.result] : prevState.sites,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  }

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, skip, count, limit } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          navigation={navigation}
          title={I18n.t('sidebar.sites')}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        <SimpleSearchComponent
          onChange={(searchText) => this.search(searchText)}
          navigation={navigation}
        />
        <View style={style.content}>
          {loading ? (
            <Spinner style={style.spinner} />
          ) : (
            <FlatList
              data={this.state.sites}
              renderItem={({ item }) => <SiteComponent site={item} navigation={this.props.navigation} />}
              keyExtractor={(item) => item.id}
              refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
              onEndReached={this.onEndScroll}
              onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
              ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('sites.noSites')} />}
              ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
            />
          )}
        </View>
      </Container>
    );
  }
}
