import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Container } from "native-base";

import { VictoryChart, VictoryTheme, VictoryArea, VictoryAxis } from "victory-native";

import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";
import I18n from "../../../I18n/I18n";
import styles from "./styles";

const deviceHeight = Dimensions.get("window").height;
const _provider = ProviderFactory.getProvider();

class GraphDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha,
      values: [],
      xCategory: [],
      yCagegory: []
    };
  }

  async componentDidMount() {
    await this.getChargingStationConsumption();
    await this._fillYAxis();
    await this._fillXAxis();
  }

  getChargingStationConsumption = async () => {
    const { connector } = this.state;
    if (connector.activeTransactionID) {
      try {
        let result = await _provider.getChargingStationConsumption({
          TransactionId: this.state.connector.activeTransactionID
        });
        this.setState({
          values: result.values
        });
        console.log(result);
      } catch (error) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props);
      }
    }
  }

  _fillYAxis = () => {
    const { connector } = this.state;
    let yAxis = [];
    let yMin = connector.currentConsumption - 10000 <= 0 ? 1000 : connector.currentConsumption - 5000;
    let yMax = connector.currentConsumption - 10000 <= 0 ? 8000 : connector.currentConsumption + 2000;
    for (var i = yMin; i <= yMax; i = i + 1 * 1000) {
      yAxis.push((Math.round(i / 1000) + "000").toString());
    }
    this.setState({yCagegory: yAxis});
  }

  _fillXAxis = async () => {
    let xAxis = [];
    let index = 10;
    do {
      xAxis = this._takeDataEveryX(index);
      index += 10;
    } while (xAxis.length > 8);
    this.setState({
      xCategory: xAxis
    });
    console.log(xAxis);
  }

  _takeDataEveryX = (value) => {
    let xAxis = [];
    this.state.values.forEach((element) => {
      if (new Date(element.date).getMinutes() % value === 0) {
        xAxis.push(new Date(element.date).getHours() + ":" + (new Date(element.date).getMinutes() < 10 ? "0" + new Date(element.date).getMinutes() : new Date(element.date).getMinutes()));
      }
    });
    return (xAxis);
  }

  _closestMaxNumber = (minNumber, maxNumber, number) => {
    if ((number >= minNumber || number <= maxNumber) && (maxNumber - minNumber) > 0) {
      let differenceMaxNumber = maxNumber - number;
      let differenceMinNumber = number - minNumber;
      if (differenceMaxNumber <= differenceMinNumber) {
        return maxNumber;
      } else {
        return minNumber;
      }
    }
  }

  render() {
    return (
      <Container>
       <VictoryChart theme={VictoryTheme.material} width={deviceHeight} padding={styles.padding} >
          <VictoryArea
            style={{ data: styles.data}}
            domain={{ x: [0, 8], y: [0, 8] }}
            categories={{
              x: this.state.xCategory,
              y: this.state.yCagegory
            }}
            data={[
              { time: 0, charge: 0 },
              { time: 1, charge: 2 },
              { time: 2, charge: 2 },
              { time: 3, charge: 3 },
              { time: 4, charge: 4 },
              { time: 5, charge: 5 },
              { time: 6, charge: 6 },
              { time: 7, charge: 7 },
              { time: 8, charge: 8 }
            ]}
            x="time"
            y="charge"
          />
          <VictoryAxis label={I18n.t("details.time")} style={{axisLabel: styles.xAxisLabel}} />
          <VictoryAxis dependentAxis label={I18n.t("details.chargeInWatts")} style={{ axisLabel: styles.yAxisLabel}} />
       </VictoryChart>
      </Container>
    );
  }
}

export default GraphDetails;
