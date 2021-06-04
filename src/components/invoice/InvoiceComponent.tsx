import I18n from 'i18n-js';
import { Card, CardItem, Icon, Spinner } from 'native-base';
import React from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import I18nManager from '../../I18n/I18nManager';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';
import { BillingInvoice, BillingInvoiceStatus } from '../../types/Billing';
import { DataResult } from '../../types/DataResult';
import User from '../../types/User';
import Utils from '../../utils/Utils';
import Chip from '../chip/Chip';
import computeChipStyleSheet from '../chip/ChipStyle';
import computeStyleSheet from './InvoiceComponentStyles';
import Message from '../../utils/Message';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  invoice: BillingInvoice;
}

interface State {
  user: User;
  downloading: boolean;
}

export default class InvoiceComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private centralServerProvider: CentralServerProvider;

  public constructor(props: Props) {
    super(props);
    this.state = { user: null, downloading: false };
  }

  public async componentDidMount() {
    this.centralServerProvider = await ProviderFactory.getProvider();
    const user = await this.getUser();
    this.setState({ user });
  }

  public render() {
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { invoice, navigation } = this.props;
    const invoiceAmount = invoice.amount && invoice.amount / 100;
    const { user, downloading } = this.state;
    return (
      <Card style={style.invoiceContainer}>
        <CardItem style={style.invoiceContent}>
          <View style={[this.buildStatusIndicatorStyle(invoice.status), style.statusIndicator]} />
          <View style={style.invoiceInfosContainer}>
            <View style={style.leftContainer}>
              <View style={style.userInfosContainer}>
                <Text numberOfLines={1} style={[style.text, style.userName]}>
                  {Utils.buildUserName(user)}
                </Text>
                <Text numberOfLines={1} style={style.text}>
                  {user?.email}
                </Text>
              </View>
              <View style={style.invoiceDetailsContainer}>
                <View style={style.transactionContainer}>
                  <Text numberOfLines={1} style={[style.text, style.sessionsCount]}>
                    {invoice.sessions?.length}
                  </Text>
                  {invoice.sessions && (
                    <Text numberOfLines={1} style={style.text}>
                      {I18n.t('transactions.transactions')}
                    </Text>
                  )}
                </View>
                <Text numberOfLines={1} style={style.text}>
                  {invoice.number}
                </Text>
                <Text numberOfLines={1} style={style.text}>
                  {I18nManager.formatDateTime(invoice.createdOn)}
                </Text>
              </View>
            </View>
            <View style={style.rightContainer}>
              <View style={style.invoiceStatusContainer}>
                <Chip
                  statusStyle={[this.buildStatusStyle(invoice.status)]}
                  text={this.buildStatus(invoice.status)}
                  navigation={navigation}
                />
              </View>
              <View style={style.invoiceAmountContainer}>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.invoiceAmount]}>
                  {I18nManager.formatCurrency(invoiceAmount, invoice.currency)}
                </Text>
              </View>
              {invoice.downloadable && (
                <TouchableOpacity style={style.downloadButtonContainer} onPress={() => this.onPressDownload()}>
                  {downloading ? (
                    <ActivityIndicator size={scale(26)} color={commonColor.textColor} />
                  ) : (
                    <Icon style={style.downloadIcon} type={'Feather'} name={'download'} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CardItem>
      </Card>
    );
  }

  private async getUser(): Promise<User> {
    const { invoice } = this.props;
    const result: DataResult<User> = await this.centralServerProvider.getUsers({ UserID: invoice.userID });
    return result?.result?.[0];
  }

  private buildStatus(invoiceStatus: BillingInvoiceStatus): string {
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return I18n.t('invoiceStatus.draft');
      case BillingInvoiceStatus.OPEN:
        return I18n.t('invoiceStatus.unpaid');
      case BillingInvoiceStatus.PAID:
        return I18n.t('invoiceStatus.paid');
    }
  }

  private buildStatusStyle(invoiceStatus: BillingInvoiceStatus): ViewStyle {
    const chipStyle = computeChipStyleSheet();
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return chipStyle.default;
      case BillingInvoiceStatus.OPEN:
        return chipStyle.danger;
      case BillingInvoiceStatus.PAID:
        return chipStyle.success;
    }
  }

  private buildStatusIndicatorStyle(invoiceStatus: BillingInvoiceStatus): ViewStyle {
    const style = computeStyleSheet();
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return style.statusDraft;
      case BillingInvoiceStatus.OPEN:
        return style.statusUnpaid;
      case BillingInvoiceStatus.PAID:
        return style.statusPaid;
    }
  }

  private onPressDownload() {
    const invoice = this.props.invoice;
    const user = this.state.user;
    const invoiceDate = I18nManager.formatDateTime(invoice.createdOn);
    Alert.alert(
      I18n.t('invoices.downloadInvoiceTitle'),
      I18n.t('invoices.downloadInvoiceSubtitle', { user: Utils.buildUserName(user), invoiceDate }),
      [{ text: I18n.t('general.yes'), onPress: async () => this.downloadInvoice() }, { text: I18n.t('general.cancel') }]
    );
  }

  private async downloadInvoice() {
    const { invoice } = this.props;
    this.setState({ downloading: true });
    await this.centralServerProvider.downloadInvoice(invoice);
    Message.showSuccess(`${I18n.t('invoices.downloadedSuccessfully')}!`);
    this.setState({ downloading: false });
  }
}
