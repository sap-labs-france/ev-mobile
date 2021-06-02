import { DrawerActions } from '@react-navigation/native';
import i18n from 'i18n-js';
import { Container, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../components/header/HeaderComponent';
import InvoiceComponent from '../../components/invoice/InvoiceComponent';
import ItemsList from '../../components/list/ItemsList';
import I18nManager from '../../I18n/I18nManager';
import BaseProps from '../../types/BaseProps';
import { BillingInvoice, BillingInvoiceStatus } from '../../types/Billing';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../transactions/TransactionsStyles';

export interface Props extends BaseProps {}

interface State {
  invoices?: BillingInvoice[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
}

export default class Invoices extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      invoices: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async getInvoices(skip: number, limit: number): Promise<DataResult<BillingInvoice>> {
    try {
      const invoices = await this.centralServerProvider.getInvoices({}, { skip, limit });
      if (invoices.count === -1) {
        // Request nbr of records
        const invoicesNbrRecordsOnly = await this.centralServerProvider.getInvoices({}, Constants.ONLY_RECORD_COUNT);
        // Set
        invoices.count = invoicesNbrRecordsOnly.count;
      }
      return invoices;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
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
      const invoices = await this.getInvoices(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        invoices: invoices ? [...prevState.invoices, ...invoices.result] : prevState.invoices,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const invoices = await this.getInvoices(0, skip + limit);
      // Set
      this.setState({
        loading: false,
        invoices: invoices ? invoices.result : [],
        count: invoices ? invoices.count : 0
      });
    }
  }

  public render() {
    const { invoices, loading, skip, limit, refreshing, count } = this.state;
    const { navigation } = this.props;
    const style = computeStyleSheet();
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={i18n.t('sidebar.invoices')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${i18n.t('invoices.invoices')}` : null}
          navigation={this.props.navigation}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<BillingInvoice>
              data={invoices}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(invoice: BillingInvoice) => <InvoiceComponent navigation={navigation} invoice={invoice} />}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={i18n.t('invoices.noInvoices')}
            />
          </View>
        )}
      </Container>
    );
  }
}
