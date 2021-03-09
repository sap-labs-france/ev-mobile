import {Thumbnail} from 'native-base';
import React from 'react';
import {ImageStyle, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import BaseProps from '../../types/BaseProps';
import Vehicle from '../../types/Vehicle';
import computeStyleSheet from './CarComponentStyle';

interface State {

}

export interface Props extends BaseProps {
  car: Vehicle;
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

  public render() {
    const style = computeStyleSheet();
    const {car, selected} = this.props;
    const carUsers = car.carUsers ? car.carUsers : [];
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
              <View style={style.column}>
                <Icon type='MaterialIcons' name='directions-car' iconStyle={style.icon}/>
                <Text style={style.text}>{car.type}</Text>
              </View>
              <View style={style.column}>
                {carUsers.length ?
                  (carUsers.length > 1 ?
                      <View style={style.column}>
                        <Icon type={'MaterialIcons'} name={'people'} iconStyle={style.icon}/>
                        <Text style={style.text}>{carUsers.length} users</Text>
                      </View>
                      :
                      <View style={style.column}>
                        <Icon type={'MaterialIcons'} name={'person'} iconStyle={style.icon}/>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.userName}>{carUsers[0].user?.firstName}</Text>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.userName}>{carUsers[0].user?.name}</Text>

                      </View>
                  )
                  :
                  <Text style={style.text}>-</Text>
                  }
              </View>
            </View>
            <View style={style.carInfosLine}>
              <View style={style.column}>
                <View style={style.iconContainer}>
                  <Icon iconStyle={style.icon} type='MaterialIcons' name='bolt'/>
                  <Icon iconStyle={style.dcIcon} type='MaterialIcons' name='power-input'/>
                </View>
                {car.carCatalog?.fastChargePowerMax ?
                  <Text style={style.text}>{car.carCatalog.fastChargePowerMax} kW</Text>
                  :
                  <Text style={style.text}>-</Text>}
              </View>
              <View style={style.column}>
                <View style={style.iconContainer}>
                  <Icon iconStyle={style.icon} type='MaterialIcons' name='bolt'/>
                  <Text style={style.ac}>AC</Text>
                </View>
                <Text style={style.text}>{car.converter?.powerWatts} kW</Text>
              </View>
            </View>
          </View>
          <Thumbnail square={true} style={style.imageStyle as ImageStyle} source={{uri: car.carCatalog?.image}}/>
        </View>
        <View/>
      </View>

    )
  }
}
