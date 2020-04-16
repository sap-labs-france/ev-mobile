declare module "react-native-charts-wrapper" {
  interface Props {
    style: any;
    data: any;
    chartDescription: any;
    legend: any;
    marker: any;
    xAxis: any;
    yAxis: any;
    autoScaleMinMaxEnabled: boolean;
    animation: any;
    drawGridBackground: boolean;
    drawBorders: boolean;
    touchEnabled: boolean;
    dragEnabled: boolean;
    scaleEnabled: boolean;
    scaleXEnabled: boolean;
    scaleYEnabled: boolean;
    doubleTapToZoomEnabled: boolean;
    dragDecelerationEnabled: boolean;
    dragDecelerationFrictionCoef: number;
    keepPositionOnRotation: boolean;
    pinchZoom: boolean;
  }
  export class LineChart extends React.Component<Props> { }
}
