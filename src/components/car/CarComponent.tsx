import { Icon } from 'native-base';
import React from 'react';
import { Image, ImageStyle, Text, View, ViewStyle } from 'react-native';

import BaseProps from '../../types/BaseProps';
import Car from '../../types/Car';
import Utils from '../../utils/Utils';
import UserAvatar from '../user/avatar/UserAvatar';
import computeStyleSheet from './CarComponentStyle';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import I18n from 'i18n-js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

interface State {
  noImage?: boolean;
}

export interface Props extends BaseProps {
  car: Car;
  selected?: boolean;
  containerStyle?: ViewStyle[];
}

export default class CarComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {};
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
    const { car, navigation, containerStyle } = this.props;
    const userName = Utils.buildUserName(car?.user);
    const carFullName = Utils.buildCarCatalogName(car?.carCatalog);
    const carFullNameWords = carFullName?.split(' ') ?? [];
    const imageURI = car?.carCatalog?.image;
    const image = this.state.noImage ? require('../../../assets/no-image.png') : {uri: imageURI};
    return (
      <View style={[listItemCommonStyle.container, ...(containerStyle || [])]}>
        <View style={style.header}>
          <View style={style.statusNameContainer}>
            {carFullNameWords.map((word, index) => (
              <Text key={index} numberOfLines={1} ellipsizeMode={'tail'} style={[style.headerText, style.carName]}>
                {word}{' '}
              </Text>
            ))}
            {!!car?.default && (
              <View style={style.defaultContainer}>
                <Text style={style.defaultText}>{I18n.t('general.default')}</Text>
              </View>
            )}
          </View>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.headerText, style.licensePlate]}>
            {car?.licensePlate}
          </Text>
        </View>
        <View style={style.bottomContainer}>
          {imageURI ? (
            <Image onError={() => this.setState({ noImage: true })} resizeMethod={'auto'} style={style.imageStyle as ImageStyle} source={image} />
          ) : (
            <View style={style.noImageContainer}>
              <Icon style={style.carImagePlaceholder} as={Ionicons} name={'car-sport'} />
            </View>
          )}

          <View style={style.carInfos}>
            <View style={style.userContainer}>
              <View style={[style.avatarContainer]}>
                <UserAvatar size={20} user={car?.user} navigation={navigation} />
              </View>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.userName]}>
                {userName}
              </Text>
            </View>
            <View style={style.powerDetailsContainer}>
              <View style={[style.columnContainer, style.columnContainerBorderRight]}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} as={MaterialIcons} name="battery-full" style={style.icon} />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {car?.carCatalog?.batteryCapacityFull} kW.h
                </Text>
              </View>
              <View style={[style.columnContainer, style.columnContainerBorderRight]}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} style={style.icon} as={MaterialIcons} name="bolt" />
                  <Icon style={[style.icon, style.currentTypeIcon]} as={MaterialIcons} name="power-input" />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {Utils.buildCarFastChargePower(car?.carCatalog?.fastChargePowerMax)}
                  {car?.carCatalog?.fastChargePowerMax ? ' kW' : ''}
                </Text>
              </View>
              <View style={style.columnContainer}>
                <View style={style.iconContainer}>
                  <Icon size={scale(20)} style={style.icon} as={MaterialIcons} name="bolt" />
                  <Icon style={[style.icon, style.currentTypeIcon]} as={MaterialCommunityIcons} name="sine-wave" />
                </View>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[style.text, style.powerDetailsText]}>
                  {car?.converter?.powerWatts} kW ({car?.converter?.numberOfPhases})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
