import I18n from 'i18n-js';
import { Spinner, Text } from 'native-base';
import React from 'react';
import { processColor, View } from 'react-native';
import { LineChart, LineChartProps } from 'react-native-charts-wrapper';
import { scale } from 'react-native-size-matters';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../../components/header/HeaderComponent';
import TransactionHeaderComponent from '../../../components/transaction/header/TransactionHeaderComponent';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { Connector } from '../../../types/ChargingStation';
import Consumption from '../../../types/Consumption';
import Transaction, { TransactionConsumption } from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './TransactionChartStyles';


export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  charger?: ChargingStation;
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

  constructor(props: Props) {
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

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  // tslint:disable-next-line: cyclomatic-complexity
  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const chargerID = Utils.getParamFromNavigation(this.props.navigation, 'chargerID', null);
      const connectorID = Utils.getParamFromNavigation(this.props.navigation, 'connectorID', null);
      const transactionID = Utils.getParamFromNavigation(this.props.navigation, 'transactionID', null);
      let transactionWithConsumptions = null;
      let charger = null;
      let connector = null;
      // Get Transaction and Charger
      if (transactionID) {
        transactionWithConsumptions = await this.getTransactionWithConsumptions(parseInt(transactionID, 10));
        if (transactionWithConsumptions && transactionWithConsumptions.transaction) {
          charger = await this.getCharger(transactionWithConsumptions.transaction.chargeBoxID);
          if (charger) {
            connector = charger ? charger.connectors[transactionWithConsumptions.transaction.connectorId - 1] : null;
          }
        }
      // Get Charger and Transaction
      } else if (chargerID) {
        // Get Charger
        charger = await this.getCharger(chargerID);
        if (charger) {
          connector = charger ? charger.connectors[parseInt(connectorID, 10) - 1] : null;
          // Refresh Consumption
          if (connector.currentTransactionID && (!this.state.transaction || !this.state.transaction.stop)) {
            transactionWithConsumptions = await this.getTransactionWithConsumptions(connector.currentTransactionID);
          }
        }
      }
      // Get the provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Set
      this.setState({
        loading: false,
        transaction: transactionWithConsumptions ? transactionWithConsumptions.transaction : this.state.transaction,
        charger: !this.state.charger ? charger : this.state.charger,
        connector,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false,
        isSiteAdmin: securityProvider && charger && charger.siteArea ? securityProvider.isSiteAdmin(charger.siteArea.siteID) : false,
        canDisplayTransaction: charger ? this.canDisplayTransaction(
          transactionWithConsumptions ? transactionWithConsumptions.transaction : null, charger, connector) : false,
        ...transactionWithConsumptions
      });
    }
  };

  public getCharger = async (chargerID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      return charger;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnexpectedError', this.props.navigation, this.refresh);
    }
    return null;
  };

  public getTransactionWithConsumptions = async (transactionID: number):
    Promise<{ transaction: Transaction; values: TransactionConsumption[], consumptionValues: ChartPoint[], stateOfChargeValues: ChartPoint[] }> => {
    try {
      // Active Transaction?
      if (transactionID) {
        // Get the consumption
        const transaction = await this.centralServerProvider.getTransactionConsumption(transactionID);
        // At least 2 values for the chart!!!
        if (transaction.values && transaction.values.length > 1) {
          // Convert
          const consumptionValues: ChartPoint[] = [];
          const stateOfChargeValues: ChartPoint[] = [];
          for (const value of transaction.values) {
            const date = new Date(value.date).getTime();
            if (value.instantWattsDC > 0) {
              value.instantWatts = value.instantWattsDC;
            }
            // Add
            consumptionValues.push({
              x: date,
              y: value.instantWatts ? Utils.getRoundedNumberToTwoDecimals(value.instantWatts / 1000) : 0
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
        }
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
          'transactions.transactionUnexpectedError', this.props.navigation, this.refresh);
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

  public canDisplayTransaction = (transaction: Transaction, charger: ChargingStation, connector: Connector): boolean => {
    // Transaction?
    if (charger) {
      // Get the Security Provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Check Auth
      return securityProvider.canReadTransaction(charger.siteArea, transaction ? transaction.tagID : connector.currentTagID);
    }
    return false;
  };

  public createChart(consumptionValues: ChartPoint[], stateOfChargeValues: ChartPoint[]) {
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
          color: processColor(commonColor.brandInfo),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor(commonColor.brandInfo),
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
          color: processColor(commonColor.brandSuccess),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor(commonColor.brandSuccess),
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
      textColor: processColor(commonColor.brandInfo)
    };
    // Y Axis
    chartDefinition.yAxis = {};
    // Check Consumptions
    if (consumptionValues && consumptionValues.length > 1) {
      chartDefinition.yAxis.left = {
        enabled: true,
        valueFormatter: '##0kW',
        axisMinimum: 0,
        textColor: processColor(commonColor.brandInfo),
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
        textColor: processColor(commonColor.brandSuccess),
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
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { showTransactionDetails, isAdmin, isSiteAdmin, loading, transaction, charger,
      connector, consumptionValues, stateOfChargeValues, canDisplayTransaction } = this.state;
    const chartDefinition = this.createChart(consumptionValues, stateOfChargeValues);
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
          <View style={style.container}>
            <HeaderComponent
              navigation={this.props.navigation}
              title={charger ? charger.id : I18n.t('connector.unknown')}
              subTitle={`(${I18n.t('details.connector')} ${connectorLetter})`}
              leftAction={() => this.onBack()}
              leftActionIcon={'navigate-before'}
              rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
              rightActionIcon={'menu'}
            />
            {showTransactionDetails && transaction && (
              <TransactionHeaderComponent navigation={navigation} transaction={transaction}
                isAdmin={isAdmin} isSiteAdmin={isSiteAdmin} displayNavigationIcon={false} />
            )}
            {transaction && consumptionValues && consumptionValues.length > 1 && canDisplayTransaction ? (
              <LineChart
                style={showTransactionDetails && transaction ? style.chartWithHeader : style.chart}
                data={chartDefinition.data}
                chartDescription={{ text: '' }}
                legend={{
                  enabled: true,
                  textSize: scale(8),
                  textColor: processColor(commonColor.brandPrimaryDark)
                }}
                marker={{
                  enabled: true,
                  markerColor: processColor(commonColor.brandPrimaryDark),
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
                touchEnabled={true}
                dragEnabled={true}
                scaleEnabled={false}
                scaleXEnabled={true}
                scaleYEnabled={false}
                pinchZoom={true}
                doubleTapToZoomEnabled={false}
                dragDecelerationEnabled={true}
                dragDecelerationFrictionCoef={0.99}
                keepPositionOnRotation={false}
              />
            ) : (
                transaction || (connector && connector.currentTransactionID) ?
                  canDisplayTransaction ?
                    <Text style={style.notData}>{I18n.t('details.noData')}</Text>
                    :
                    <Text style={style.notData}>{I18n.t('details.notAuthorized')}</Text>
                  :
                  <Text style={style.notData}>{I18n.t('details.noSessionInProgress')}</Text>
              )}
          </View>
        )
    );
  }
}
