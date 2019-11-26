import I18n from "i18n-js";
import { Spinner, Text } from "native-base";
import React from "react";
import { processColor, View } from "react-native";
import { LineChart } from "react-native-charts-wrapper";
import { scale } from "react-native-size-matters";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import TransactionHeaderComponent from "../../../components/transaction/header/TransactionHeaderComponent";
import commonColor from "../../../theme/variables/commonColor";
import BaseProps from "../../../types/BaseProps";
import Consumption from "../../../types/Consumption";
import Transaction from "../../../types/Transaction";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./TransactionChartStyles";

export interface Props extends BaseProps {
  transactionID: number;
  isAdmin: boolean;
  showTransactionDetails?: boolean;
}

interface State {
  loading?: boolean;
  transaction?: Transaction;
  values?: Consumption[];
  consumptionValues?: ChartPoint[];
  stateOfChargeValues?: ChartPoint[];
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
    props.showTransactionDetails = false;
    props.isAdmin = false;
    this.state = {
      loading: true,
      transaction: null,
      values: [],
      consumptionValues: null,
      stateOfChargeValues: null
    };
    // Set Refresh
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getTransactionConsumptions = async ():
      Promise<{ transaction: Transaction; values: Consumption[], consumptionValues: ChartPoint[], stateOfChargeValues: ChartPoint[] }> => {
    const { transactionID } = this.props;
    try {
      // Active Transaction?
      if (transactionID) {
        // Get the consumption
        const transaction = await this.centralServerProvider.getTransactionConsumption({
          TransactionId: transactionID
        });
        // At least 2 values for the chart!!!
        if (transaction.values && transaction.values.length > 1) {
          // Convert
          const consumptionValues: ChartPoint[] = [];
          const stateOfChargeValues: ChartPoint[] = [];
          for (const value of transaction.values) {
            const date = new Date(value.date).getTime();
            // Add
            consumptionValues.push({
              x: date,
              y: value.value ? value.value / 1000 : 0
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
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
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

  public refresh = async () => {
    const { transaction } = this.state;
    // Component Mounted?
    let consumptions = {};
    if (this.isMounted() && (!transaction || !transaction.stop)) {
      // Refresh Consumption
      consumptions = await this.getTransactionConsumptions();
    }
    this.setState({
      loading: false,
      ...consumptions
    });
  };

  public computeChartDefinition(consumptionValues: ChartPoint[], stateOfChargeValues: ChartPoint[]) {
    const chartDefinition: any = {};
    // Add Data
    chartDefinition.data = { dataSets: [] };
    // Check Consumptions
    if (consumptionValues && consumptionValues.length > 1) {
      chartDefinition.data.dataSets.push({
        values: consumptionValues,
        label: I18n.t("details.instantPowerChartLabel"),
        config: {
          mode: "LINEAR",
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          circleColor: processColor(commonColor.brandInfo),
          drawCircleHole: false,
          circleRadius: 5,
          highlightColor: processColor("white"),
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
        label: I18n.t("details.batteryChartLabel"),
        config: {
          axisDependency: "RIGHT",
          mode: "LINEAR",
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          circleColor: processColor(commonColor.brandSuccess),
          drawCircleHole: false,
          circleRadius: 5,
          highlightColor: processColor("white"),
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
      position: "BOTTOM",
      drawAxisLine: true,
      drawGridLines: false,
      fontFamily: "HelveticaNeue-Medium",
      fontWeight: "bold",
      valueFormatter: "date",
      valueFormatterPattern: "HH:mm",
      textSize: scale(8),
      textColor: processColor(commonColor.brandInfo)
    };
    // Y Axis
    chartDefinition.yAxis = {};
    // Check Consumptions
    if (consumptionValues && consumptionValues.length > 1) {
      chartDefinition.yAxis.left = {
        enabled: true,
        valueFormatter: "##0 kW",
        axisMinimum: 0,
        textColor: processColor(commonColor.brandInfo),
        textSize: scale(8)
        // limitLines: [{
        //   limit: connector.power,
        //   label: I18n.t("details.connectorMax"),
        //   valueTextColor: processColor("white"),
        //   lineColor: processColor(commonColor.brandDanger),
        //   lineDashPhase: 2,
        //   lineWidth: 1,
        //   lineDashLengths: [10,10]
        // }]
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
        valueFormatter: "##0",
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

  public render() {
    console.log(this.constructor.name + ' render ====================================');
    const style = computeStyleSheet();
    const { loading, transaction, consumptionValues, stateOfChargeValues } = this.state;
    const { showTransactionDetails, isAdmin, navigation } = this.props;
    const chartDefinition = this.computeChartDefinition(consumptionValues, stateOfChargeValues);
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <View style={style.container}>
          <BackgroundComponent navigation={navigation} active={false}>
            {showTransactionDetails && transaction && (
              <TransactionHeaderComponent navigation={navigation} transaction={transaction} isAdmin={isAdmin} displayNavigationIcon={false} />
            )}
            {consumptionValues && consumptionValues.length > 1 ? (
              <LineChart
                style={showTransactionDetails && transaction ? style.chartWithHeader : style.chart}
                data={chartDefinition.data}
                chartDescription={{ text: "" }}
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
                  easingY: "EaseInOutQuart"
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
              consumptionValues && <Text style={style.notEnoughData}>{I18n.t("details.notEnoughData")}</Text>
            )}
          </BackgroundComponent>
        </View>
      )
    );
  }
}
