import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { View, processColor } from "react-native";
import { Text, Icon, Spinner } from "native-base";
import HeaderComponent from "../../../components/Header";
import ProviderFactory from "../../../provider/ProviderFactory";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";
import { scale } from "react-native-size-matters";
import commonColor from "../../../theme/variables/commonColor";

import { LineChart } from "react-native-charts-wrapper";

const fillGreen = commonColor.brandSuccess;
const fillRed = commonColor.brandDanger;
const EMPTY_CHART = [{ x:0, y:0 }];

const _provider = ProviderFactory.getProvider();

class ChartDetails extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      chargerID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "chargerID", null),
      connectorID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "connectorID", null),
      charger: null,
      connector: null,
      firstLoad: true,
      notAuthorizedToSeeTheChart: false,
      values: [],
      consumptions: EMPTY_CHART,
      stateOfCharge: EMPTY_CHART
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Refresh Charger
    await this._getCharger();
    // Get the consumption
    await this._getChargingStationConsumption();
    // Start refreshing Charger Data
    this.timerChartData = setInterval(() => {
      // Refresh
      this._refresh();
    }, Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS);
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      firstLoad: false
    });
  }

  componentDidFocus = () => {
    // Start the timer
    if (!this.timerChartData) {
      // Refresh
      this._refresh();
      // Start refreshing Charger Data
      this.timerChartData = setInterval(() => {
        // Refresh
        this._refresh();
      }, Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS);
    }
  }

  componentDidBlur = () => {
    // Clear interval if it exists
    if (this.timerChartData) {
      clearInterval(this.timerChartData);
      this.timerChartData = null;
    }
  }

  async componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Clear interval if it exists
    if (this.timerChartData) {
      clearInterval(this.timerChartData);
    }
  }

  _getChargingStationConsumption = async () => {
    try {
      // Active Transaction?
      if (this.state.connector.activeTransactionID) {
        // Get the consumption
        let result = await _provider.getChargingStationConsumption({
          TransactionId: this.state.connector.activeTransactionID
        });
        // At least 2 values for the chart!!!
        if (result.values && result.values.length > 1) {
          // Convert
          let consumptions = [], stateOfCharge = [];
          for (let index = 0; index < result.values.length; index++) {
            const value = result.values[index];
            const date = new Date(value.date).getTime();
            // Add
            consumptions.push({x: date, y: (value.value ? value.value : 0)});
            stateOfCharge.push({x: date, y: (value.stateOfCharge ? value.stateOfCharge : 0)});
          }
          // Set
          this.setState({
            values: result.values,
            consumptions,
            stateOfCharge
          });
        }
      } else {
        // Clear interval
        if (this.timerChartData) {
          clearInterval(this.timerChartData);
        }
        // Clear
        this.setState({
          values: null,
          consumptions: EMPTY_CHART,
          stateOfCharge: EMPTY_CHART
        });
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props);
      } else {
            // Cannot see the chart
        this.setState({
          notAuthorizedToSeeTheChart: true
        });
      }
    }
  }

  _refresh = async () => {
    // Component Mounted?
    if (this.mounted) {
      // Refresh Charger
      await this._getCharger();
      // Refresh Consumption
      await this._getChargingStationConsumption();
    }
  }

  _getCharger = async () => {
    try {
      let charger = await _provider.getCharger(
        { ID: this.state.chargerID }
      );
      this.setState({
        charger: charger,
        connector: charger.connectors[this.state.connectorID - 1]
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const style = computeStyleSheet();
    const { firstLoad, charger, connector, connectorID, consumptions, stateOfCharge, notAuthorizedToSeeTheChart } = this.state;
    const connectorLetter = String.fromCharCode(64 + connectorID);
    const navigation = this.props.navigation;
    return (
      <View style={style.container}>
        {firstLoad ?
          <Spinner color="white" style={style.spinner} />
        :
          (notAuthorizedToSeeTheChart ?
            <View style={style.notAuthorizedContainer}>
              <Icon style={style.notAuthorizedIcon} type="Entypo" name="circle-with-cross" />
              <Text style={style.notAuthorizedText}>{I18n.t("details.notAuthorized")}</Text>
            </View>
          :
            <View style={style.chartContainer}>
              <HeaderComponent
                title={charger.id} subTitle={`${I18n.t("details.connector")} ${connectorLetter}`}
                leftAction={() => navigation.navigate("Chargers", { siteAreaID: charger.siteAreaID })} leftActionIcon={"arrow-back" } />
              <View style={style.container}>
                <LineChart
                  style={style.chart}
                  data={{
                    dataSets: [
                      {
                        values: consumptions,
                        label: I18n.t("details.instantPower"),
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
                      },
                      {
                        values: stateOfCharge,
                        label: I18n.t("details.battery"),
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
                      }
                    ]
                  }}
                  chartDescription={{ text: "" }}
                  noDataText={"No Data"}
                  backgroundColor={"black"}
                  legend={{
                    enabled: true,
                    textColor: processColor("white"),
                  }}
                  marker={{
                    enabled: true,
                    markerColor: processColor("white"),
                    textColor: processColor("black")
                  }}
                  xAxis={{
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
                  }}
                  yAxis={{
                    left: {
                      enabled: true,
                      valueFormatter: "# W",
                      axisMinimum: 0,
                      // axisMaximum: connector.power * 1.05,
                      textColor: processColor(commonColor.brandDanger),
                      limitLines: [{
                        limit: connector.power,
                        label: I18n.t("details.connectorMax"),
                        valueTextColor: processColor("white"),
                        lineColor: processColor(commonColor.brandDanger),
                        lineDashPhase: 2,
                        lineWidth: 1,
                        lineDashLengths: [10,10]
                      }]
                    },
                    right: {
                      enabled: true,
                      valueFormatter: "percent",
                      axisMinimum: 0,
                      axisMaximum: 100,
                      textColor: processColor(commonColor.brandSuccess)
                    }
                  }}
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
            </View>
          )
        }
      </View>
    );
  }
}

export default ChartDetails;
