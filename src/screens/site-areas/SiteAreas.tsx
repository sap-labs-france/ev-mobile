import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import BackgroundComponent from '../../components/background/BackgroundComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import SiteAreaComponent from '../../components/site-area/SiteAreaComponent';
import BaseProps from '../../types/BaseProps';
import { DataResult } from '../../types/DataResult';
import SiteArea from '../../types/SiteArea';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './SiteAreasStyles';

export interface Props extends BaseProps {
}

interface State {
  siteAreas?: SiteArea[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
}

export default class SiteAreas extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      siteAreas: [],
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

  public getSiteAreas = async (searchText: string, skip: number, limit: number): Promise<DataResult<SiteArea>> => {
    let siteAreas:DataResult<SiteArea>;
    const siteID = Utils.getParamFromNavigation(this.props.navigation, 'siteID', null);
    try {
      // Get the Site Areas
      siteAreas = await this.centralServerProvider.getSiteAreas(
        { Search: searchText, SiteID: siteID, WithAvailableChargers: true },
        { skip, limit }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return siteAreas;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this.getSiteAreas(this.searchText, 0, skip + limit);
      // Set Site Areas
      this.setState({
        loading: false,
        siteAreas: siteAreas ? siteAreas.result : [],
        count: siteAreas ? siteAreas.count : 0
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
      const siteAreas = await this.getSiteAreas(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        siteAreas: [...prevState.siteAreas, ...siteAreas.result],
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
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t('siteAreas.title')}
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
                data={this.state.siteAreas}
                renderItem={({ item }) => <SiteAreaComponent siteArea={item} navigation={this.props.navigation} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('siteAreas.noSiteAreas')} />}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
