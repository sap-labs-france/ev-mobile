import I18n from 'i18n-js';
import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

import Amex from '../../../assets/payment-methods/amex.svg';
import DinersClub from '../../../assets/payment-methods/diners.svg';
import Discover from '../../../assets/payment-methods/discover.svg';
import Jcb from '../../../assets/payment-methods/jcb.svg';
import MasterCard from '../../../assets/payment-methods/mastercard.svg';
import UnionPay from '../../../assets/payment-methods/unionpay.svg';
import Visa from '../../../assets/payment-methods/visa.svg';
import BaseProps from '../../types/BaseProps';
import { BillingPaymentMethod, BillingPaymentMethodStatus, StripePaymentMethodBrands } from '../../types/Billing';
import Utils from '../../utils/Utils';
import computeStyleSheet from './PaymentMethodComponentStyle';

export interface Props extends BaseProps {
  paymentMethod: BillingPaymentMethod;
}

interface State {}

export default class PaymentMethodComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { paymentMethod } = this.props;
    const style = computeStyleSheet();
    const expirationDate = moment(paymentMethod.expiringOn).format('MM/YYYY');
    const status = Utils.buildPaymentMethodStatus(paymentMethod);
    const statusStyle = this.buildStatusStyle(status, style);
    const paymentMethodType = I18n.t('paymentMethodType.card');
    return (
      <View style={style.paymentMethodContainer}>
        <View style={style.paymentMethodLogoContainer}>{this.renderPaymentMethodLogo(paymentMethod.brand, style)}</View>
        <View style={style.paymentMethodDetailsContainer}>
          <View style={style.cardNumberContainer}>
            {[...Array(12)].map((el, index: number) => (
              <View key={index} style={{ flexDirection: 'row' }}>
                <View style={[style.maskCharacter, (index + 1) % 4 === 0 && style.maskCharacterSpace]} />
              </View>
            ))}
            <Text style={style.text}>{paymentMethod.last4} </Text>
            {paymentMethod.isDefault && (
              <View style={style.defaultContainer}>
                <Text style={style.badgeText}>{I18n.t('general.default')}</Text>
              </View>
            )}
          </View>
          <View style={style.expirationDateContainer}>
            <Text style={style.text}>{expirationDate}</Text>
            <View style={[style.status, statusStyle]}>
              <Text style={style.badgeText}>{I18n.t(`paymentMethodStatus.${status}`)}</Text>
            </View>
          </View>
          <Text style={style.text}>{paymentMethodType}</Text>
        </View>
      </View>
    );
  }

  private renderPaymentMethodLogo(brand: string, style: any) {
    switch (brand) {
      case StripePaymentMethodBrands.AMEX:
        return <Amex width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.DINERS_CLUB:
        return <DinersClub width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.DISCOVER:
        return <Discover width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.JCB:
        return <Jcb width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.MASTERCARD:
        return <MasterCard width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.UNION_PAY:
        return <UnionPay width={style.cardSVG.width} height={style.cardSVG.height} />;
      case StripePaymentMethodBrands.VISA:
        return <Visa width={style.cardSVG.width} height={style.cardSVG.height} />;
      // TODO add case for carte bancaire
      default:
        return null;
    }
  }

  private buildStatusStyle(status: BillingPaymentMethodStatus, style: any) {
    switch (status) {
      case BillingPaymentMethodStatus.EXPIRED:
        return style.paymentMethodExpired;
      case BillingPaymentMethodStatus.EXPIRING_SOON:
        return style.paymentMethodExpiringSoon;
      case BillingPaymentMethodStatus.VALID:
        return style.paymentMethodValid;
      default:
        return null;
    }
  }
}
