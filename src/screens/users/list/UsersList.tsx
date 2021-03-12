import { DrawerActions } from '@react-navigation/native';
import i18n from 'i18n-js';
import { Container, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList from '../../../components/list/ItemsList';
import UserComponent from '../../../components/user/UserComponent';
import BaseProps from '../../../types/BaseProps';
import { DataResult } from '../../../types/DataResult';
import User from '../../../types/User';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../../transactions/TransactionsStyles';
import I18nManager from "../../../I18n/I18nManager";
import I18n from "i18n-js";

export interface Props extends  BaseProps{
}

export interface State {
  users?: User[];
  skip?: number;
  limit?: number;
  count?: number;
  refreshing?: boolean;
  loading? : boolean;
}

export default class UsersList extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      users: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true
    }
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public async getUsers(skip: number, limit: number): Promise<DataResult<User>> {
    try {
      const users = await this.centralServerProvider.getUsers({}, {skip, limit});
      // Check
      if (users.count === -1) {
        // Request nbr of records
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getUsers({}, {skip, limit});
        // Set
        users.count = transactionsNbrRecordsOnly.count;
      }
      return users;
    } catch (error) {
      // Check if HTTP?
      if (!error.request) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
          'transactions.transactionUnexpectedError', this.props.navigation, this.refresh);
      }
    }
    return null;
  }

  public async getUserImage(id: string) {
    try {
      return await this.centralServerProvider.getUserImage({ID: id});
    } catch (error) {
      // Check if HTTP?
      if (!error.request) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
          'users.userUnexpectedError', this.props.navigation, this.refresh);
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
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const users = await this.getUsers(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        users: users ? [...prevState.users, ...users.result] : prevState.users,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const users = await this.getUsers(0, skip + limit);
      const usersResult = users ? users.result : []
      usersResult.forEach(async (user: User) => {
        user.image = await this.getUserImage(user.id)
      })
      // Set
      this.setState({
        loading: false,
        users: usersResult,
        count: users.count
      });
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const {users, count, skip, limit, refreshing, loading} = this.state;
    const {navigation} = this.props;
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={i18n.t('sidebar.users')}
          navigation={this.props.navigation}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('users.users')}` : null}
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
            <ItemsList<User>
              data={users} navigation={navigation}
              count={count} limit={limit}
              skip={skip}
              renderItem={(item: User, selected: boolean) => (
                <UserComponent user={item} selected={selected}
                               navigation={this.props.navigation}/>)}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={i18n.t('users.noUsers')}
            />
          </View>
        )}
      </Container>
    )
  }
}
