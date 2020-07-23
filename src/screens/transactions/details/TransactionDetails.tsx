import I18n from 'i18n-js';
import moment from 'moment';
import { Container, Icon, Spinner, Text, Thumbnail, View } from 'native-base';
import React from 'react';
import { Image, ScrollView } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';

import noPhotoActive from '../../../../assets/no-photo-active.png';
import noPhoto from '../../../../assets/no-photo.png';
import noSite from '../../../../assets/no-site.png';
import I18nManager from '../../../I18n/I18nManager';
import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import Transaction from '../../../types/Transaction';
import User from '../../../types/User';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './TransactionDetailsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  transaction?: Transaction;
  userImage?: string;
  siteImage?: string;
  elapsedTimeFormatted?: string;
  totalInactivitySecs?: number;
  inactivityFormatted?: string;
  startTransactionNbTrial?: number;
  isPricingActive?: boolean;
  buttonDisabled?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  isSiteAdmin?: boolean;
}

export default class TransactionDetails extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      userImage: null,
      siteImage: null,
      isAdmin: false,
      isSiteAdmin: false,
      elapsedTimeFormatted: '-',
      totalInactivitySecs: 0,
      inactivityFormatted: '-',
      startTransactionNbTrial: 0,
      isPricingActive: false,
      buttonDisabled: true,
      refreshing: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    let siteImage = null;
    let userImage = null;
    // Get IDs
    const transactionID = Utils.getParamFromNavigation(this.props.navigation, 'transactionID', null);
    // Get Transaction
    const transaction = await this.getTransaction(transactionID);
    // Get the Site Image
    if (transaction && transaction.siteID && this.isMounted()) {
      siteImage = await this.getSiteImage(transaction.siteID);
    }
    // Get the User Image
    if (transaction && transaction.user && this.isMounted()) {
      userImage = await this.getUserImage(transaction.user);
    }
    // Compute Duration
    this.computeDurationInfos(transaction);
    // Get the provider
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    // Set
    this.setState({
      transaction,
      loading: false,
      siteImage,
      userImage,
      isAdmin: securityProvider ? securityProvider.isAdmin() : false,
      isSiteAdmin: securityProvider && transaction && transaction.siteID ? securityProvider.isSiteAdmin(transaction.siteID) : false,
      isPricingActive: securityProvider.isComponentPricingActive()
    });
  }

  public getTransaction = async (transactionID: string): Promise<Transaction> => {
    try {
      // Get Transaction
      const transaction = await this.centralServerProvider.getTransaction({ ID: transactionID });
      return transaction;
    } catch (error) {
      switch (error.request.status) {
        case HTTPError.OBJECT_DOES_NOT_EXIST_ERROR:
          Message.showError(I18n.t('transactions.transactionDoesNotExist'));
          break;
        default:
          Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
            'transactions.transactionUnexpectedError', this.props.navigation);
      }
    }
    return null;
  };

  public getSiteImage = async (siteID: string): Promise<string> => {
    try {
      const siteImage = await this.centralServerProvider.getSiteImage(siteID);
      return siteImage;
    } catch (error) {
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'sites.siteUnexpectedError', this.props.navigation);
    }
    return null;
  };

  public getUserImage = async (user: User): Promise<string> => {
    try {
      const userImage = await this.centralServerProvider.getUserImage({ ID: user.id });
      return userImage;
    } catch (error) {
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'users.userUnexpectedError', this.props.navigation);
    }
    return null;
  };

  public computeDurationInfos = (transaction: Transaction) => {
    if (transaction) {
      // Compute duration
      const elapsedTimeFormatted = Utils.formatDurationHHMMSS(
        ((new Date(transaction.stop.timestamp).getTime() - new Date(transaction.timestamp).getTime()) / 1000), false);
      // Compute inactivity
      const totalInactivitySecs = transaction.stop.totalInactivitySecs +
        (transaction.stop.extraInactivitySecs ? transaction.stop.extraInactivitySecs : 0);
      const inactivityFormatted = Utils.formatDurationHHMMSS(totalInactivitySecs, false);
      // Set
      this.setState({
        totalInactivitySecs,
        elapsedTimeFormatted,
        inactivityFormatted
      });
    } else {
      // Set
      this.setState({
        totalInactivitySecs: 0,
        elapsedTimeFormatted: Constants.DEFAULT_DURATION,
        inactivityFormatted: Constants.DEFAULT_DURATION
      });
    }
  };

  public renderUserInfo = (style: any) => {
    const { transaction, isAdmin, isSiteAdmin } = this.state;
    const { userImage } = this.state;
    return transaction ? (
      <View style={style.columnContainer}>
        <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhotoActive} />
        <Text numberOfLines={1} style={[style.label, style.labelUser, style.info]}>
          {Utils.buildUserName(transaction.user)}
        </Text>
        {(isAdmin || isSiteAdmin) && <Text style={[style.subLabel, style.subLabelUser, style.info]}>({transaction.tagID})</Text>}
      </View>
    ) : (
        <View style={style.columnContainer}>
          <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhoto} />
          <Text style={[style.label, style.disabled]}>-</Text>
        </View>
      );
  };

  public renderPrice = (style: any) => {
    const { transaction } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon type='FontAwesome' name='money' style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>{transaction ? I18nManager.formatCurrency(transaction.stop.price) : '-'}</Text>
        <Text style={[style.subLabel, style.info]}>({transaction ? transaction.priceUnit : '-'})</Text>
      </View>
    );
  };

  public renderElapsedTime = (style: any) => {
    const { elapsedTimeFormatted } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon type='MaterialIcons' name='timer' style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>{elapsedTimeFormatted}</Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t('details.duration')}</Text>
      </View>
    );
  };

  public renderInactivity = (style: any) => {
    const { transaction } = this.state;
    const { inactivityFormatted } = this.state;
    const inactivityStyle = Utils.computeInactivityStyle(transaction ? transaction.stop.inactivityStatus : null);
    return (
      <View style={style.columnContainer}>
        <Icon type='MaterialIcons' name='timer-off' style={[style.icon, inactivityStyle]} />
        <Text style={[style.label, style.labelValue, inactivityStyle]}>{inactivityFormatted}</Text>
        <Text style={[style.subLabel, inactivityStyle]}>{I18n.t('details.duration')}</Text>
      </View>
    );
  };

  public renderTotalConsumption = (style: any) => {
    const { transaction } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon style={[style.icon, style.info]} type='MaterialIcons' name='ev-station' />
        <Text style={[style.label, style.labelValue, style.info]}>{transaction ? I18nManager.formatNumber(Math.round(transaction.stop.totalConsumptionWh / 10) / 100) : '-'}</Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t('details.total')} (kW.h)</Text>
      </View>
    );
  };

  public renderBatteryLevel = (style: any) => {
    const { transaction } = this.state;
    return transaction && transaction.stateOfCharge ? (
      <View style={style.columnContainer}>
        <Icon type='MaterialIcons' name='battery-charging-full' style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>{transaction.stateOfCharge} {'>'} {transaction.stop.stateOfCharge}</Text>
        <Text style={[style.subLabel, style.info]}>(%)</Text>
      </View>
    ) : (
        <View style={style.columnContainer}>
          <Icon type='MaterialIcons' name='battery-charging-full' style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      );
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { transaction } = this.state;
    const { loading, siteImage, isPricingActive } = this.state;
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(transaction ? transaction.connectorId : null);
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
          <Container style={style.container}>
            <HeaderComponent
              navigation={this.props.navigation}
              title={transaction ? transaction.chargeBoxID : I18n.t('connector.unknown')}
              subTitle={`(${I18n.t('details.connector')} ${connectorLetter})`}
              leftAction={() => this.onBack()}
              leftActionIcon={'navigate-before'}
              rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
              rightActionIcon={'menu'}
            />
            {/* Site Image */}
            <Image style={style.backgroundImage} source={siteImage ? { uri: siteImage } : noSite} />
            <View style={style.headerContent}>
              <View style={style.headerRowContainer}>
                <Text style={style.headerName}>{transaction ? moment(new Date(transaction.timestamp)).format('LLL') : ''}</Text>
                <Text style={style.subHeaderName}>({transaction ? moment(new Date(transaction.stop.timestamp)).format('LLL') : ''})</Text>
                {(transaction.userID !== transaction.stop.userID) &&
                  <Text style={style.subSubHeaderName}>({I18n.t('details.stoppedBy')} {Utils.buildUserName(transaction.stop.user)})</Text>
                }
              </View>
            </View>
            <ScrollView contentContainerStyle={style.scrollViewContainer}>
              <View style={style.rowContainer}>
                {this.renderUserInfo(style)}
                {this.renderTotalConsumption(style)}
              </View>
              <View style={style.rowContainer}>
                {this.renderElapsedTime(style)}
                {this.renderInactivity(style)}
              </View>
              <View style={style.rowContainer}>
                {this.renderBatteryLevel(style)}
                {isPricingActive ? this.renderPrice(style) : <View style={style.columnContainer} />}
              </View>
            </ScrollView>
          </Container>
        )
    );
  }
}
