import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import { ActivityIndicator, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-matters';

import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import PaymentMethodComponent from '../../components/payment-method/PaymentMethodComponent';
import BaseProps from '../../types/BaseProps';
import { BillingPaymentMethod } from '../../types/Billing';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import computeStyleSheet from './PaymentMethodsStyle';
import { BillingSettings } from '../../types/Setting';
import SelectableList, { SelectableState } from '../base-screen/SelectableList';
import DialogModal from '../../components/modal/DialogModal';
import computeModalCommonStyles from '../../components/modal/ModalCommonStyle';
import computeFabStyles from '../../components/fab/FabComponentStyles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Props extends BaseProps {}

interface State extends SelectableState<BillingPaymentMethod> {
  paymentMethods?: BillingPaymentMethod[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
  deleteOperationsStates?: Record<string, boolean>;
  billingSettings?: BillingSettings;
  paymentMethodToBeDeleted?: BillingPaymentMethod;
}

export default class PaymentMethods extends SelectableList<BillingPaymentMethod> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.singleItemTitle = I18n.t('paymentMethods.paymentMethod');
    this.multiItemsTitle = I18n.t('paymentMethods.paymentMethods');
    this.state = {
      paymentMethods: [],
      selectedItems: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true,
      deleteOperationsStates: {},
      paymentMethodToBeDeleted: null
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    const billingSettings: BillingSettings = await this.centralServerProvider.getBillingSettings();
    if (billingSettings) {
      this.setState({ billingSettings }, this.refresh);
    }
  }

  public async componentDidFocus() {
    super.componentDidFocus();
    this.setState({ refreshing: true });
    await this.refresh();
  }

  public async getPaymentMethods(skip: number, limit: number): Promise<DataResult<BillingPaymentMethod>> {
    try {
      const params = {
        currentUserID: this.centralServerProvider?.getUserInfo()?.id
      };
      const paymentMethods = await this.centralServerProvider.getPaymentMethods(params, { skip, limit });
      // Get total number of records
      if (paymentMethods?.count === -1) {
        const paymentMethodsNbrRecordsOnly = await this.centralServerProvider.getPaymentMethods(params, Constants.ONLY_RECORD_COUNT);
        paymentMethods.count = paymentMethodsNbrRecordsOnly?.count;
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
    const { paymentMethods, count, skip, limit, refreshing, loading, billingSettings, paymentMethodToBeDeleted } = this.state;
    const { navigation } = this.props;
    const fabStyles = computeFabStyles();
    return (
      <View style={style.container}>
        {billingSettings?.stripe?.publicKey && (
          <SafeAreaView style={fabStyles.fabContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('StripePaymentMethodCreationForm', { billingSettings })} style={fabStyles.fab}>
              <Icon as={MaterialCommunityIcons} size={scale(18)} name={'plus'} style={fabStyles.fabIcon} />
            </TouchableOpacity>
          </SafeAreaView>
        )}
        <HeaderComponent
          title={this.buildHeaderTitle()}
          subTitle={this.buildHeaderSubtitle()}
          sideBar={this.canOpenDrawer}
          navigation={this.props.navigation}
          containerStyle={style.headerContainer}
        />
        {paymentMethodToBeDeleted && this.renderDeletePaymentMethodDialog(paymentMethodToBeDeleted)}
        {loading ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
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
                  containerStyle={style.paymentMethodContainer}
                  childrenContainerStyle={style.paymentMethodItemContainer}
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
      </View>
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
            this.setState({ paymentMethodToBeDeleted: paymentMethod });
          }}>
          {deleteInProgress ? (
            <ActivityIndicator size={scale(20)} color={commonColors.textColor} />
          ) : (
            <Icon size={scale(23)} as={MaterialCommunityIcons} style={style.trashIcon} name="trash-can" />
          )}
        </TouchableOpacity>
      )
    );
  }

  private renderDeletePaymentMethodDialog(paymentMethod: BillingPaymentMethod) {
    const modalCommonStyle = computeModalCommonStyles();
    return (
      <DialogModal
        onBackDropPress={() => null}
        withCloseButton={true}
        close={() => this.setState({ paymentMethodToBeDeleted: null })}
        withCancel={true}
        title={I18n.t('paymentMethods.deletePaymentMethodTitle')}
        description={I18n.t('paymentMethods.deletePaymentMethodSubtitle', {
          cardBrand: paymentMethod.brand,
          cardLast4: paymentMethod.last4
        })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton,
            action: async () => this.deletePaymentMethod(paymentMethod.id as string)
          }
        ]}
      />
    );
  }

  private async deletePaymentMethod(paymentMethodID: string): Promise<void> {
    const userID = this.centralServerProvider?.getUserInfo()?.id;
    this.setState({
      paymentMethodToBeDeleted: null,
      deleteOperationsStates: { ...this.state.deleteOperationsStates, [paymentMethodID]: true }
    });
    try {
      const res = await this.centralServerProvider.deletePaymentMethod(userID, paymentMethodID);
      if (res?.succeeded) {
        Message.showSuccess(I18n.t('paymentMethods.deletePaymentMethodSuccess'));
      } else {
        Message.showError(I18n.t('paymentMethods.paymentMethodUnexpectedError'));
      }
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
