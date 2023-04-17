import React from 'react';
import { Text, View } from 'react-native';
import computeStyleSheet from './SettingsStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseScreen from '../base-screen/BaseScreen';
import BaseProps from '../../types/BaseProps';
import { DistanceUnit } from '../../types/Settings';
import SelectDropdown from 'react-native-select-dropdown';
import I18n from 'i18n-js';
import SecuredStorage from '../../utils/SecuredStorage';
import I18nManager from '../../I18n/I18nManager';

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
        <HeaderComponent containerStyle={style.headerContainer} navigation={this.props.navigation} title={I18n.t('sidebar.settings')} sideBar={this.canOpenDrawer} />
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
        </View>
      </View>
    );
  }

  private async onDistanceUnitSelected(distanceUnit: DistanceUnit): Promise<void> {
    I18nManager.switchDistanceUnit(distanceUnit);
    await SecuredStorage.saveSettingsValues({distanceUnit});
  }
}
