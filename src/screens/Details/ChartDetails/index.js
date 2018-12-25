import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { View, processColor } from 'react-native';
import ChargerHeader from "../ChargerHeader";
import ProviderFactory from "../../../provider/ProviderFactory";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";
import { scale } from 'react-native-size-matters';

import { LineChart } from "react-native-charts-wrapper";

const greenBlue = "rgb(26, 182, 151)";
const petrel = "rgb(59, 145, 153)";
const redBlue = "rgb(255, 145, 153)";
const orange = "rgb(255, 182, 151)";
const blue = "rgb(151, 182, 250)";
const violet = "rgb(153, 145, 250)";
const EMPTY_CHART = [{ x:0, y:0 }];

const _provider = ProviderFactory.getProvider();

class ChartDetails extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      values: [],
      consumptions: EMPTY_CHART,
      cumulated: EMPTY_CHART,
      stateOfCharge: EMPTY_CHART,
      maxChartValue: this.props.navigation.state.params.connector.power
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
    // Get the consumption
    this.getChargingStationConsumption();
  }

  componentDidFocus = () => {
  }

  componentDidBlur = () => {
  }

  async componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Clear interval if it exists
    if (this.timerChartData) {
      clearInterval(this.timerChartData);
    }
  }

  getChargingStationConsumption = async () => {
    try {
      // Active Transaction?
      // if (this.state.connector.activeTransactionID) {
        // Clear interval if it exists
        if (!this.timerChartData) {
          // Start refreshing Charger Data
          this.timerChartData = setInterval(() => {
            // Component Mounted?
            if (this.mounted) {
              // Refresh Consumption
              this.getChargingStationConsumption();
            }
          }, Constants.AUTO_REFRESH_CHART_PERIOD_MILLIS);
        }
        // Get the consumption
        // let result = await _provider.getChargingStationConsumption({
        //   TransactionId: this.state.connector.activeTransactionID
        // });
        let result = this.getData();
        // At least 2 values for the chart!!!
        if (result.values && result.values.length > 1) {
          // Convert
          let firstDate, minutes, consumptions = [], cumulated = [], stateOfCharge = [];
          for (let index = 0; index < result.values.length; index++) {
            const value = result.values[index];
            // Keep the date
            if (index === 0) {
              firstDate = new Date(value.date);
              minutes = 0;
            } else {
              // Compute the mins elapsed
              minutes = Math.trunc((new Date(value.date).getTime() - firstDate.getTime()) / (60 * 1000));
            }
            // Add
            consumptions.push({x: new Date(value.date).getTime(), y: value.value}); 
            cumulated.push({x: new Date(value.date).getTime(), y: value.cumulated}); 
            stateOfCharge.push({x: new Date(value.date).getTime(), y: value.stateOfCharge}); 
          }
          // Set
          this.setState({
            values: result.values,
            consumptions,
            cumulated,
            stateOfCharge
          });
        }
      // } else {
      //   // Clear interval
      //   if (this.timerChartData) {
      //     clearInterval(this.timerChartData);
      //   }
      //   // Clear
      //   this.setState({
      //     values: null,
      //     consumptions: EMPTY_CHART,
      //     cumulated: EMPTY_CHART,
      //     stateOfCharge: EMPTY_CHART
      //   });
      // }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props);
      }
    }
  }

  render() {
    const style = computeStyleSheet();
    const { charger, connector, consumptions, cumulated, stateOfCharge } = this.state;    
    const navigation = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <ChargerHeader charger={charger} connector={connector} navigation={navigation} />
        <View style={style.container}>
          <LineChart
            style={style.chart}
            data={{
              dataSets: [
                {
                  values: consumptions,
                  label: I18n.t("details.consumption"),
                  config: {
                    mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 2,
                    drawCircles: false,
                    circleColor: processColor(petrel),
                    drawCircleHole: false,
                    circleRadius: 5,
                    highlightColor: processColor("white"),
                    color: processColor(petrel),
                    drawFilled: true,
                    valueTextSize: scale(15)
                  }
                },
                // {
                //   values: cumulated,
                //   label: I18n.t("details.cumulated"),
                //   config: {
                //     mode: "CUBIC_BEZIER",
                //     drawValues: false,
                //     lineWidth: 2,
                //     drawCircles: false,
                //     circleColor: processColor(redBlue),
                //     drawCircleHole: false,
                //     circleRadius: 5,
                //     highlightColor: processColor("white"),
                //     color: processColor(redBlue),
                //     drawFilled: true,
                //     valueTextSize: scale(15)
                //   }
                // },
                {
                  values: stateOfCharge,
                  label: I18n.t("details.battery"),
                  config: {
                    axisDependency: "RIGHT",
                    mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 2,
                    drawCircles: false,
                    circleColor: processColor(blue),
                    drawCircleHole: false,
                    circleRadius: 5,
                    highlightColor: processColor("white"),
                    color: processColor(blue),
                    drawFilled: true,
                    valueTextSize: scale(15)
                  }
                }
              ]
            }}
            chartDescription={{ text: "" }}
            noDataText={"NO DATA"}
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
                textColor: processColor(greenBlue),
                limitLines: [{
                  limit: 50000,
                  label: I18n.t("details.connectorMax"),
                  valueTextColor: processColor("white"),
                  lineColor: processColor(greenBlue),
                  lineDashPhase: 2,
                  lineWidth: 2,
                  lineDashLengths: [10,20]
                }]
              },
              right: {
                enabled: true,
                valueFormatter: "percent",
                textColor: processColor(violet)
              }
            }}
            autoScaleMinMaxEnabled={true}
            animation={{
              durationX: 0,
              durationY: 1500,
              easingY: "EaseInOutQuart"
            }}
            drawGridBackground={false}
            drawBorders={false}
            touchEnabled={true}
            dragEnabled={false}
            scaleEnabled={true}
            scaleXEnabled={false}
            scaleYEnabled={false}
            pinchZoom={true}
            doubleTapToZoomEnabled={false}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            keepPositionOnRotation={false}
          />
        </View>
      </View>
    );
  }

  getData() {
    return {
      "chargeBoxID": "SAP-Mougins-13",
      "connectorId": 1,
      "priceUnit": "EUR",
      "totalPrice": 6.980064,
      "totalConsumption": 56155,
      "id": 2090911585,
      "stateOfCharge": 39,
      "user": {
        "id": "5bd8339cd0685c19bf056f51",
        "name": "ALECH",
        "firstName": "Nicolas "
      },
      "values": [
        {
          "date": "2018-12-20T11:48:29.933Z",
          "value": 40020,
          "cumulated": 667,
          "stateOfCharge": 40,
          "price": 0.082908
        },
        {
          "date": "2018-12-20T11:49:29.933Z",
          "value": 49380,
          "cumulated": 1490,
          "stateOfCharge": 41,
          "price": 0.102299
        },
        {
          "date": "2018-12-20T11:50:29.933Z",
          "value": 49680,
          "cumulated": 2318,
          "stateOfCharge": 42,
          "price": 0.10292
        },
        {
          "date": "2018-12-20T11:51:29.933Z",
          "value": 49500,
          "cumulated": 3143,
          "stateOfCharge": 43,
          "price": 0.102547
        },
        {
          "date": "2018-12-20T11:52:29.933Z",
          "value": 49320,
          "cumulated": 3965,
          "stateOfCharge": 44,
          "price": 0.102175
        },
        {
          "date": "2018-12-20T11:53:29.933Z",
          "value": 49380,
          "cumulated": 4788,
          "stateOfCharge": 45,
          "price": 0.102299
        },
        {
          "date": "2018-12-20T11:54:29.933Z",
          "value": 49440,
          "cumulated": 5612,
          "stateOfCharge": 46,
          "price": 0.102423
        },
        {
          "date": "2018-12-20T11:55:29.933Z",
          "value": 49440,
          "cumulated": 6436,
          "stateOfCharge": 47,
          "price": 0.102423
        },
        {
          "date": "2018-12-20T11:56:29.933Z",
          "value": 49380,
          "cumulated": 7259,
          "stateOfCharge": 48,
          "price": 0.102299
        },
        {
          "date": "2018-12-20T11:57:29.933Z",
          "value": 49320,
          "cumulated": 8081,
          "stateOfCharge": 49,
          "price": 0.102175
        },
        {
          "date": "2018-12-20T11:58:29.933Z",
          "value": 49200,
          "cumulated": 8901,
          "stateOfCharge": 50,
          "price": 0.101926
        },
        {
          "date": "2018-12-20T11:59:29.933Z",
          "value": 49080,
          "cumulated": 9719,
          "stateOfCharge": 51,
          "price": 0.101677
        },
        {
          "date": "2018-12-20T12:00:29.933Z",
          "value": 49260,
          "cumulated": 10540,
          "stateOfCharge": 52,
          "price": 0.10205
        },
        {
          "date": "2018-12-20T12:01:29.933Z",
          "value": 49200,
          "cumulated": 11360,
          "stateOfCharge": 53,
          "price": 0.101926
        },
        {
          "date": "2018-12-20T12:02:29.933Z",
          "value": 49200,
          "cumulated": 12180,
          "stateOfCharge": 54,
          "price": 0.101926
        },
        {
          "date": "2018-12-20T12:03:29.933Z",
          "value": 49260,
          "cumulated": 13001,
          "stateOfCharge": 55,
          "price": 0.10205
        },
        {
          "date": "2018-12-20T12:04:29.933Z",
          "value": 49380,
          "cumulated": 13824,
          "stateOfCharge": 56,
          "price": 0.102299
        },
        {
          "date": "2018-12-20T12:05:29.933Z",
          "value": 49380,
          "cumulated": 14647,
          "stateOfCharge": 57,
          "price": 0.102299
        },
        {
          "date": "2018-12-20T12:06:29.933Z",
          "value": 49500,
          "cumulated": 15472,
          "stateOfCharge": 58,
          "price": 0.102547
        },
        {
          "date": "2018-12-20T12:07:29.933Z",
          "value": 49560,
          "cumulated": 16298,
          "stateOfCharge": 59,
          "price": 0.102672
        },
        {
          "date": "2018-12-20T12:08:29.933Z",
          "value": 49140,
          "cumulated": 17117,
          "stateOfCharge": 60,
          "price": 0.101802
        },
        {
          "date": "2018-12-20T12:09:29.933Z",
          "value": 49320,
          "cumulated": 17939,
          "stateOfCharge": 61,
          "price": 0.102175
        },
        {
          "date": "2018-12-20T12:10:29.933Z",
          "value": 49200,
          "cumulated": 18759,
          "stateOfCharge": 62,
          "price": 0.101926
        },
        {
          "date": "2018-12-20T12:11:29.933Z",
          "value": 48900,
          "cumulated": 19574,
          "stateOfCharge": 63,
          "price": 0.101304
        },
        {
          "date": "2018-12-20T12:12:29.933Z",
          "value": 49020,
          "cumulated": 20391,
          "stateOfCharge": 64,
          "price": 0.101553
        },
        {
          "date": "2018-12-20T12:13:29.933Z",
          "value": 48300,
          "cumulated": 21196,
          "stateOfCharge": 65,
          "price": 0.100061
        },
        {
          "date": "2018-12-20T12:14:29.933Z",
          "value": 47880,
          "cumulated": 21994,
          "stateOfCharge": 66,
          "price": 0.099191
        },
        {
          "date": "2018-12-20T12:15:29.933Z",
          "value": 47280,
          "cumulated": 22782,
          "stateOfCharge": 67,
          "price": 0.097948
        },
        {
          "date": "2018-12-20T12:16:29.933Z",
          "value": 46980,
          "cumulated": 23565,
          "stateOfCharge": 68,
          "price": 0.097327
        },
        {
          "date": "2018-12-20T12:17:29.933Z",
          "value": 46860,
          "cumulated": 24346,
          "stateOfCharge": 68,
          "price": 0.097078
        },
        {
          "date": "2018-12-20T12:18:29.933Z",
          "value": 46320,
          "cumulated": 25118,
          "stateOfCharge": 69,
          "price": 0.09596
        },
        {
          "date": "2018-12-20T12:19:29.933Z",
          "value": 45720,
          "cumulated": 25880,
          "stateOfCharge": 70,
          "price": 0.094717
        },
        {
          "date": "2018-12-20T12:20:29.933Z",
          "value": 45300,
          "cumulated": 26635,
          "stateOfCharge": 71,
          "price": 0.093846
        },
        {
          "date": "2018-12-20T12:21:29.933Z",
          "value": 44880,
          "cumulated": 27383,
          "stateOfCharge": 72,
          "price": 0.092976
        },
        {
          "date": "2018-12-20T12:22:29.933Z",
          "value": 44280,
          "cumulated": 28121,
          "stateOfCharge": 73,
          "price": 0.091733
        },
        {
          "date": "2018-12-20T12:23:29.933Z",
          "value": 44160,
          "cumulated": 28857,
          "stateOfCharge": 74,
          "price": 0.091485
        },
        {
          "date": "2018-12-20T12:24:29.933Z",
          "value": 43740,
          "cumulated": 29586,
          "stateOfCharge": 75,
          "price": 0.090615
        },
        {
          "date": "2018-12-20T12:25:29.933Z",
          "value": 43320,
          "cumulated": 30308,
          "stateOfCharge": 75,
          "price": 0.089745
        },
        {
          "date": "2018-12-20T12:26:29.933Z",
          "value": 43140,
          "cumulated": 31027,
          "stateOfCharge": 76,
          "price": 0.089372
        },
        {
          "date": "2018-12-20T12:27:29.933Z",
          "value": 42780,
          "cumulated": 31740,
          "stateOfCharge": 77,
          "price": 0.088626
        },
        {
          "date": "2018-12-20T12:28:29.933Z",
          "value": 42420,
          "cumulated": 32447,
          "stateOfCharge": 78,
          "price": 0.08788
        },
        {
          "date": "2018-12-20T12:29:29.933Z",
          "value": 42300,
          "cumulated": 33152,
          "stateOfCharge": 79,
          "price": 0.087631
        },
        {
          "date": "2018-12-20T12:30:29.933Z",
          "value": 41880,
          "cumulated": 33850,
          "stateOfCharge": 80,
          "price": 0.086761
        },
        {
          "date": "2018-12-20T12:31:29.933Z",
          "value": 41520,
          "cumulated": 34542,
          "stateOfCharge": 80,
          "price": 0.086016
        },
        {
          "date": "2018-12-20T12:32:29.933Z",
          "value": 41040,
          "cumulated": 35226,
          "stateOfCharge": 81,
          "price": 0.085021
        },
        {
          "date": "2018-12-20T12:33:29.933Z",
          "value": 40620,
          "cumulated": 35903,
          "stateOfCharge": 82,
          "price": 0.084151
        },
        {
          "date": "2018-12-20T12:34:29.933Z",
          "value": 40020,
          "cumulated": 36570,
          "stateOfCharge": 83,
          "price": 0.082908
        },
        {
          "date": "2018-12-20T12:35:29.933Z",
          "value": 39660,
          "cumulated": 37231,
          "stateOfCharge": 84,
          "price": 0.082162
        },
        {
          "date": "2018-12-20T12:36:29.933Z",
          "value": 39300,
          "cumulated": 37886,
          "stateOfCharge": 84,
          "price": 0.081417
        },
        {
          "date": "2018-12-20T12:37:29.934Z",
          "value": 38940,
          "cumulated": 38535,
          "stateOfCharge": 85,
          "price": 0.080671
        },
        {
          "date": "2018-12-20T12:38:29.933Z",
          "value": 38623.72881355932,
          "cumulated": 39168,
          "stateOfCharge": 86,
          "price": 0.078682
        },
        {
          "date": "2018-12-20T12:39:29.933Z",
          "value": 36840,
          "cumulated": 39782,
          "stateOfCharge": 87,
          "price": 0.07632
        },
        {
          "date": "2018-12-20T12:40:29.933Z",
          "value": 35640,
          "cumulated": 40376,
          "stateOfCharge": 87,
          "price": 0.073834
        },
        {
          "date": "2018-12-20T12:41:29.933Z",
          "value": 34620,
          "cumulated": 40953,
          "stateOfCharge": 88,
          "price": 0.071721
        },
        {
          "date": "2018-12-20T12:42:29.933Z",
          "value": 33480,
          "cumulated": 41511,
          "stateOfCharge": 89,
          "price": 0.069359
        },
        {
          "date": "2018-12-20T12:43:29.933Z",
          "value": 32400,
          "cumulated": 42051,
          "stateOfCharge": 89,
          "price": 0.067122
        },
        {
          "date": "2018-12-20T12:44:29.933Z",
          "value": 31380,
          "cumulated": 42574,
          "stateOfCharge": 90,
          "price": 0.065009
        },
        {
          "date": "2018-12-20T12:45:29.933Z",
          "value": 30240,
          "cumulated": 43078,
          "stateOfCharge": 91,
          "price": 0.062647
        },
        {
          "date": "2018-12-20T12:46:29.933Z",
          "value": 29220,
          "cumulated": 43565,
          "stateOfCharge": 91,
          "price": 0.060534
        },
        {
          "date": "2018-12-20T12:47:29.933Z",
          "value": 28260,
          "cumulated": 44036,
          "stateOfCharge": 91,
          "price": 0.058545
        },
        {
          "date": "2018-12-20T12:48:29.933Z",
          "value": 27300,
          "cumulated": 44491,
          "stateOfCharge": 92,
          "price": 0.056556
        },
        {
          "date": "2018-12-20T12:49:29.933Z",
          "value": 26400,
          "cumulated": 44931,
          "stateOfCharge": 92,
          "price": 0.054692
        },
        {
          "date": "2018-12-20T12:50:29.933Z",
          "value": 25560,
          "cumulated": 45357,
          "stateOfCharge": 93,
          "price": 0.052952
        },
        {
          "date": "2018-12-20T12:51:29.933Z",
          "value": 24780,
          "cumulated": 45770,
          "stateOfCharge": 93,
          "price": 0.051336
        },
        {
          "date": "2018-12-20T12:52:29.933Z",
          "value": 23820,
          "cumulated": 46167,
          "stateOfCharge": 93,
          "price": 0.049347
        },
        {
          "date": "2018-12-20T12:53:29.933Z",
          "value": 23160,
          "cumulated": 46553,
          "stateOfCharge": 94,
          "price": 0.04798
        },
        {
          "date": "2018-12-20T12:54:29.933Z",
          "value": 22380,
          "cumulated": 46926,
          "stateOfCharge": 94,
          "price": 0.046364
        },
        {
          "date": "2018-12-20T12:55:29.933Z",
          "value": 21660,
          "cumulated": 47287,
          "stateOfCharge": 94,
          "price": 0.044872
        },
        {
          "date": "2018-12-20T12:56:29.933Z",
          "value": 20880,
          "cumulated": 47635,
          "stateOfCharge": 95,
          "price": 0.043256
        },
        {
          "date": "2018-12-20T12:57:29.933Z",
          "value": 20460,
          "cumulated": 47976,
          "stateOfCharge": 95,
          "price": 0.042386
        },
        {
          "date": "2018-12-20T12:58:29.933Z",
          "value": 20160,
          "cumulated": 48312,
          "stateOfCharge": 95,
          "price": 0.041765
        },
        {
          "date": "2018-12-20T12:59:29.933Z",
          "value": 19860,
          "cumulated": 48643,
          "stateOfCharge": 96,
          "price": 0.041143
        },
        {
          "date": "2018-12-20T13:00:29.933Z",
          "value": 19680,
          "cumulated": 48971,
          "stateOfCharge": 96,
          "price": 0.04077
        },
        {
          "date": "2018-12-20T13:01:29.933Z",
          "value": 19320,
          "cumulated": 49293,
          "stateOfCharge": 96,
          "price": 0.040025
        },
        {
          "date": "2018-12-20T13:02:29.933Z",
          "value": 19200,
          "cumulated": 49613,
          "stateOfCharge": 96,
          "price": 0.039776
        },
        {
          "date": "2018-12-20T13:03:29.933Z",
          "value": 18720,
          "cumulated": 49925,
          "stateOfCharge": 97,
          "price": 0.038782
        },
        {
          "date": "2018-12-20T13:04:29.933Z",
          "value": 18600,
          "cumulated": 50235,
          "stateOfCharge": 97,
          "price": 0.038533
        },
        {
          "date": "2018-12-20T13:05:29.933Z",
          "value": 18360,
          "cumulated": 50541,
          "stateOfCharge": 97,
          "price": 0.038036
        },
        {
          "date": "2018-12-20T13:06:29.933Z",
          "value": 18120,
          "cumulated": 50843,
          "stateOfCharge": 97,
          "price": 0.037539
        },
        {
          "date": "2018-12-20T13:07:29.933Z",
          "value": 17940,
          "cumulated": 51142,
          "stateOfCharge": 98,
          "price": 0.037166
        },
        {
          "date": "2018-12-20T13:08:29.933Z",
          "value": 17640,
          "cumulated": 51436,
          "stateOfCharge": 98,
          "price": 0.036544
        },
        {
          "date": "2018-12-20T13:09:29.933Z",
          "value": 17460,
          "cumulated": 51727,
          "stateOfCharge": 98,
          "price": 0.036171
        },
        {
          "date": "2018-12-20T13:10:29.933Z",
          "value": 17160,
          "cumulated": 52013,
          "stateOfCharge": 98,
          "price": 0.03555
        },
        {
          "date": "2018-12-20T13:11:29.933Z",
          "value": 16920,
          "cumulated": 52295,
          "stateOfCharge": 99,
          "price": 0.035053
        },
        {
          "date": "2018-12-20T13:12:29.933Z",
          "value": 16740,
          "cumulated": 52574,
          "stateOfCharge": 99,
          "price": 0.03468
        },
        {
          "date": "2018-12-20T13:13:29.933Z",
          "value": 16500,
          "cumulated": 52849,
          "stateOfCharge": 99,
          "price": 0.034182
        },
        {
          "date": "2018-12-20T13:14:29.933Z",
          "value": 16320,
          "cumulated": 53121,
          "stateOfCharge": 99,
          "price": 0.03381
        },
        {
          "date": "2018-12-20T13:15:29.933Z",
          "value": 16140,
          "cumulated": 53390,
          "stateOfCharge": 99,
          "price": 0.033437
        },
        {
          "date": "2018-12-20T13:16:29.933Z",
          "value": 15780,
          "cumulated": 53653,
          "stateOfCharge": 99,
          "price": 0.032691
        },
        {
          "date": "2018-12-20T13:17:29.933Z",
          "value": 9180,
          "cumulated": 53806,
          "stateOfCharge": 100,
          "price": 0.019018
        },
        {
          "date": "2018-12-20T13:18:29.933Z",
          "value": 1380,
          "cumulated": 53829,
          "stateOfCharge": 100,
          "price": 0.002859
        },
        {
          "date": "2018-12-20T13:19:29.933Z",
          "value": 4020,
          "cumulated": 53896,
          "stateOfCharge": 100,
          "price": 0.008328
        },
        {
          "date": "2018-12-20T13:20:29.933Z",
          "value": 4860,
          "cumulated": 53977,
          "stateOfCharge": 100,
          "price": 0.010068
        },
        {
          "date": "2018-12-20T13:21:29.933Z",
          "value": 5040,
          "cumulated": 54061,
          "stateOfCharge": 100,
          "price": 0.010441
        },
        {
          "date": "2018-12-20T13:22:29.933Z",
          "value": 5100,
          "cumulated": 54146,
          "stateOfCharge": 100,
          "price": 0.010566
        },
        {
          "date": "2018-12-20T13:23:29.933Z",
          "value": 5040,
          "cumulated": 54230,
          "stateOfCharge": 100,
          "price": 0.010441
        },
        {
          "date": "2018-12-20T13:24:29.933Z",
          "value": 4920,
          "cumulated": 54312,
          "stateOfCharge": 100,
          "price": 0.010193
        },
        {
          "date": "2018-12-20T13:25:29.933Z",
          "value": 4800,
          "cumulated": 54392,
          "stateOfCharge": 100,
          "price": 0.009944
        },
        {
          "date": "2018-12-20T13:26:29.933Z",
          "value": 4620,
          "cumulated": 54469,
          "stateOfCharge": 100,
          "price": 0.009571
        },
        {
          "date": "2018-12-20T13:27:29.933Z",
          "value": 4380,
          "cumulated": 54542,
          "stateOfCharge": 100,
          "price": 0.009074
        },
        {
          "date": "2018-12-20T13:28:29.933Z",
          "value": 4320,
          "cumulated": 54614,
          "stateOfCharge": 100,
          "price": 0.00895
        },
        {
          "date": "2018-12-20T13:29:29.933Z",
          "value": 4140,
          "cumulated": 54683,
          "stateOfCharge": 100,
          "price": 0.008577
        },
        {
          "date": "2018-12-20T13:30:29.933Z",
          "value": 4020,
          "cumulated": 54750,
          "stateOfCharge": 100,
          "price": 0.008328
        },
        {
          "date": "2018-12-20T13:31:29.933Z",
          "value": 3840,
          "cumulated": 54814,
          "stateOfCharge": 100,
          "price": 0.007955
        },
        {
          "date": "2018-12-20T13:32:29.933Z",
          "value": 3720,
          "cumulated": 54876,
          "stateOfCharge": 100,
          "price": 0.007707
        },
        {
          "date": "2018-12-20T13:33:29.933Z",
          "value": 3480,
          "cumulated": 54934,
          "stateOfCharge": 100,
          "price": 0.007209
        },
        {
          "date": "2018-12-20T13:34:29.933Z",
          "value": 3360,
          "cumulated": 54990,
          "stateOfCharge": 100,
          "price": 0.006961
        },
        {
          "date": "2018-12-20T13:35:29.933Z",
          "value": 3360,
          "cumulated": 55046,
          "stateOfCharge": 100,
          "price": 0.006961
        },
        {
          "date": "2018-12-20T13:36:29.933Z",
          "value": 3060,
          "cumulated": 55097,
          "stateOfCharge": 100,
          "price": 0.006339
        },
        {
          "date": "2018-12-20T13:37:29.933Z",
          "value": 3000,
          "cumulated": 55147,
          "stateOfCharge": 100,
          "price": 0.006215
        },
        {
          "date": "2018-12-20T13:38:29.933Z",
          "value": 2880,
          "cumulated": 55195,
          "stateOfCharge": 100,
          "price": 0.005966
        },
        {
          "date": "2018-12-20T13:39:29.933Z",
          "value": 2820,
          "cumulated": 55242,
          "stateOfCharge": 100,
          "price": 0.005842
        },
        {
          "date": "2018-12-20T13:40:29.933Z",
          "value": 2760,
          "cumulated": 55288,
          "stateOfCharge": 100,
          "price": 0.005718
        },
        {
          "date": "2018-12-20T13:41:29.933Z",
          "value": 2700,
          "cumulated": 55333,
          "stateOfCharge": 100,
          "price": 0.005593
        },
        {
          "date": "2018-12-20T13:42:29.933Z",
          "value": 2700,
          "cumulated": 55378,
          "stateOfCharge": 100,
          "price": 0.005593
        },
        {
          "date": "2018-12-20T13:43:29.933Z",
          "value": 2580,
          "cumulated": 55421,
          "stateOfCharge": 100,
          "price": 0.005345
        },
        {
          "date": "2018-12-20T13:44:29.933Z",
          "value": 2400,
          "cumulated": 55461,
          "stateOfCharge": 100,
          "price": 0.004972
        },
        {
          "date": "2018-12-20T13:45:29.933Z",
          "value": 2400,
          "cumulated": 55501,
          "stateOfCharge": 100,
          "price": 0.004972
        },
        {
          "date": "2018-12-20T13:46:29.933Z",
          "value": 2280,
          "cumulated": 55539,
          "stateOfCharge": 100,
          "price": 0.004723
        },
        {
          "date": "2018-12-20T13:47:29.933Z",
          "value": 2100,
          "cumulated": 55574,
          "stateOfCharge": 100,
          "price": 0.004351
        },
        {
          "date": "2018-12-20T13:48:29.933Z",
          "value": 2040,
          "cumulated": 55608,
          "stateOfCharge": 100,
          "price": 0.004226
        },
        {
          "date": "2018-12-20T13:49:29.933Z",
          "value": 1980,
          "cumulated": 55641,
          "stateOfCharge": 100,
          "price": 0.004102
        },
        {
          "date": "2018-12-20T13:50:29.933Z",
          "value": 1920,
          "cumulated": 55673,
          "stateOfCharge": 100,
          "price": 0.003978
        },
        {
          "date": "2018-12-20T13:51:29.933Z",
          "value": 1800,
          "cumulated": 55703,
          "stateOfCharge": 100,
          "price": 0.003729
        },
        {
          "date": "2018-12-20T13:52:29.933Z",
          "value": 1740,
          "cumulated": 55732,
          "stateOfCharge": 100,
          "price": 0.003605
        },
        {
          "date": "2018-12-20T13:53:29.933Z",
          "value": 1680,
          "cumulated": 55760,
          "stateOfCharge": 100,
          "price": 0.00348
        },
        {
          "date": "2018-12-20T13:54:29.933Z",
          "value": 1680,
          "cumulated": 55788,
          "stateOfCharge": 100,
          "price": 0.00348
        },
        {
          "date": "2018-12-20T13:55:29.933Z",
          "value": 1680,
          "cumulated": 55816,
          "stateOfCharge": 100,
          "price": 0.00348
        },
        {
          "date": "2018-12-20T13:56:29.933Z",
          "value": 1560,
          "cumulated": 55842,
          "stateOfCharge": 100,
          "price": 0.003232
        },
        {
          "date": "2018-12-20T13:57:29.933Z",
          "value": 1560,
          "cumulated": 55868,
          "stateOfCharge": 100,
          "price": 0.003232
        },
        {
          "date": "2018-12-20T13:58:29.933Z",
          "value": 1500,
          "cumulated": 55893,
          "stateOfCharge": 100,
          "price": 0.003108
        },
        {
          "date": "2018-12-20T13:59:29.933Z",
          "value": 1440,
          "cumulated": 55917,
          "stateOfCharge": 100,
          "price": 0.002983
        },
        {
          "date": "2018-12-20T14:00:29.933Z",
          "value": 1440,
          "cumulated": 55941,
          "stateOfCharge": 100,
          "price": 0.002983
        },
        {
          "date": "2018-12-20T14:01:29.933Z",
          "value": 1380,
          "cumulated": 55964,
          "stateOfCharge": 100,
          "price": 0.002859
        },
        {
          "date": "2018-12-20T14:02:29.933Z",
          "value": 1440,
          "cumulated": 55988,
          "stateOfCharge": 100,
          "price": 0.002983
        },
        {
          "date": "2018-12-20T14:03:29.933Z",
          "value": 1320,
          "cumulated": 56010,
          "stateOfCharge": 100,
          "price": 0.002735
        },
        {
          "date": "2018-12-20T14:04:29.933Z",
          "value": 1380,
          "cumulated": 56033,
          "stateOfCharge": 100,
          "price": 0.002859
        },
        {
          "date": "2018-12-20T14:05:29.933Z",
          "value": 1320,
          "cumulated": 56055,
          "stateOfCharge": 100,
          "price": 0.002735
        },
        {
          "date": "2018-12-20T14:06:29.933Z",
          "value": 1320,
          "cumulated": 56077,
          "stateOfCharge": 100,
          "price": 0.002735
        },
        {
          "date": "2018-12-20T14:07:29.933Z",
          "value": 1320,
          "cumulated": 56099,
          "stateOfCharge": 100,
          "price": 0.002735
        },
        {
          "date": "2018-12-20T14:08:29.933Z",
          "value": 1260,
          "cumulated": 56120,
          "stateOfCharge": 100,
          "price": 0.00261
        },
        {
          "date": "2018-12-20T14:09:29.933Z",
          "value": 1260,
          "cumulated": 56141,
          "stateOfCharge": 100,
          "price": 0.00261
        },
        {
          "date": "2018-12-20T14:10:11.624Z",
          "value": 1229.268292682927,
          "cumulated": 56155,
          "stateOfCharge": 100,
          "price": 0.00174
        }
      ]
    };
  }
}

export default ChartDetails;
