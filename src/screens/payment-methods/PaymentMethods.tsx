import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Icon, Spinner } from 'native-base';
import React from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';

import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import PaymentMethodComponent from '../../components/payment-method/PaymentMethodComponent';
import I18nManager from '../../I18n/I18nManager';
import BaseProps from '../../types/BaseProps';
import { BillingPaymentMethod } from '../../types/Billing';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './PaymentMethodsStyle';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Message from '../../utils/Message';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  paymentMethods?: BillingPaymentMethod[];
  skip?: number;
  limit?: number;
  count?: number;
  refreshing?: boolean;
  loading?: boolean;
  deleteOperationsStates?: Record<string, boolean>;
}

export default class PaymentMethods extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      paymentMethods: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true,
      deleteOperationsStates: {}
    };
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async getPaymentMethods(skip: number, limit: number): Promise<DataResult<BillingPaymentMethod>> {
    try {
      const currentUserID = this.centralServerProvider?.getUserInfo()?.id;
      const paymentMethods = await this.centralServerProvider.getPaymentMethods({ currentUserID }, { skip, limit });
      if (paymentMethods.count === -1) {
        // Request nbr of records
        const paymentMethodsNbrRecordsOnly = await this.centralServerProvider.getPaymentMethods(
          { currentUserID },
          Constants.ONLY_RECORD_COUNT
        );
        // Set
        paymentMethods.count = paymentMethodsNbrRecordsOnly.count;
      }
      return paymentMethods;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'paymentMethods.paymentMethodUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const paymentMethods = await this.getPaymentMethods(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        paymentMethods: paymentMethods ? [...prevState.paymentMethods, ...paymentMethods.result] : prevState.paymentMethods,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      this.setState({ refreshing: true });
      // Refresh All
      const paymentMethods = await this.getPaymentMethods(0, skip + limit);
      // Set
      this.setState({
        refreshing: false,
        loading: false,
        paymentMethods: paymentMethods ? paymentMethods.result : [],
        count: paymentMethods ? paymentMethods.count : 0
      });
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { paymentMethods, count, skip, limit, refreshing, loading } = this.state;
    const { navigation } = this.props;
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={I18n.t('sidebar.paymentMethods')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('paymentMethods.paymentMethods')}` : null}
          navigation={this.props.navigation}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        <TouchableOpacity onPress={() => navigation.navigate('StripePaymentMethodCreationForm')} style={style.addPMContainer}>
          <Icon type={'MaterialIcons'} name={'add'} style={style.icon} />
        </TouchableOpacity>
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<BillingPaymentMethod>
              data={paymentMethods}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(paymentMethod: BillingPaymentMethod) => (
                <Swipeable
                  overshootRight={false}
                  overshootLeft={false}
                  childrenContainerStyle={style.swiperChildrenContainer}
                  renderRightActions={() => this.renderPaymentMethodRightActions(paymentMethod, style)}>
                  <PaymentMethodComponent paymentMethod={paymentMethod} navigation={navigation} />
                </Swipeable>
              )}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('paymentMethods.noPaymentMethod')}
            />
          </View>
        )}
      </Container>
    );
  };

  private renderPaymentMethodRightActions(paymentMethod: BillingPaymentMethod, style: any) {
    const deleteInProgress = this.state.deleteOperationsStates?.[paymentMethod.id];
    const commonColors = Utils.getCurrentCommonColor();
    return (
      !paymentMethod.isDefault && (
        <TouchableOpacity
          disabled={deleteInProgress}
          style={style.trashIconButton}
          onPress={() => {
            this.deletePaymentMethodConfirm(paymentMethod);
          }}>
          {deleteInProgress ? (
            <ActivityIndicator size={scale(20)} color={commonColors.textColor} />
          ) : (
            <Icon style={style.trashIcon} name="trash" />
          )}
        </TouchableOpacity>
      )
    );
  }

  private deletePaymentMethodConfirm(paymentMethod: BillingPaymentMethod): void {
    Alert.alert(
      I18n.t('paymentMethods.deletePaymentMethodTitle'),
      I18n.t('paymentMethods.deletePaymentMethodSubtitle', { cardBrand: paymentMethod.brand, cardLast4: paymentMethod.last4 }),
      [
        {
          text: I18n.t('general.yes'),
          onPress: () => {
            this.deletePaymentMethod(paymentMethod.id as string);
          }
        },
        { text: I18n.t('general.cancel') }
      ]
    );
  }

  private async deletePaymentMethod(paymentMethodID: string): Promise<void> {
    const userID = this.centralServerProvider?.getUserInfo()?.id;
    this.setState({ deleteOperationsStates: { ...this.state.deleteOperationsStates, [paymentMethodID]: true } });
    try {
      // TODO check res data success (waiting for server change)
      await this.centralServerProvider.deletePaymentMethod(userID, paymentMethodID);
      Message.showSuccess(I18n.t('paymentMethods.deletePaymentMethodSuccess'));
    } catch (error) {
      // Check if HTTP?
      Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'paymentMethods.paymentMethodUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    } finally {
      delete this.state.deleteOperationsStates[paymentMethodID];
      this.setState(this.state, this.refresh.bind(this));
    }
  }
}
