import React from 'react';
import { Linking, Text, View } from 'react-native';
import computeStyleSheet from './SettingsStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseScreen from '../base-screen/BaseScreen';
import BaseProps from '../../types/BaseProps';
import { DistanceUnit } from '../../types/Settings';
import SelectDropdown from 'react-native-select-dropdown';
import I18n from 'i18n-js';
import SecuredStorage from '../../utils/SecuredStorage';
import I18nManager from '../../I18n/I18nManager';
import { Button } from 'react-native-elements';
import Configuration from '../../config/Configuration';
import { Icon } from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import { scale } from 'react-native-size-matters';
import i18n from 'i18n-js';

export interface Props extends BaseProps{}

interface State {
  distanceUnit: DistanceUnit;
}

export default class Settings extends BaseScreen<Props, State> {
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {
      distanceUnit: null
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    const settings = await SecuredStorage.getSettings();
    const savedDistanceUnit = settings.distanceUnit;
    const distanceUnit = savedDistanceUnit ?? DistanceUnit.AUTOMATIC;
    this.setState({distanceUnit});
  }


  public render() {
    const style = computeStyleSheet();
    const { distanceUnit } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent containerStyle={style.headerContainer} navigation={this.props.navigation} title={I18n.t('sidebar.settings')} backArrow={true} />
        <View style={style.content}>
          <View style={style.settingSection}>
            <Text style={style.settingLabel}>{I18n.t('settingsDistanceUnit.distanceUnit')}</Text>
            <SelectDropdown
              statusBarTranslucent={true}
              data={Object.values(DistanceUnit)}
              onSelect={(selectedUnit: DistanceUnit) => void this.onDistanceUnitSelected(selectedUnit)}
              defaultValue={distanceUnit}
              rowStyle={style.selectDropdownRow}
              buttonTextStyle={style.selectDropdownButtonText}
              buttonStyle={style.selectDropdownButton}
              dropdownStyle={style.selectDropdown}
              buttonTextAfterSelection={(item: DistanceUnit) => I18n.t(`settingsDistanceUnit.${item.toString()}`)}
              renderCustomizedRowChild={(item: DistanceUnit) => (
                <View style={style.selectDropdownRowContainer}>
                  <Text style={style.selectDropdownRowText}>{I18n.t(`settingsDistanceUnit.${item.toString()}`)}</Text>
                </View>
              ) }   />
          </View>
          <View style={style.settingSection}>
            <Text style={[style.settingLabel, style.deleteAccountLabel]}>{I18n.t('settingsDeleteAccount.deleteAccount')}</Text>
            <Text style={style.deleteAccountText}>{I18n.t('settingsDeleteAccount.deleteAccountText', {contactEmail: Configuration.DPO_EMAIL})}</Text>
            <Button
              containerStyle={style.deleteAccountButtonContainer}
              buttonStyle={style.deleteAccountButton}
              titleStyle={style.deleteAccountButtonText}
              onPress={() => void Linking.openURL(
                `mailto:${Configuration.DPO_EMAIL}?subject=${I18n.t('settingsDeleteAccount.deleteAccountEmailSubject')}&body=${I18n.t('settingsDeleteAccount.deleteAccountEmailBody')}`
              )}
              title={I18n.t('settingsDeleteAccount.openEmailApp')}
              icon={<Icon style={style.buttonIcon} size={scale(18)} as={Entypo} name={'paper-plane'} />}
            />
          </View>
        </View>
      </View>
    );
  }

  private async onDistanceUnitSelected(distanceUnit: DistanceUnit): Promise<void> {
    I18nManager.switchDistanceUnit(distanceUnit);
    await SecuredStorage.saveSettingsValues({distanceUnit});
  }
}
