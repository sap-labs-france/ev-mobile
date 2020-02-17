import I18n from 'i18n-js';
import { Container, Spinner, Text, View } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargingStationConfiguration } from '../../../types/ChargingStation';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargerOcppParametersStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  charger: ChargingStation;
  chargerConfiguration?: ChargingStationConfiguration;
}

export default class ChargerOcppParameters extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      charger: null,
      loading: true,
      chargerConfiguration: null
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    const chargerID = Utils.getParamFromNavigation(this.props.navigation, 'chargerID', null);
    // Get Charger
    const charger = await this.getCharger(chargerID);
    // Get Charger Config
    const chargerConfiguration = await this.getChargerConfiguration(chargerID);
    // Set
    this.setState({
      loading: false,
      charger,
      chargerConfiguration
    });
  }

  public getCharger = async (chargerID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      return charger;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
    return null;
  };

  public getChargerConfiguration = async (chargerID: string): Promise<ChargingStationConfiguration> => {
    try {
      // Get Charger
      const chargerConfiguration = await this.centralServerProvider.getChargerConfiguration(chargerID);
      return chargerConfiguration;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
    return null;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  private displayConfiguration(): Element[] {
    const properties: Element[] = [];
    const { chargerConfiguration } = this.state;
    const style = computeStyleSheet();
    let bgStyleEven = false;
    for (const ocppParam of chargerConfiguration.configuration) {
      bgStyleEven = !bgStyleEven;
      properties.push(
        <View style={bgStyleEven ? [style.descriptionContainer, style.rowBackground] : style.descriptionContainer}>
          <Text style={style.label}>{ocppParam.key}</Text>
          <ScrollView horizontal={true} alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValue}>
            <Text style={style.value}>{ocppParam.value}</Text>
          </ScrollView>
        </View>
      );
    }
    return properties;
  }

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, charger } = this.state;
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <Container style={style.container}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={charger ? charger.id : I18n.t('connector.unknown')}
            subTitle={charger && charger.inactive ? `(${I18n.t('details.inactive')})` : null}
            leftAction={() => this.onBack()}
            leftActionIcon={'navigate-before'}
            rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
            rightActionIcon={'menu'}
          />
          <ScrollView contentContainerStyle={style.scrollViewContainer} alwaysBounceVertical={false}>
            <View style={style.viewContainer}>
              {this.displayConfiguration()}
            </View>
          </ScrollView>
        </Container>
      )
    );
  }
}
