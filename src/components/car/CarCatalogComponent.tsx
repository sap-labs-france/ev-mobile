import { Icon } from 'native-base';
import React from 'react';
import { Image, ImageStyle, Text, View, ViewStyle } from 'react-native';

import BaseProps from '../../types/BaseProps';
import { CarCatalog } from '../../types/Car';
import Utils from '../../utils/Utils';
import computeStyleSheet from './CarCatalogComponentStyle';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import I18n from 'i18n-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface State {
  noImage?: boolean;
}

export interface Props extends BaseProps {
  carCatalog: CarCatalog;
  selected?: boolean;
  containerStyle?: ViewStyle[];
}

export default class CarCatalogComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {
      noImage: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const listItemCommonStyle = computeListItemCommonStyle();
    const { carCatalog, containerStyle } = this.props;
    const carFullName = Utils.buildCarCatalogName(carCatalog);
    const imageURI = carCatalog?.image;
    const image = this.state.noImage ? require('../../../assets/no-image.png') : {uri: imageURI};
    return (
      <View style={[listItemCommonStyle.container, style.carCatalogContainer, ...(containerStyle || [])]}>
        {imageURI ? (
          <Image onError={() => this.setState({ noImage: true })} resizeMethod={'auto'} style={style.imageStyle as ImageStyle} source={image} />
        ) : (
          <View style={style.noImageContainer}>
            <Icon size={scale(75)} style={style.carImagePlaceholder} as={Ionicons} name={'car-sport'} />
          </View>
        )}
        <View style={style.rightContainer}>
          <View style={style.header}>
            <Text numberOfLines={2} ellipsizeMode={'tail'} style={[style.headerText, style.carName]}>
              {carFullName}{' '}
            </Text>
          </View>
          <View style={style.carInfos}>
            <View style={style.powerDetailsContainer}>
              <View style={style.columnContainer}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} as={MaterialIcons} name="battery-full" style={style.icon} />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {carCatalog?.batteryCapacityFull} kW.h
                </Text>
              </View>
              <View style={style.columnContainer}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} as={MaterialCommunityIcons} name="road-variant" style={style.icon} />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {carCatalog?.rangeReal} km
                </Text>
              </View>
              <View style={style.columnContainer}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} style={style.icon} as={MaterialCommunityIcons} name="piston" />
                </View>
                {carCatalog?.drivetrainPowerHP ? (
                  <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                    {carCatalog?.drivetrainPowerHP} {I18n.t('cars.drivetrainPowerUnit')}
                  </Text>
                ) : (
                  <Text style={style.text}>-</Text>
                )}
              </View>
              <View style={style.columnContainer}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} style={style.icon} as={MaterialIcons} name="bolt" />
                  <Icon style={[style.icon, style.currentTypeIcon]} as={MaterialCommunityIcons} name="sine-wave" />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {carCatalog?.chargeStandardPower} kW
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
