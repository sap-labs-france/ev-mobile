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
      xCategory: []
    };
  }

  async componentDidMount() {
    const { connector } = this.state;
    if (connector.activeTransactionID) {
      await this.getChargingStationConsumption();
      await this._fillAxis();
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

  _fillAxis = async () => {
    const { values } = this.state;
    let axis = [];
    let xAxisCategory = [];
    let index = values.length;
    let takeDatabyX = 1;

    do {
      axis = this._takeDataEveryXTimeAndSetAxis(takeDatabyX).axis;
      xAxisCategory = this._takeDataEveryXTimeAndSetAxis(takeDatabyX).xAxisCategory;
      index -= 3;
      takeDatabyX += 3;
    } while (axis.length > 8);
    this.setState({dataToDisplay: axis, xCategory: xAxisCategory});
  }

  _takeDataEveryXTimeAndSetAxis = (number) => {
    let xAxis;
    let xAxisCategory = [];
    let yAxis;
    let axis = [];
    let index = 1;

    this.state.values.forEach((element) => {
      if (new Date(element.date).getMinutes() % number === 0) {
        xAxisCategory.push(new Date(element.date).getHours() + ":" + (new Date(element.date).getMinutes() < 10 ? "0" + new Date(element.date).getMinutes() : new Date(element.date).getMinutes()));
        xAxis = index;
        yAxis = element.value;
        axis.push({x: xAxis, y: yAxis});
        index++;
      }
    });
    return {axis, xAxisCategory};
  }

  render() {
    const { dataToDisplay, xCategory, connector } = this.state;
    console.log("Data: ", dataToDisplay);
    return (
      <Container>
       <VictoryChart theme={VictoryTheme.material} width={deviceHeight} padding={styles.padding}>
          <VictoryArea
            style={{ data: styles.data}}
            domain={{y: [0, connector.power]}}
            categories={{
              x: xCategory
            }}
            data={[
              {x: 1, y: 7500},
              {x: 2, y: 10860},
              {x: 3, y: 10920},
              {x: 4, y: 10920},
              {x: 5, y: 10860},
              {x: 6, y: 10920},
              {x: 7, y: 10860},
              {x: 8, y: 10860}
            ]}
          />
          <VictoryAxis label={I18n.t("details.time")} style={{axisLabel: styles.xAxisLabel}} />
          <VictoryAxis dependentAxis label={I18n.t("details.chargeInWatts")} style={{ axisLabel: styles.yAxisLabel}} />
       </VictoryChart>
      </Container>
    );
  }
}

export default GraphDetails;
