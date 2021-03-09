import {DrawerActions} from '@react-navigation/native';
import i18n from 'i18n-js';
import {Container, Spinner} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList, {ItemsListTypes} from '../../components/list/ItemsList';
import TagComponent from '../../components/tag/TagComponent';
import BaseProps from '../../types/BaseProps';
import {DataResult} from '../../types/DataResult';
import {HTTPAuthError} from '../../types/HTTPError';
import Tag from '../../types/Tag';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../transactions/TransactionsStyles';

export interface Props extends BaseProps {
}

interface State {
  tags?: Tag[];
  skip?: number;
  limit?: number;
  count?: number;
  refreshing?: boolean;
  loading? : boolean;
}

export default class TagsList extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      tags: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true
    }
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async getTags(skip: number, limit: number): Promise<DataResult<Tag>> {
    try {
      return await this.centralServerProvider.getTags({}, {skip, limit});
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
          'transactions.transactionUnexpectedError', this.props.navigation, this.refresh);
      }
    }
    return null;
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('HomeNavigator');
    // Do not bubble up
    return true;
  };

  public onEndScroll = async () => {
    const {count, skip, limit} = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const tags = await this.getTags(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        tags: tags ? [...prevState.tags, ...tags.result] : prevState.tags,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const {skip, limit} = this.state;
      // Refresh All
      const tags = await this.getTags(0, skip + limit);
      const tagsResult = tags ? tags.result : []
      // Set
      this.setState({
        loading: false,
        tags: tagsResult,
        count: tags.count
      });
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const {tags, count, skip, limit, refreshing, loading} = this.state;
    const {navigation} = this.props;
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={i18n.t('sidebar.badges')}
          navigation={this.props.navigation}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true
          }}
          rightActionIcon={'menu'}
        />
        {loading ? (
          <Spinner style={style.spinner} color='grey'/>
        ) : (
          <View style={style.content}>
            <ItemsList<Tag>
              select={ItemsListTypes.MULTI}
              data={tags} navigation={navigation}
              count={count} limit={limit}
              skip={skip}
              renderItem={(item: Tag, selected: boolean) => (
                <TagComponent tag={item} isAdmin={this.centralServerProvider.getSecurityProvider().isAdmin()} selected={selected} navigation={navigation}/>)}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={i18n.t('tags.noBadges')}
            />
          </View>
        )}
      </Container>
    )
  }
}
