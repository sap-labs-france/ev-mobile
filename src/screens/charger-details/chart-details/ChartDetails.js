import React from "react";
import BaseScreen from "../../base-screen/BaseScreen";
import { View, processColor } from "react-native";
import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ChartDetailsStyles";
import { scale } from "react-native-size-matters";
import commonColor from "../../../theme/variables/commonColor";
import { LineChart } from "react-native-charts-wrapper";
import PropTypes from "prop-types";

const fillGreen = commonColor.brandSuccess;
const fillRed = commonColor.brandDanger;
const EMPTY_CHART = [{ x: 0, y: 0 }];

const _provider = ProviderFactory.getProvider();

export default class ChartDetails extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      consumptionValues: EMPTY_CHART,
      stateOfChargeValues: EMPTY_CHART
    };
  }

  async componentDidMount() {
    // Call parent
    super.componentDidMount();
    // Get the consumption
    if (this.isMounted()) {
      await this._getChargingStationConsumption();
    }
  }

  async componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getChargingStationConsumption = async () => {
    const { transactionID } = this.props;
    try {
      // Active Transaction?
      if (transactionID) {
        // Get the consumption
        const result = await _provider.getChargingStationConsumption({
          TransactionId: transactionID
        });
        // At least 2 values for the chart!!!
        if (result.values && result.values.length > 1) {
          // Convert
          const consumptionValues = [],
            stateOfChargeValues = [];
          for (let index = 0; index < result.values.length; index++) {
            const value = result.values[index];
            const date = new Date(value.date).getTime();
            // Add
            consumptionValues.push({
              x: date,
              y: value.value ? value.value : 0
            });
            if (value.stateOfCharge > 0) {
              stateOfChargeValues.push({
                x: date,
                y: value.stateOfCharge ? value.stateOfCharge : 0
              });
            }
          }
          // Set
          this.setState({
            values: result.values,
            consumptionValues,
            stateOfChargeValues
          });
        }
      } else {
        // Clear
        this.setState({
          values: null,
          consumptionValues: EMPTY_CHART,
          stateOfChargeValues: EMPTY_CHART
        });
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props);
      }
    }
  };

  _refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      // Refresh Consumption
      await this._getChargingStationConsumption();
    }
  };

  computeChartDefinition(consumptionValues, stateOfChargeValues) {
    const chartDefinition = {};
    // Add Data
    chartDefinition.data = { dataSets: [] };
    // Check Consumptions\
    if (consumptionValues && consumptionValues.length > 1) {
      // Add
      chartDefinition.data.dataSets.push({
        values: consumptionValues,
        label: I18n.t("details.instantPowerChartLabel"),
        config: {
          mode: "CUBIC_BEZIER",
          drawValues: false,
          lineWidth: 2,
          drawCircles: false,
          circleColor: processColor(commonColor.brandDanger),
          drawCircleHole: false,
          circleRadius: 5,
          highlightColor: processColor("white"),
          color: processColor(commonColor.brandDanger),
          drawFilled: true,
          fillAlpha: 65,
          fillColor: processColor(fillRed),
          valueTextSize: scale(15)
        }
      });
    }
    // Check SoC
    if (stateOfChargeValues && stateOfChargeValues.length > 1) {
      // Add
      chartDefinition.data.dataSets.push({
        values: stateOfChargeValues,
        label: I18n.t("details.batteryChartLabel"),
        config: {
          axisDependency: "RIGHT",
          mode: "CUBIC_BEZIER",
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
          fillColor: processColor(fillGreen),
          valueTextSize: scale(15)
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
      textColor: processColor("white")
    };
    // Y Axis
    chartDefinition.yAxis = {};
    // Check Consumptions\
    if (consumptionValues && consumptionValues.length > 1) {
      // Set
      chartDefinition.yAxis.left = {
        enabled: true,
        valueFormatter: "# W",
        axisMinimum: 0,
        textColor: processColor(commonColor.brandDanger)
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
    }
    // Check SoC
    if (stateOfChargeValues && stateOfChargeValues.length > 1) {
      // Add SoC
      chartDefinition.yAxis.right = {
        enabled: true,
        valueFormatter: "percent",
        axisMinimum: 0,
        axisMaximum: 100,
        textColor: processColor(commonColor.brandSuccess)
      };
    }
    // Return
    return chartDefinition;
  }

  render() {
    const style = computeStyleSheet();
    const { consumptionValues, stateOfChargeValues } = this.state;
    const chartDefinition = this.computeChartDefinition(consumptionValues, stateOfChargeValues);
    return (
      <View style={style.container}>
        <LineChart
          style={style.chart}
          data={chartDefinition.data}
          chartDescription={{ text: "" }}
          noDataText={"No Data"}
          backgroundColor={"black"}
          legend={{
            enabled: true,
            textColor: processColor("white")
          }}
          marker={{
            enabled: true,
            markerColor: processColor("white"),
            textColor: processColor("black")
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
      </View>
    );
  }
}

ChartDetails.propTypes = {
  transactionID: PropTypes.number
};

ChartDetails.defaultProps = {};
