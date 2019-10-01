import { Container, Spinner } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';
import HeaderComponent from '../../../components/header/HeaderComponent';
import I18n from '../../../I18n/I18n';
import BaseProps from '../../../types/BaseProps';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './EulaStyles';

export interface Props extends BaseProps {
}

interface State {
  i18nLocale?: string;
  loading?: boolean;
  eulaTextHtml?: string;
}

export default class Eula extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      eulaTextHtml: '',
      i18nLocale: I18n.currentLocale().substr(0, 2),
      loading: true,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    this.refresh();
  }

  public refresh = async () => {
    await this.endUserLicenseAgreement();
  };

  public endUserLicenseAgreement = async () => {
    const { i18nLocale } = this.state;
    try {
      const result: any = await this.centralServerProvider.getEndUserLicenseAgreement({
        Language: i18nLocale
      });
      this.setState({
        loading: false,
        eulaTextHtml: result.text
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('Login');
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const { eulaTextHtml, loading } = this.state;
    return (
      <Container>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('authentication.eula')}
          leftAction={() => this.props.navigation.navigate('Login')}
          leftActionIcon={'navigate-before'}
        />
        {loading ? (
          <Spinner style={style.spinner} color='white' />
        ) : (
          <ScrollView style={style.container}>
            <HTMLView value={eulaTextHtml} />
          </ScrollView>
        )}
      </Container>
    );
  }
}
