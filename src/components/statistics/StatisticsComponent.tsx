import React from 'react';
import { Text, View } from 'react-native';
import computeStyleSheet from './StatisticsComponentStyles';

interface State {}

export interface Props {
  renderIcon?: (style?: any) => React.ReactElement;
  value?: string;
  prefix?: string;
  prefixWithSecondLine?: boolean;
  secondLine?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default class StatisticsComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public render() {
    const style = computeStyleSheet();
    const { backgroundColor, renderIcon, value, prefix, secondLine, prefixWithSecondLine, description, textColor } = this.props;
    const commonTextStyle = textColor ? { ...style.text, color: textColor } : style.text;
    const iconStyle = textColor ? { ...style.icon, color: textColor } : style.icon;
    return (
      <View style={[style.container, backgroundColor && { backgroundColor }]}>
        <View style={style.iconTextContainer}>
          {renderIcon?.(iconStyle)}
          <View style={style.valueUnitContainer}>
            <Text style={[commonTextStyle, style.valueText]}>
              {value} {!prefixWithSecondLine && prefix}
            </Text>
            {!!secondLine && (
              <Text style={[commonTextStyle, style.unitText]}>
                {prefixWithSecondLine && prefix}
                {secondLine}
              </Text>
            )}
          </View>
        </View>
        <Text style={[commonTextStyle, style.descriptionText]}>{description}</Text>
      </View>
    );
  }
}
