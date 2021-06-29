import I18n from 'i18n-js';
import { Card, CardItem, Icon } from 'native-base';
import React from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';

import I18nManager from '../../I18n/I18nManager';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';
import { BillingInvoice, BillingInvoiceStatus } from '../../types/Billing';
import User from '../../types/User';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import Chip from '../chip/Chip';
import computeChipStyleSheet from '../chip/ChipStyle';
import computeStyleSheet from './InvoiceComponentStyles';

export interface Props extends BaseProps {
  invoice: BillingInvoice;
}

interface State {
  downloading: boolean;
}

export default class InvoiceComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private centralServerProvider: CentralServerProvider;

  public constructor(props: Props) {
    super(props);
    this.state = {
      downloading: false
    };
  }

  public async componentDidMount() {
    this.centralServerProvider = await ProviderFactory.getProvider();
  }

  public render() {
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { invoice, navigation } = this.props;
    const invoiceAmount = invoice.amount && invoice.amount / 100;
    const { downloading } = this.state;
    return (
      <Card style={style.container}>
        <CardItem style={style.invoiceContent}>
          <View style={[this.buildStatusIndicatorStyle(invoice.status, style), style.statusIndicator]} />
          <View style={style.invoiceContainer}>
            <View style={style.leftContainer}>
              <View style={style.invoiceDetailsContainer}>
                <Text numberOfLines={1} style={[style.text, style.invoiceCreatedOn]}>
                  {I18nManager.formatDateTime(invoice.createdOn)}
                </Text>
                <Text numberOfLines={1} style={style.text}>
                  {invoice.number}
                </Text>
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
              </View>
              {invoice.user && (
                <View style={style.userContainer}>
                  <Text numberOfLines={1} style={[style.text, style.userName]}>
                    {Utils.buildUserName(invoice.user)}
                  </Text>
                  <Text numberOfLines={1} style={style.text}>
                    {invoice.user.email}
                  </Text>
                </View>
              )}
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
                <TouchableOpacity style={style.downloadButtonContainer} onPress={() => this.downloadInvoiceConfirm()}>
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

  private buildStatus(invoiceStatus: BillingInvoiceStatus): string {
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return I18n.t('invoiceStatus.draft');
      case BillingInvoiceStatus.OPEN:
        return I18n.t('invoiceStatus.unpaid');
      case BillingInvoiceStatus.PAID:
        return I18n.t('invoiceStatus.paid');
      case BillingInvoiceStatus.VOID:
        return I18n.t('invoiceStatus.void');
      case BillingInvoiceStatus.DELETED:
        return I18n.t('invoiceStatus.deleted');
      case BillingInvoiceStatus.UNCOLLECTIBLE:
        return I18n.t('invoiceStatus.uncollectible');
    }
  }

  private buildStatusStyle(invoiceStatus: BillingInvoiceStatus): ViewStyle {
    const chipStyle = computeChipStyleSheet();
    switch (invoiceStatus) {
      case BillingInvoiceStatus.OPEN:
      case BillingInvoiceStatus.UNCOLLECTIBLE:
        return chipStyle.danger;
      case BillingInvoiceStatus.DELETED:
      case BillingInvoiceStatus.VOID:
        return chipStyle.warning;
      case BillingInvoiceStatus.PAID:
        return chipStyle.success;
      default:
        return chipStyle.default;
    }
  }

  private buildStatusIndicatorStyle(invoiceStatus: BillingInvoiceStatus, style: any): ViewStyle {
    switch (invoiceStatus) {
      case BillingInvoiceStatus.OPEN:
      case BillingInvoiceStatus.UNCOLLECTIBLE:
        return style.statusOpenOrUncollectible;
      case BillingInvoiceStatus.DELETED:
      case BillingInvoiceStatus.VOID:
        return style.statusDeletedOrVoid;
      case BillingInvoiceStatus.PAID:
        return style.statusPaid;
      default:
        return style.statusDefault;
    }
  }

  private downloadInvoiceConfirm() {
    const { invoice } = this.props;
    const invoiceDate = I18nManager.formatDateTime(invoice.createdOn);
    Alert.alert(
      I18n.t('invoices.downloadInvoiceTitle'),
      I18n.t('invoices.downloadInvoiceSubtitle', { user: Utils.buildUserName(invoice.user), invoiceDate }),
      [
        { text: I18n.t('general.yes'), onPress: async () => this.downloadInvoice() },
        { text: I18n.t('general.cancel') }
      ]
    );
  }

  private async downloadInvoice() {
    const { invoice } = this.props;
    this.setState({ downloading: true });
    try {
      await this.centralServerProvider.downloadInvoice(invoice);
      Message.showSuccess(`${I18n.t('invoices.downloadedSuccessfully')}!`);
    } catch (error) {
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'paymentMethods.paymentMethodUnexpectedError',
        this.props.navigation
      );
    } finally {
      this.setState({ downloading: false });
    }
  }
}
