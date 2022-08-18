import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Icon, Spinner } from 'native-base';
import React, { createRef } from 'react';
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
import ItemsCompo from '../../components/list/testCompo/ItemsCompo';
import SelectableList from '../base-screen/SelectableList';

export interface Props extends BaseProps {}

interface State {
  deleteOperationsStates?: Record<string, boolean>;
}

export default class PaymentMethodsCompo extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private itemsRef = createRef<ItemsCompo<BillingPaymentMethod>>();

  public constructor(props: Props) {
    super(props);
    this.state = {
      deleteOperationsStates: {}
    };
  }

  public componentDidMount() {
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

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    return (
      <Container style={style.container}>
        <BaseAutoRefreshScreen navigation={navigation} refresh={this.itemsRef.current.manualRefresh} />
        <TouchableOpacity onPress={() => navigation.navigate('StripePaymentMethodCreationForm')} style={style.addPMContainer}>
          <Icon type={'MaterialIcons'} name={'add'} style={style.icon} />
        </TouchableOpacity>
        <ItemsCompo<BillingPaymentMethod>
          ref={this.itemsRef}
          headerTitle={I18n.t('sidebar.paymentMethods')}
          headerSubTitle={I18n.t('paymentMethods.paymentMethods')}
          renderItem={(paymentMethod: BillingPaymentMethod) => this.renderItem(paymentMethod, style)}
          getItems={this.getPaymentMethods.bind(this)}
          navigation={this.props.navigation}
          emptyTitle={I18n.t('paymentMethods.noPaymentMethod')}
        />
      </Container>
    );
  };

  private renderItem(paymentMethod: BillingPaymentMethod, style: any) {
    return (
      <Swipeable
        overshootRight={false}
        overshootLeft={false}
        containerStyle={style.swiperContainer}
        childrenContainerStyle={style.swiperChildrenContainer}
        renderRightActions={() => this.renderPaymentMethodRightActions(paymentMethod, style)}>
        <PaymentMethodComponent paymentMethod={paymentMethod} navigation={this.props.navigation} />
      </Swipeable>
    )
  }

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
