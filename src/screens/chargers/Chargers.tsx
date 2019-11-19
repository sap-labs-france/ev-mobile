import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import BackgroundComponent from '../../components/background/BackgroundComponent';
import ChargerComponent from '../../components/charger/ChargerComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import { DataResult } from '../../types/DataResult';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './ChargersStyles';

export interface Props extends BaseProps {
}

interface State {
  chargers?: ChargingStation[];
  siteAreaID?: string;
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
}

export default class Chargers extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      chargers: [],
      siteAreaID: Utils.getParamFromNavigation(this.props.navigation, 'siteAreaID', null),
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

  public getChargers = async (searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> => {
    const { siteAreaID } = this.state;
    let chargers: DataResult<ChargingStation>;
    try {
      // Get Chargers
      if (siteAreaID) {
        // Get with the Site Area
        chargers = await this.centralServerProvider.getChargers({ Search: searchText, SiteAreaID: siteAreaID }, { skip, limit });
      } else {
        // Get without the Site
        chargers = await this.centralServerProvider.getChargers({ Search: searchText }, { skip, limit });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
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
    const { siteAreaID } = this.state;
    if (siteAreaID) {
      // Go Back
      this.props.navigation.goBack();
    } else {
      // Back mobile button: Force navigation
      this.props.navigation.navigate({ routeName: 'HomeNavigator' });
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
      // Add Chargers
      this.setState(() => ({
        loading: false,
        chargers: chargers ? chargers.result : [],
        count: chargers ? chargers.count : 0
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
    const { loading, chargers, skip, count, limit } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t('chargers.title')}
            leftAction={this.onBack}
            leftActionIcon={'navigate-before'}
            rightAction={navigation.openDrawer}
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
                data={chargers}
                renderItem={({ item }) => <ChargerComponent charger={item} navigation={navigation} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noChargers')} />}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
