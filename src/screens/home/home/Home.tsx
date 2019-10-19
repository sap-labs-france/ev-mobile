import { Container, View } from "native-base";
import React from "react";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18n from "../../../I18n/I18n";
import BaseProps from "../../../types/BaseProps";
import BaseScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./HomeStyles";

export interface Props extends BaseProps {
}

interface State {
  isPricingActive?: boolean;
  isAdmin?: boolean;
}

export default class TransactionsHistory extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      isPricingActive: false,
      isAdmin: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
  }

  public onBack = (): boolean => {
    // Do not bubble up
    return false;
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { isAdmin, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t("home.title")}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <View style={style.content}>
          </View>
        </BackgroundComponent>
      </Container>
    );
  };
}
