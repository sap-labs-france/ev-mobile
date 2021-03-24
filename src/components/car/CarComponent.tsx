import { Icon, Thumbnail } from 'native-base';
import React from 'react';
import { ImageStyle, Text, View } from 'react-native';
import BaseProps from '../../types/BaseProps';
import Car from '../../types/Car';
import Utils from '../../utils/Utils';
import UserAvatar from '../user/avatar/UserAvatar';
import computeStyleSheet from './CarComponentStyle';

interface State {
}

export interface Props extends BaseProps {
  car: Car;
  selected: boolean;
}

export default class CarComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private renderNoUser(style: any) {
    const { navigation } = this.props;
    return (
      <View style={style.line}>
        <View style={style.avatar}>
          <UserAvatar small={true} navigation={navigation}/>
        </View>
        <Text style={style.userName}>-</Text>
      </View>
    );
  }

  public render() {
    const style = computeStyleSheet();
    const { car, selected, navigation } = this.props;
    const carUsers = car?.carUsers ? car.carUsers : [];
    const defaultCarUser = carUsers.length === 1 ? carUsers[0] : carUsers?.find((userCar) => userCar.default === true);
    const otherUserCount = Math.max(carUsers.length - 1, 0);
    return (
      <View style={selected ? [style.container, style.selected] : style.container}>
        <View style={style.header}>
          <View style={style.carName}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.headerText, style.make]}>{car.carCatalog?.vehicleMake} {car.carCatalog?.vehicleModel} {car.carCatalog?.vehicleModelVersion}</Text>
          </View>
          <View style={style.licensePlate}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.headerText}>{car.licensePlate}</Text>
          </View>
        </View>
        <View/>
        <View style={style.carContent}>
          <View style={style.carInfos}>
            <View style={style.carInfosLine}>
              {defaultCarUser ?
                <View style={style.line}>
                  <View style={style.avatar}>
                    <UserAvatar small={true} user={defaultCarUser.user} navigation={navigation}/>
                  </View>
                  <View style={style.column}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.userName}>{Utils.buildUserName(defaultCarUser.user)}</Text>
                    <View style={{width: '100%', justifyContent: 'flex-start', flexDirection: 'row' }}>
                      {otherUserCount ? <Text style={style.text}>(+{otherUserCount})</Text> : null}
                    </View>
                  </View>
                </View>
                :
                this.renderNoUser(style)
                }
            </View>
            <View style={style.carInfosLine}>
              <View style={style.column}>
                <Icon type='MaterialIcons' name='battery-full' style={style.icon}/>
                <Text style={style.text}>{car.carCatalog?.batteryCapacityFull} kWh</Text>
              </View>
              <View style={style.column}>
                <View style={style.iconContainer}>
                  <Icon style={style.icon} type='MaterialIcons' name='bolt'/>
                  <Icon style={style.dcIcon} type='MaterialIcons' name='power-input'/>
                </View>
                {car.carCatalog?.fastChargePowerMax ?
                  <Text style={style.text}>{car?.carCatalog?.fastChargePowerMax} kW</Text>
                  :
                  <Text style={style.text}>-</Text>}
              </View>
              <View style={style.column}>
                <View style={style.iconContainer}>
                  <Icon style={style.icon} type='MaterialIcons' name='bolt'/>
                  <Icon style={style.dcIcon} type='MaterialCommunityIcons' name='sine-wave'/>
                </View>
                <Text style={style.text}>{car?.converter?.powerWatts} kW ({car?.converter?.numberOfPhases})</Text>
              </View>
            </View>
          </View>
          <Thumbnail square={true} style={style.imageStyle as ImageStyle} source={{uri: car?.carCatalog?.image}}/>
        </View>
        <View/>
      </View>
    );
  }
}
