import { default as I18n } from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

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
import UsersFilters, { UsersFiltersDef } from './UsersFilters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends SelectableProps<User> {
  filters?: UsersFiltersDef
}

export interface State extends SelectableState<User> {
  users?: User[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
  filters?: UsersFiltersDef;
}

export default class Users extends SelectableList<User> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE,
    isModal: false
  };
  public state: State;
  public props: Props;
  private searchText: string;

  public constructor(props: Props) {
    super(props);
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

  public async getUsers(searchText: string, skip: number, limit: number): Promise<DataResult<User>> {
    try {
      const issuer = this.props?.filters?.hasOwnProperty('issuer') ? this.props.filters.issuer : !this.state.filters?.issuer;
      const params = {
        Search: searchText,
        Issuer: issuer
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
      return null;
    }
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

  public async refresh(showSpinner = false): Promise<void> {
    if (this.isMounted()) {
      const newState = showSpinner ? {...(Utils.isEmptyArray(this.state.users) ? {loading: true} : {refreshing: true})} : this.state;
      this.setState(newState, async () => {
        const { skip, limit } = this.state;
        const { isModal, onContentUpdated } = this.props;
        // Refresh All
        const users = await this.getUsers(this.searchText, 0, skip + limit);
        const usersResult = users ? users.result : [];
        // Set
        this.setState({
          loading: false,
          refreshing: false,
          users: usersResult,
          count: users?.count ?? 0
        }, isModal ? () => onContentUpdated() : () => null);
      });
    }
  }

  public async search (searchText: string): Promise<void> {
    this.searchText = searchText;
    await this.refresh(true);
  };

  public render(): React.ReactElement {
    const style = computeStyleSheet();
    const listItemCommonStyles = computeListItemCommonStyles();
    const { users, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, isModal, selectionMode } = this.props;
    return (
      <View style={style.container}>
        {!isModal && (
          <HeaderComponent
            title={this.buildHeaderTitle()}
            subTitle={this.buildHeaderSubtitle()}
            modalized={isModal}
            sideBar={!isModal && this.canOpenDrawer}
            navigation={this.props.navigation}
            displayTenantLogo={false}
            containerStyle={style.headerContainer}
          />
        )}
        {this.renderFilters()}
        {loading ? <Spinner size={scale(30)} style={style.spinner} color="grey" /> : (
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
              manualRefresh={isModal ? null : this.manualRefresh.bind(this)}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('users.noUsers')}
            />
          </View>
        )}
      </View>
    );
  }

  private onFiltersChanged(newFilters: UsersFiltersDef): void {
    this.setState({ filters: newFilters }, () => this.refresh(true));
  }

  private renderFilters(): React.ReactElement {
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    const { isModal } = this.props;
    const style = computeStyleSheet();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={style.filtersContainer}>
        {!isModal && (
          <UsersFilters
            onFilterChanged={(newFilters: UsersFiltersDef) => this.onFiltersChanged(newFilters)}
            ref={(usersFilters: UsersFilters) => this.setScreenFilters(usersFilters, false)}
          />
        )}
        <SimpleSearchComponent containerStyle={style.searchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        {!isModal && this.screenFilters?.canFilter() && (
          <TouchableOpacity onPress={() => this.screenFilters?.openModal()}  style={style.filterButton}>
            <Icon size={scale(25)} color={commonColors.textColor} as={MaterialCommunityIcons} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
