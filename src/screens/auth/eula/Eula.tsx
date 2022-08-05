import I18n from 'i18n-js';
import { Container, Spinner } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './EulaStyles';
import { StatusCodes } from 'http-status-codes';
import Message from '../../../utils/Message';

export interface Props extends BaseProps {}

interface State {
  i18nLanguage?: string;
  loading?: boolean;
  eulaTextHtml?: string;
}

export default class Eula extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      eulaTextHtml: '',
      i18nLanguage: Utils.getLanguageFromLocale(I18n.currentLocale()),
      loading: true
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    await super.componentDidMount();
    await this.loadEndUserLicenseAgreement();
  }

  public loadEndUserLicenseAgreement = async () => {
    const { i18nLanguage: i18nLanguage } = this.state;
    try {
      const result: any = await this.centralServerProvider.getEndUserLicenseAgreement({
        Language: i18nLanguage
      });
      this.setState({
        loading: false,
        eulaTextHtml: result.text
      });
    } catch (error) {
      await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'general.eulaUnexpectedError', this.props.navigation, null, async () => this.loadEndUserLicenseAgreement());
    }
  };

  public render() {
    const style = computeStyleSheet();
    const { eulaTextHtml, loading } = this.state;
    return (
      <Container>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('authentication.eula')}
        />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <ScrollView style={style.container}>
            <HTMLView textComponentProps={{style: {color: Utils.getCurrentCommonColor().textColor}}} value={eulaTextHtml} />
          </ScrollView>
        )}
      </Container>
    );
  }
}
