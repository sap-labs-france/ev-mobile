import I18n from 'i18n-js';
import { Spinner } from 'native-base';
import React from 'react';
import { View, processColor, Text } from 'react-native';
import { LineChart, LineChartProps, LineValue } from 'react-native-charts-wrapper';
import { scale } from 'react-native-size-matters';

import HeaderComponent from '../../../components/header/HeaderComponent';
import TransactionHeaderComponent from '../../../components/transaction/header/TransactionHeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { Connector } from '../../../types/ChargingStation';
import Consumption from '../../../types/Consumption';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './TransactionChartStyles';
import { HttpChargingStationRequest } from '../../../types/requests/HTTPChargingStationRequests';
import I18nManager, { NumberFormatStyleEnum } from '../../../I18n/I18nManager';
import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
import {StatusCodes} from 'http-status-codes';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  chargingStation?: ChargingStation;
  connector?: Connector;
  transaction?: Transaction;
  values?: Consumption[];
  showTransactionDetails?: boolean;
  canDisplayTransaction?: boolean;
  isAdmin: boolean;
  isSiteAdmin?: boolean;
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
      showTransactionDetails: false
    };
    // Set Refresh
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount(true);
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
          if (connector?.currentTransactionID && (!this.state.transaction || !this.state.transaction.stop) && connector?.canReadTransaction) {
            transactionWithConsumptions = await this.getTransactionWithConsumptions(connector?.currentTransactionID);
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
      const extraParams: HttpChargingStationRequest = {
        WithSite: true
      };
      // Get chargingStation
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID, extraParams);
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
  ): Promise<{ transaction: Transaction; values: Consumption[] }> => {
    try {
      // Active Transaction?
      if (transactionID) {
        // Get the consumption
        const transaction = await this.centralServerProvider.getTransactionConsumption(transactionID);
        // At least 2 values for the chart!!!
        if (transaction?.values?.length > 1) {
          // Set
          return {
            transaction,
            values: transaction.values,
          };
        } else {
          return {
            transaction,
            values: null
          };
        }
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== StatusCodes.FORBIDDEN) {
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
      values: null
    };
  };

  public createChart() {
    const commonColor = Utils.getCurrentCommonColor();
    const chartDefinition = {} as LineChartProps;
    const { values, transaction } = this.state;
    // Add Data
    chartDefinition.data = { dataSets: [] };
    // Check Consumptions
    let powerValues = this.getDataSetFunctionOfTime(
      values,
      'instantWatts',
      (y, value) => (value.instantWatts || value.instantWattsDC) / 1000,
      (markerValue) => `${I18nManager.formatNumber(markerValue)} kW`
    );
    if (!Utils.isEmptyArray(powerValues)) {
      chartDefinition.data.dataSets.push({
        values: powerValues,
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
    const stateOfChargeValues = this.getDataSetFunctionOfTime(
      values,
      'stateOfCharge',
      null,
      (markerValue) => `${I18nManager.formatNumber(markerValue)} %`
      );
    if (transaction?.stateOfCharge > 0 || transaction?.stop?.stateOfCharge > 0) {
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
    // Check isAdmin
    if (this.state?.isAdmin) {
      const gridLimitationValues = this.getDataSetFunctionOfTime(
        values,
        'limitWatts',
        (y) => y / 1000,
        (markerValue) => `${I18nManager.formatNumber(markerValue)} kW`
        );
      // Check grid limitation
      if (!Utils.isEmptyArray(gridLimitationValues)) {
        chartDefinition.data.dataSets.push({
          values: gridLimitationValues,
          label: I18n.t('details.gridLimitChartLabel'),
          config: {
            axisDependency: 'LEFT',
            mode: 'LINEAR',
            drawValues: false,
            lineWidth: 2,
            drawCircles: false,
            highlightColor: processColor('white'),
            color: processColor(commonColor.danger),
            drawFilled: true,
            fillAlpha: 65,
            fillColor: processColor(commonColor.danger),
            valueTextSize: scale(8)
          }
        });
      }
    }
    if (!Utils.isEmptyArray(values)) {
      const cumulatedConsumptionValues = this.getDataSetFunctionOfTime(
        values,
        'cumulatedConsumptionWh',
        (y) => y / 1000,
        (markerValue) => `${I18nManager.formatNumber(markerValue)} kW.h`
        );
      chartDefinition.data.dataSets.push({
        values: cumulatedConsumptionValues,
        label: I18n.t('details.cumulatedConsumptionLabel'),
        config: {
          axisDependency: 'LEFT',
          mode: 'LINEAR',
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          highlightColor: processColor('#0297a7'),
          color: processColor('#0297a7'),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor('#0297a7'),
          valueTextSize: scale(8)
        }
      });
    }
    const priceCurrency = transaction?.priceUnit;
    const priceCurrencySymbol = I18nManager.formatNumberWithCompacts(null, {style: NumberFormatStyleEnum.CURRENCY, currency: priceCurrency } )?.currency;
    const priceValues = this.getDataSetFunctionOfTime(
      values,
      'cumulatedAmount',
      null,
      (markerValue) => `${I18nManager.formatCurrency(markerValue, priceCurrency)}`
      );
    if (!Utils.isEmptyArray(priceValues) && this.securityProvider?.isComponentPricingActive()) {
      chartDefinition.data.dataSets.push({
        values: priceValues,
        label: I18n.t('details.priceLabel') + (priceCurrencySymbol ? ` (${priceCurrencySymbol})` : ''),
        config: {
          axisDependency: 'LEFT',
          mode: 'LINEAR',
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          highlightColor: processColor('#f57b02'),
          color: processColor('#f57b02'),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor('#f57b02'),
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
      valueFormatter: 'date',
      //TODO find a way to have a i18n pattern
      valueFormatterPattern: 'HH:mm',
      fontFamily: 'HelveticaNeue-Medium',
      textSize: scale(8),
      textColor: processColor(commonColor.textColor)
    };
    // Y Axis
    chartDefinition.yAxis = {};
    // Check Consumptions
    if (powerValues && powerValues.length > 1) {
      chartDefinition.yAxis.left = {
        enabled: true,
        valueFormatter: '##0',
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
    if (transaction?.stateOfCharge > 0 || transaction?.stop?.stateOfCharge > 0) {
      chartDefinition.yAxis.right = {
        enabled: true,
        valueFormatter: "##0'%'",
        labelCount: 10,
        axisMinimum: 0,
        axisMaximum: 100,
        textColor: processColor(commonColor.success),
        textSize: scale(8),
      };
    } else {
      chartDefinition.yAxis.right = {
        enabled: false
      };
    }
    // Return
    return chartDefinition;
  }

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
      values,
      canDisplayTransaction
    } = this.state;
    const chartDefinition = this.createChart();
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
    return (
      <View style={style.container}>
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : ''}
          subTitle={chargingStation ? `(${I18n.t('details.connector')} ${connectorLetter})` : ''}
          containerStyle={style.headerContainer}
        />
        {loading ? <Spinner size={scale(30)} style={style.spinner} color="grey" /> : (
          <View style={{flex: 1}}>
            {showTransactionDetails && transaction && (
              <TransactionHeaderComponent
                navigation={navigation}
                transaction={transaction}
                isAdmin={isAdmin}
                isSiteAdmin={isSiteAdmin}
              />
            )}
            {transaction && values && values.length > 1 && canDisplayTransaction ? (
              <LineChart
                style={showTransactionDetails && transaction ? style.chartWithHeader : style.chart}
                data={chartDefinition.data}
                chartDescription={{ text: '' }}
                extraOffsets={{"bottom": scale(10)}}
                legend={{
                  enabled: true,
                  textSize: scale(10),
                  textColor: processColor(commonColor.textColor),
                  wordWrapEnabled: true,
                  yEntrySpace: scale(10),
                  xEntrySpace: scale(15),
                }}
                marker={{
                  enabled: true,
                  markerColor: processColor(commonColor.listItemBackground),
                  textSize: scale(12),
                  textColor: processColor(commonColor.textColor),
                  // Required for iOS
                  textAlign: 'center'
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
            ) : (
              transaction || (connector?.currentTransactionID) ? (
                canDisplayTransaction ? (
                  <Text style={style.notData}>{I18n.t('details.noConsumptionData')}</Text>
                ) : (
                  <Text style={style.notData}>{I18n.t('details.notAuthorized')}</Text>
                )
              ) : (
                <Text style={style.notData}>{I18n.t('details.noConsumptionData')}</Text>
              )
            )}
          </View>
        )}
      </View>
    );
  }

  private getDataSetFunctionOfTime(
    values: Consumption[],
    dataSet: string,
    transformValuesCallback?: (y: number, value: Consumption) => number,
    formatMarkerValueCallback: (markerValue: number) => string = I18nManager.formatNumber
  ): LineValue[] {
    const { transaction } = this.state;
    return values
      ?.filter((value) => value.endedAt)
      ?.map((value) => {
        const y = Utils.roundTo(transformValuesCallback?.(value[dataSet], value) ?? value[dataSet], 2);
        const x = new Date(value.endedAt);
        const duration = (new Date(value.endedAt).getTime() - new Date(transaction?.timestamp).getTime()) / (1000);
        const markerDate = `${I18nManager.formatDateTime(x, {timeStyle: 'short'})}`;
        const durationFormatOptions = {style: DurationUnitFormat.styles.SHORT, format: '{hour} {minutes} {seconds}'};
        const markerDuration = `(${I18nManager.formatDuration(duration, durationFormatOptions)})`;
        const markerValue = formatMarkerValueCallback(y);
        const marker = `${markerDate} ${markerDuration} \n ${markerValue}`;
        return { x: x.getTime(), y,  marker };
      });
  }
}
