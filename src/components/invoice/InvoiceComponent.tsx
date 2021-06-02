import React, { useEffect, useState } from 'react';
import BaseProps from '../../types/BaseProps';
import { BillingInvoice, BillingInvoiceStatus } from '../../types/Billing';
import { Text, TouchableOpacity, View } from 'react-native';
import computeStyleSheet from './InvoiceComponentStyles';
import computeChipStyleSheet from '../chip/ChipStyle';
import I18nManager from '../../I18n/I18nManager';
import I18n from 'i18n-js';
import Chip from '../chip/Chip';
import ProviderFactory from '../../provider/ProviderFactory';
import User from '../../types/User';
import { DataResult } from '../../types/DataResult';
import { Card, CardItem, Icon } from 'native-base';
import Utils from '../../utils/Utils';

export interface Props extends BaseProps {
  invoice: BillingInvoice;
}

export default function InvoiceComponent(props: Props) {
  const { invoice, navigation } = props;
  const style = computeStyleSheet();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    async function setUp(): Promise<void> {
      const centralServerProvider = await ProviderFactory.getProvider();
      const result: DataResult<User> = await centralServerProvider.getUsers({ UserID: invoice.userID });
      const fetchedUser = result?.result?.[0];
      setUser(fetchedUser);
    }
    try {
      setUp();
    } catch (error) {
      console.error(I18n.t('invoices.invoicesUnexpectedError'), error);
    }
  }, [invoice.userID]);

  const buildStatus = (invoiceStatus: BillingInvoiceStatus) => {
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return I18n.t('invoiceStatus.draft');
      case BillingInvoiceStatus.OPEN:
        return I18n.t('invoiceStatus.unpaid');
      case BillingInvoiceStatus.PAID:
        return I18n.t('invoiceStatus.paid');
    }
  };

  const buildStatusStyle = (invoiceStatus: BillingInvoiceStatus) => {
    const chipStyle = computeChipStyleSheet();
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return chipStyle.default;
      case BillingInvoiceStatus.OPEN:
        return chipStyle.danger;
      case BillingInvoiceStatus.PAID:
        return chipStyle.success;
    }
  };

  const buildStatusIndicatorStyle = (invoiceStatus: BillingInvoiceStatus) => {
    switch (invoiceStatus) {
      case BillingInvoiceStatus.DRAFT:
        return style.statusDraft;
      case BillingInvoiceStatus.OPEN:
        return style.statusUnpaid;
      case BillingInvoiceStatus.PAID:
        return style.statusPaid;
    }
  };

  return (
    <Card style={style.invoiceContainer}>
      <CardItem style={style.invoiceContent}>
        <View style={[buildStatusIndicatorStyle(invoice.status), style.statusIndicator]} />
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
                <Text numberOfLines={1} style={style.text}>
                  {invoice.sessions?.length}
                </Text>
                {invoice.sessions && (
                  <Text numberOfLines={1} style={style.text}>
                    {' '}
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
              <Chip statusStyle={[buildStatusStyle(invoice.status)]} text={buildStatus(invoice.status)} navigation={navigation} />
            </View>
            <View style={style.invoiceAmountContainer}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.invoiceAmount]}>
                {I18nManager.formatCurrency(invoice.amount, invoice.currency)}
              </Text>
            </View>
            {invoice.downloadable && (
              <TouchableOpacity style={style.downloadButtonContainer}>
                <Icon style={style.downloadIcon} type={'Feather'} name={'download'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CardItem>
    </Card>
  );
}
