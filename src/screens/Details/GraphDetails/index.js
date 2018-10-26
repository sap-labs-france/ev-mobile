import React, { Component } from "react";
import { Dimensions } from "react-native"
import { Container, View, Text } from "native-base";

import { VictoryChart, VictoryTheme, VictoryArea } from "victory-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class GraphDetails extends Component {

  render() {
    return (
      <Container>
       <VictoryChart theme={VictoryTheme.material} width={deviceHeight}>
          <VictoryArea
            style={{ data: { fill: "#c43a31" } }}
            categories={{ x: ["dogs", "cats", "mice"]}}
            data={[
              { x: 1, y: 2, y0: 0 },
              { x: 2, y: 3, y0: 1 },
              { x: 3, y: 5, y0: 1 },
              { x: 4, y: 4, y0: 2 },
              { x: 5, y: 6, y0: 2 }
            ]}
          />
       </VictoryChart>
      </Container>
    );
  }
}

export default GraphDetails;
