import { default as I18n } from 'i18n-js';
import { Container, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList, { ItemSelectionMode } from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import UserComponent from '../../../components/user/UserComponent';
import { DataResult } from '../../../types/DataResult';
import User from '../../../types/User';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './UsersStyle';
import SelectableList, { SelectableProps, SelectableState } from '../../base-screen/SelectableList';
import computeListItemCommonStyles from '../../../components/list/ListItemCommonStyle';

export interface Props extends SelectableProps<User> {}

export interface State extends SelectableState<Users> {
  users?: User[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
}

export default class Users extends SelectableList<User> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE,
    isModal: false
  };

  public state: State;
  public props: Props;
  private searchText: string;
  private userIDs: string[];

  public constructor(props: Props) {
    super(props);
    this.userIDs = Utils.getParamFromNavigation(this.props.route, 'userIDs', null) as string[];
    this.singleItemTitle = I18n.t('users.user');
    this.multiItemsTitle = I18n.t('users.users');
    this.selectMultipleTitle = 'users.selectUsers';
    this.selectSingleTitle = 'users.selectUser';
    this.state = {
      users: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true,
      selectedItems: []
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.refresh();
  }

  public async getUsers(searchText: string, skip: number, limit: number): Promise<DataResult<User>> {
    try {
      const params = {
        Search: searchText,
        UserID: this.userIDs?.join('|')
      };
      const users = await this.centralServerProvider.getUsers(params, { skip, limit }, ['name']);
      // Get total number of records
      if (users?.count === -1) {
        const usersNbrRecordsOnly = await this.centralServerProvider.getUsers(params, Constants.ONLY_RECORD_COUNT);
        users.count = usersNbrRecordsOnly?.count;
      }
      return users;
    } catch (error) {
      // Check if HTTP?
      if (!error.request) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'users.userUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const users = await this.getUsers(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        users: users ? [...prevState.users, ...users.result] : prevState.users,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      this.setState({ refreshing: true });
      const users = await this.getUsers(this.searchText, 0, skip + limit);
      const usersResult = users ? users.result : [];
      // Set
      this.setState({
        loading: false,
        refreshing: false,
        users: usersResult,
        count: users.count
      });
    }
  }

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  };

  public render(): React.ReactElement {
    const style = computeStyleSheet();
    const listItemCommonStyles = computeListItemCommonStyles();
    const { users, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, isModal, selectionMode } = this.props;
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={this.buildHeaderTitle()}
          subTitle={this.buildHeaderSubtitle()}
          modalized={isModal}
          backArrow={!isModal}
          navigation={this.props.navigation}
          displayTenantLogo={false}
        />
        <View style={style.searchBar}>
          <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
        </View>
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<User>
              ref={this.itemsListRef}
              selectionMode={selectionMode}
              onSelect={this.onItemsSelected.bind(this)}
              data={users}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(item: User, selected: boolean) =>
                <UserComponent containerStyle={[style.userComponentContainer, selected && listItemCommonStyles.outlinedSelected]} user={item} selected={selected} navigation={this.props.navigation} />}
              refreshing={refreshing}
              manualRefresh={isModal ? null : this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('users.noUsers')}
            />
          </View>
        )}
      </Container>
    );
  }
}
