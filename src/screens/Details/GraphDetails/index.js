import React, { Component } from "react";
import { Dimensions } from "react-native"
import { Container, View, Text } from "native-base";

import { VictoryChart, VictoryTheme, VictoryArea, VictoryAxis } from "victory-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class GraphDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha,
      xCategory: [],
      yCagegory: []
    };
  }

  componentDidMount() {
    this._fillYAxis();
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

  render() {
    console.log(this.state.connector);
    return (
      <Container>
       <VictoryChart theme={VictoryTheme.material} width={deviceHeight} padding={{ top: 20, bottom: 80, left: 70, right: 20 }} >
          <VictoryArea
            style={{ data: { fill: "#FFFFFF", fillOpacity: 0.6, stroke: "#c43a31", strokeWidth: 3 }}}
            domain={{ x: [0, 8], y: [0, 8] }}
            categories={{
              x: ["13h10", "13h20", "13h30", "13h40", "13h50", "14h00", "14h10", "14h20"],
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
          <VictoryAxis
            label="Time"
            style={{
              axisLabel: { padding: 35, fill: "#FFFFFF", fontWeight: "bold", fontSize: 15 }
            }}
          />
          <VictoryAxis dependentAxis
            label="Charge in Watt(s)"
            style={{
              axisLabel: { padding: 55, fill: "#FFFFFF", fontWeight: "bold", fontSize: 15 }
            }}
          />
       </VictoryChart>
      </Container>
    );
  }
}

export default GraphDetails;
