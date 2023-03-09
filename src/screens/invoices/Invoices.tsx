import i18n from 'i18n-js';
import React from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../components/header/HeaderComponent';
import InvoiceComponent from '../../components/invoice/InvoiceComponent';
import ItemsList from '../../components/list/ItemsList';
import I18nManager from '../../I18n/I18nManager';
import BaseScreen from '../../screens/base-screen/BaseScreen';
import BaseProps from '../../types/BaseProps';
import { BillingInvoice } from '../../types/Billing';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import computeStyleSheet from './InvoicesStyles';
import InvoicesFilters, { InvoicesFiltersDef } from './InvoicesFilters';
import { Spinner } from 'native-base';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  invoices?: BillingInvoice[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  filters?: InvoicesFiltersDef;
}

export default class Invoices extends BaseScreen<Props, State> {
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
      count: 0,
      filters: {}
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    // When filters are enabled, first refresh is triggered via onFiltersChanged
    if (!this.screenFilters) {
      this.refresh(true);
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async getInvoices(skip: number, limit: number): Promise<DataResult<BillingInvoice>> {
    try {
      const params = {
        UserID: this.state.filters?.users?.map(user => user.id).join('|')
      }
      // Get the invoices
      const invoices = await this.centralServerProvider.getInvoices(params, { skip, limit }, ['-createdOn']);
      // Get total number of records
      if (invoices?.count === -1) {
        const invoicesNbrRecordsOnly = await this.centralServerProvider.getInvoices({}, Constants.ONLY_RECORD_COUNT);
        invoices.count = invoicesNbrRecordsOnly?.count;
      }
      return invoices;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'invoices.invoiceUnexpectedError',
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
      const invoices = await this.getInvoices(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        invoices: invoices ? [...prevState.invoices, ...invoices.result] : prevState.invoices,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async refresh(showSpinner = false): Promise<void> {
    if (this.isMounted()) {
      const newState = showSpinner ? (Utils.isEmptyArray(this.state.invoices) ? {loading: true} : {refreshing: true}) : this.state;
      this.setState(newState, async () => {
        const { skip, limit } = this.state;
        // Refresh All
        const invoices = await this.getInvoices(0, skip + limit);
        // Set
        this.setState({
          loading: false,
          refreshing: false,
          invoices: invoices ? invoices.result : [],
          count: invoices ? invoices.count : 0
        });
      });
    }
  }

  private onFilterChanged(newFilters: InvoicesFiltersDef): void {
    this.setState({ filters: newFilters }, () => this.refresh(true));
  }

  private manualRefresh() {
    this.refresh(true);
  }

  public render() {
    const { invoices, loading, skip, limit, refreshing, count } = this.state;
    const { navigation } = this.props;
    const style = computeStyleSheet();
    return (
      <View style={style.container}>
        <HeaderComponent
          title={i18n.t('sidebar.invoices')}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)})` : null}
          navigation={this.props.navigation}
          sideBar={this.canOpenDrawer}
          ref={(headerComponent: HeaderComponent) => this.setHeaderComponent(headerComponent, true)}
          containerStyle={style.headerContainer}
        />
        <InvoicesFilters
          onFilterChanged={(newFilters) => this.onFilterChanged(newFilters)}
          ref={(invoicesFilters: InvoicesFilters) => this.setScreenFilters(invoicesFilters, true)}
        />
          {loading ? <Spinner size={scale(30)} style={style.spinner} color="grey" /> : (
          <View style={style.content}>
            <ItemsList<BillingInvoice>
              data={invoices}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(invoice: BillingInvoice) => <InvoiceComponent containerStyle={[style.invoiceComponentContainer]} navigation={navigation} invoice={invoice} />}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh.bind(this)}
              onEndReached={this.onEndScroll}
              emptyTitle={i18n.t('invoices.noInvoices')}
            />
          </View>
        )}
      </View>
    );
  }
}
