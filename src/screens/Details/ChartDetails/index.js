import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Container } from "native-base";

import { VictoryChart, VictoryTheme, VictoryArea, VictoryAxis } from "victory-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";
import Constants from "../../../utils/Constants";
import I18n from "../../../I18n/I18n";
import styles from "./styles";

const _provider = ProviderFactory.getProvider();
const emptyChart = [{x:0, y:0}, {x:1, y:0}];

class ChartDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      values: null,
      valuesToDisplay: emptyChart,
      maxChartValue: this.props.navigation.state.params.connector.power
    };
  }

  async componentDidMount() {
    // Get the consumption
    await this.getChargingStationConsumption();
  }

  async componentWillUnmount() {
    // Clear interval if it exists
    if (this.timerChartData) {
      clearInterval(this.timerChartData);
    }
  }

  getChargingStationConsumption = async () => {
    try {
      // Active Transaction?
      if (this.state.connector.activeTransactionID) {
        // Clear interval if it exists
        if (!this.timerChartData) {
          // Start refreshing Charger Data
          this.timerChartData = setInterval(() => {
            // Refresh Consumption
            this.getChargingStationConsumption();
          }, Constants.AUTO_REFRESH_CHART_PERIOD_MILLIS);
        }
        // Get the consumption
        let result = await _provider.getChargingStationConsumption({
          TransactionId: this.state.connector.activeTransactionID
        });
        // At least 2 values for the chart!!!
        if (result.values && result.values.length > 1) {
          // Convert
          let firstDate, maxFoundValue = 0;
          const valuesToDisplay = result.values.map((value, index) => { 
            let minutes;
            // Keep the date
            if (index === 0) {
              firstDate = new Date(value.date);
              minutes = 0;
            } else {
              // Compute the mins elapsed
              minutes = Math.trunc((new Date(value.date).getTime() - firstDate.getTime()) / (60 * 1000));
            }
            // Check max
            if ((value.value < this.state.connector.power) && (value.value > maxFoundValue)) {
              // Set
              maxFoundValue = value.value;
            }
            return {x: minutes, y: value.value} 
          });
          // Set
          this.setState({
            values: result.values,
            valuesToDisplay : valuesToDisplay,
            maxChartValue: maxFoundValue
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
          valuesToDisplay: emptyChart,
          maxFoundValue: this.state.connector.power
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const { maxChartValue } = this.state;
    return (
      <Container>
        <VictoryChart theme={VictoryTheme.material} width={hp("100%")} height={wp("90%")} padding={styles.padding} domain={{y: [0, (maxChartValue * 1.1)]}}>
          <VictoryArea
            style={{ data: { fill: "cyan", stroke: "cyan" } }}
            data={this.state.valuesToDisplay}
          />
          <VictoryAxis label={I18n.t("details.time")} style={{axisLabel: styles.xAxisLabel}} />
          <VictoryAxis dependentAxis label={I18n.t("details.chargeInWatts")} style={{axisLabel: styles.yAxisLabel}} />
        </VictoryChart>
      </Container>
    );
  }
}

export default ChartDetails;
