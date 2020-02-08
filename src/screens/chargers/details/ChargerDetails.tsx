import I18n from 'i18n-js';
import { Container, Spinner, Text, View } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation from '../../../types/ChargingStation';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargerDetailsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  charger: ChargingStation;
}

export default class ChargerDetails extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      charger: null,
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
    // Get the provider
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    // Set
    this.setState({
      loading: false,
      charger,
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

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
            leftAction={() => this.onBack()}
            leftActionIcon={'navigate-before'}
            rightAction={navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.viewContainer}>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t('details.vendor')}</Text>
                <Text style={style.value}>{charger && charger.chargePointVendor ? charger.chargePointVendor : '-'}</Text>
              </View>
              <View style={style.descriptionContainer}>
                <Text style={style.label}>{I18n.t('details.model')}</Text>
                <Text style={style.value}>{charger && charger.chargePointModel ? charger.chargePointModel : '-'}</Text>
              </View>
              <View>
                <View style={style.descriptionContainer}>
                  <Text style={style.label}>{I18n.t('details.ocppVersion')}</Text>
                  <Text style={style.value}>{charger && charger.ocppVersion ? charger.ocppVersion : '-'}</Text>
                </View>
                <View style={style.descriptionContainer}>
                  <Text style={style.label}>{I18n.t('details.firmwareVersion')}</Text>
                  <Text style={style.value}>{charger && charger.firmwareVersion ? charger.firmwareVersion : '-'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Container>
      )
    );
  }
}
