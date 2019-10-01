import { Container } from 'native-base';
import React from 'react';
import BackgroundComponent from '../../../components/background/BackgroundComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import I18n from '../../../I18n/I18n';
import BaseProps from '../../../types/BaseProps';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import TransactionChart from './TransactionChart';
import computeStyleSheet from './TransactionChartStyles';

export interface Props extends BaseProps {
}

interface State {
  transactionID?: number;
  isAdmin?: boolean;
}

export default class TransactionChartContainer extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      transactionID: parseInt(Utils.getParamFromNavigation(this.props.navigation, 'transactionID', null), 10),
      isAdmin: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Refresh Admin
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.setState({
      isAdmin: securityProvider ? securityProvider.isAdmin() : false
    });
  }

  public async componentWillUnmount() {
    await super.componentWillUnmount();
  }

  public onBack = (): boolean => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { isAdmin } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t('transactions.chargingCurve')}
            leftAction={this.onBack}
            leftActionIcon={'navigate-before'}
            rightAction={this.props.navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          <TransactionChart
            transactionID={this.state.transactionID}
            navigation={this.props.navigation}
            showTransactionDetails={true}
            isAdmin={isAdmin}
          />
        </BackgroundComponent>
      </Container>
    );
  }
}
