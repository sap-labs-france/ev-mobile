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
      dataToDisplay: [],
      xCategory: [new Date().getHours() + ":" + new Date().getMinutes()],
      yCagegory: ["1000", "2000", "3000", "4000", "5000", "6000", "7000", "8000"]
    };
  }

  async componentDidMount() {
    const { connector } = this.state;
    if (connector.activeTransactionID) {
      await this.getChargingStationConsumption();
      await this._fillXAxis();
      await this._fillYAxis();
      await this._fillData();
    }
  }

  getChargingStationConsumption = async () => {
    try {
      let result = await _provider.getChargingStationConsumption({
        TransactionId: this.state.connector.activeTransactionID
      });
      if (result) {
        this.setState({
          values: result.values.length >= 450 ? result.values.slice(result.values.length - 450) : result.values
        });
      }
      console.log(result);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _fillYAxis = () => {
    const { connector } = this.state;
    let yAxis = [];
    let maxPower = connector.power;
    let index = 0;
    let chargerValuesByX = 500;

    while (index < maxPower) {
      if (yAxis.length > 8) {
        yAxis = [];
        chargerValuesByX += 500;
        index = chargerValuesByX;
      }
      yAxis.push((index += chargerValuesByX).toString());
    }
    this.setState({yCagegory: yAxis});
  }

  _fillXAxis = async () => {
    const { values } = this.state;
    let xAxis = [];
    let index = values.length;
    let takeDatabyX = 1;

    do {
      xAxis = this._takeDataByX(takeDatabyX);
      index -= 3;
      takeDatabyX += 3;
    } while (xAxis.length > 8);
    this.setState({xCategory: xAxis});
  }

  _takeDataByX = (number) => {
    let xAxis = [];
    this.state.values.forEach((element) => {
      if (new Date(element.date).getMinutes() % number === 0) {
        xAxis.push(new Date(element.date).getHours() + ":" + (new Date(element.date).getMinutes() < 10 ? "0" + new Date(element.date).getMinutes() : new Date(element.date).getMinutes()));
      }
    });
    return (xAxis);
  }

  _fillData = () => {
    const { values, xCategory } = this.state;
    let data = [];
    let found = 0;
    for (let index = 0; index < values.length && xCategory[found]; index++) {
      const hours = new Date(values[index].date).getHours();
      const minutes = (new Date(values[index].date).getMinutes() < 10 ? "0" + new Date(values[index].date).getMinutes() : new Date(values[index].date).getMinutes());
      const time = `${hours}:${minutes}`;
      if (time === xCategory[found]) {
          data.push({
          time,
          charge: (values[index].value).toString()
        });
        found++;
      }
    }
    console.log(data);
    // this.setState({dataToDisplay: data});
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
