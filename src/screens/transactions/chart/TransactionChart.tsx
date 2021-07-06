import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Spinner, Text } from 'native-base';
import React from 'react';
import { View, processColor } from 'react-native';
import { LineChart, LineChartProps } from 'react-native-charts-wrapper';
import { scale } from 'react-native-size-matters';

import HeaderComponent from '../../../components/header/HeaderComponent';
import TransactionHeaderComponent from '../../../components/transaction/header/TransactionHeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { Connector } from '../../../types/ChargingStation';
import Consumption from '../../../types/Consumption';
import { HTTPAuthError } from '../../../types/HTTPError';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './TransactionChartStyles';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  chargingStation?: ChargingStation;
  connector?: Connector;
  transaction?: Transaction;
  values?: Consumption[];
  consumptionValues?: ChartPoint[];
  stateOfChargeValues?: ChartPoint[];
  showTransactionDetails?: boolean;
  canDisplayTransaction?: boolean;
  isAdmin: boolean;
  isSiteAdmin?: boolean;
}

interface ChartPoint {
  x: number;
  y: number;
}

export default class TransactionChart extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      isAdmin: false,
      isSiteAdmin: false,
      transaction: null,
      values: [],
      canDisplayTransaction: false,
      consumptionValues: null,
      stateOfChargeValues: null,
      showTransactionDetails: false
    };
    // Set Refresh
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  // eslint-disable-next-line complexity
  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
      const connectorID = Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string;
      const transactionID = Utils.getParamFromNavigation(this.props.route, 'transactionID', null) as string;
      let transactionWithConsumptions = null;
      let chargingStation = null;
      let connector = null;
      // Get Transaction and chargingStation
      if (transactionID) {
        transactionWithConsumptions = await this.getTransactionWithConsumptions(Utils.convertToInt(transactionID));
        if (transactionWithConsumptions && transactionWithConsumptions.transaction) {
          chargingStation = await this.getChargingStation(transactionWithConsumptions.transaction.chargeBoxID);
          if (chargingStation) {
            connector = chargingStation ? chargingStation.connectors[transactionWithConsumptions.transaction.connectorId - 1] : null;
          }
        }
        // Get chargingStation and Transaction
      } else if (chargingStationID) {
        // Get chargingStation
        chargingStation = await this.getChargingStation(chargingStationID);
        if (chargingStation) {
          connector = chargingStation ? chargingStation.connectors[Utils.convertToInt(connectorID) - 1] : null;
          // Refresh Consumption
          if (connector.currentTransactionID && (!this.state.transaction || !this.state.transaction.stop)) {
            transactionWithConsumptions = await this.getTransactionWithConsumptions(connector.currentTransactionID);
          }
        }
      }
      // Set
      this.setState({
        loading: false,
        transaction: transactionWithConsumptions ? transactionWithConsumptions.transaction : this.state.transaction,
        chargingStation: !this.state.chargingStation ? chargingStation : this.state.chargingStation,
        connector,
        isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
        isSiteAdmin:
          this.securityProvider && chargingStation?.siteArea ? this.securityProvider?.isSiteAdmin(chargingStation.siteArea.siteID) : false,
        canDisplayTransaction: chargingStation ? this.securityProvider?.canReadTransaction() : false,
        ...transactionWithConsumptions
      });
    }
  };

  public getChargingStation = async (chargingStationID: string): Promise<ChargingStation> => {
    try {
      // Get chargingStation
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID);
      return chargingStation;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'chargers.chargerUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return null;
  };

  public getTransactionWithConsumptions = async (
    transactionID: number
  ): Promise<{ transaction: Transaction; values: Consumption[]; consumptionValues: ChartPoint[]; stateOfChargeValues: ChartPoint[] }> => {
    try {
      // Active Transaction?
      if (transactionID) {
        // Get the consumption
        const transaction = await this.centralServerProvider.getTransactionConsumption(transactionID);
        // At least 2 values for the chart!!!
        if (transaction.values && transaction.values.length > 1) {
          // Add last point
          if (transaction.values.length > 0) {
            transaction.values.push({
              ...transaction.values[transaction.values.length - 1],
              startedAt: transaction.values[transaction.values.length - 1].endedAt
            });
          }
          // Convert
          const consumptionValues: ChartPoint[] = [];
          const stateOfChargeValues: ChartPoint[] = [];
          for (const value of transaction.values) {
            const date = new Date(value.startedAt).getTime();
            if (value.instantWattsDC > 0) {
              value.instantWatts = value.instantWattsDC;
            }
            // Add
            consumptionValues.push({
              x: date,
              y: value.instantWatts ? Utils.roundTo(value.instantWatts / 1000, 2) : 0
            });
            if (value.stateOfCharge > 0) {
              stateOfChargeValues.push({
                x: date,
                y: value.stateOfCharge ? value.stateOfCharge : 0
              });
            }
          }
          // Set
          return {
            transaction,
            values: transaction.values,
            consumptionValues,
            stateOfChargeValues
          };
        } else {
          return {
            transaction,
            values: null,
            consumptionValues: null,
            stateOfChargeValues: null
          };
        }
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        // Other common Error
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    // Clear
    return {
      transaction: null,
      values: null,
      consumptionValues: null,
      stateOfChargeValues: null
    };
  };

  public createChart(consumptionValues: ChartPoint[], stateOfChargeValues: ChartPoint[]) {
    const commonColor = Utils.getCurrentCommonColor();
    const chartDefinition = {} as LineChartProps;
    // Add Data
    chartDefinition.data = { dataSets: [] };
    // Check Consumptions
    if (consumptionValues && consumptionValues.length > 1) {
      chartDefinition.data.dataSets.push({
        values: consumptionValues,
        label: I18n.t('details.instantPowerChartLabel'),
        config: {
          mode: 'LINEAR',
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          highlightColor: processColor('white'),
          color: processColor(commonColor.primary),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor(commonColor.primary),
          valueTextSize: scale(8)
        }
      });
    }
    // Check SoC
    if (stateOfChargeValues && stateOfChargeValues.length > 1) {
      chartDefinition.data.dataSets.push({
        values: stateOfChargeValues,
        label: I18n.t('details.batteryChartLabel'),
        config: {
          axisDependency: 'RIGHT',
          mode: 'LINEAR',
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          highlightColor: processColor('white'),
          color: processColor(commonColor.success),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor(commonColor.success),
          valueTextSize: scale(8)
        }
      });
    }
    // X Axis
    chartDefinition.xAxis = {
      enabled: true,
      labelRotationAngle: -45,
      granularity: 1,
      drawLabels: true,
      position: 'BOTTOM',
      drawGridLines: false,
      fontFamily: 'HelveticaNeue-Medium',
      valueFormatter: 'date',
      valueFormatterPattern: 'HH:mm',
      textSize: scale(8),
      textColor: processColor(commonColor.textColor)
    };
    // Y Axis
    chartDefinition.yAxis = {};
    // Check Consumptions
    if (consumptionValues && consumptionValues.length > 1) {
      chartDefinition.yAxis.left = {
        enabled: true,
        valueFormatter: '##0.#kW',
        axisMinimum: 0,
        textColor: processColor(commonColor.textColor),
        textSize: scale(8)
      };
    } else {
      chartDefinition.yAxis.left = {
        enabled: false
      };
    }
    // Check SoC
    if (stateOfChargeValues && stateOfChargeValues.length > 1) {
      chartDefinition.yAxis.right = {
        enabled: true,
        valueFormatter: '##0',
        axisMinimum: 0,
        axisMaximum: 100,
        textColor: processColor(commonColor.success),
        textSize: scale(8)
      };
    } else {
      chartDefinition.yAxis.right = {
        enabled: false
      };
    }
    // Return
    return chartDefinition;
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const {
      showTransactionDetails,
      isAdmin,
      isSiteAdmin,
      loading,
      transaction,
      chargingStation,
      connector,
      consumptionValues,
      stateOfChargeValues,
      canDisplayTransaction
    } = this.state;
    const chartDefinition = this.createChart(consumptionValues, stateOfChargeValues);
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
    return loading ? (
      <Spinner style={style.spinner} color="grey" />
    ) : (
      <View style={style.container}>
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : I18n.t('connector.unknown')}
          subTitle={`(${I18n.t('details.connector')} ${connectorLetter})`}
          leftAction={() => this.onBack()}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        {showTransactionDetails && transaction && (
          <TransactionHeaderComponent
            navigation={navigation}
            transaction={transaction}
            isAdmin={isAdmin}
            isSiteAdmin={isSiteAdmin}
            displayNavigationIcon={false}
          />
        )}
        {transaction && consumptionValues && consumptionValues.length > 1 && canDisplayTransaction ? (
          <LineChart
            style={showTransactionDetails && transaction ? style.chartWithHeader : style.chart}
            data={chartDefinition.data}
            chartDescription={{ text: '' }}
            legend={{
              enabled: true,
              textSize: scale(8),
              textColor: processColor(commonColor.textColor)
            }}
            marker={{
              enabled: true,
              markerColor: processColor(commonColor.disabled),
              textSize: scale(12),
              textColor: processColor(commonColor.inverseTextColor)
            }}
            xAxis={chartDefinition.xAxis}
            yAxis={chartDefinition.yAxis}
            autoScaleMinMaxEnabled={false}
            animation={{
              durationX: 1000,
              durationY: 1000,
              easingY: 'EaseInOutQuart'
            }}
            drawGridBackground={false}
            drawBorders={false}
            touchEnabled
            dragEnabled
            scaleEnabled={false}
            scaleXEnabled
            scaleYEnabled={false}
            pinchZoom
            doubleTapToZoomEnabled={false}
            dragDecelerationEnabled
            dragDecelerationFrictionCoef={0.99}
            keepPositionOnRotation={false}
          />
        ) : transaction || (connector && connector.currentTransactionID) ? (
          canDisplayTransaction ? (
            <Text style={style.notData}>{I18n.t('details.noConsumptionData')}</Text>
          ) : (
            <Text style={style.notData}>{I18n.t('details.notAuthorized')}</Text>
          )
        ) : (
          <Text style={style.notData}>{I18n.t('details.noConsumptionData')}</Text>
        )}
      </View>
    );
  }
}
