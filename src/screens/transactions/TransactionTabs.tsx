import I18n from 'i18n-js';
import { Icon, Tab, TabHeading, Tabs, Text } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import BackgroundComponent from '../../components/background/BackgroundComponent';
import BaseProps from '../../types/BaseProps';
import BaseScreen from '../base-screen/BaseScreen';
import TransactionsHistory from './history/TransactionsHistory';
import TransactionsInProgress from './in-progress/TransactionsInProgress';
import computeStyleSheet from './TransactionTabsStyles';

export interface Props extends BaseProps {
}

interface State {
}

export default class TransactionTabs extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate({ routeName: 'HomeNavigator' });
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <Tabs tabBarPosition='bottom' locked={false} initialPage={0}>
            <Tab
              heading={
                <TabHeading style={style.tabHeader}>
                  <Icon style={style.tabIcon} type='MaterialIcons' name='history' />
                  <Text>{I18n.t('transactions.history')}</Text>
                </TabHeading>
              }>
              <TransactionsHistory navigation={navigation} />
            </Tab>
            <Tab
              heading={
                <TabHeading style={style.tabHeader}>
                  <Icon style={style.tabIcon} type='FontAwesome' name='bolt' />
                  <Text>{I18n.t('transactions.in-progress')}</Text>
                </TabHeading>
              }>
              <TransactionsInProgress navigation={navigation} />
            </Tab>
          </Tabs>
        </BackgroundComponent>
      </ScrollView>
    );
  }
}
