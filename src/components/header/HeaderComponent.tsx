import { Body, Header, Icon, Left, Right, Subtitle, Title } from 'native-base';
import React from 'react';
import { BackHandler, Image, ImageStyle, View, TouchableOpacity } from 'react-native';

import defaultTenantLogo from '../../../assets/logo-low.png';
import FilterModalContainerComponent from '../../components/search/filter/containers/FilterModalContainerComponent';
import BaseProps from '../../types/BaseProps';
import { IconType } from '../../types/Icon';
import computeStyleSheet from './HeaderComponentStyles';

export interface Props extends BaseProps {
  title: string;
  subTitle?: string;
  hideHomeAction?: boolean;
  leftAction?: () => boolean;
  leftActionIcon?: string;
  leftActionIconType?: IconType;
  rightAction?: () => boolean;
  rightActionIcon?: string;
  rightActionIconType?: IconType;
  filters?: any;
  displayMap?: boolean;
  mapIsDisplayed?: boolean;
  displayMapAction?: () => void;
  tenantLogo?: string;
  displayTenantLogo?: boolean;
}

interface State {
  hasFilter?: boolean;
}

export default class HeaderComponent extends React.Component<Props, State> {
  public static defaultProps = {
    leftActionIconType: 'MaterialIcons',
    rightActionIconType: 'MaterialIcons',
    displayTenantLogo: true
  };
  public state: State;
  public props: Props;
  private filterModalContainerComponent: FilterModalContainerComponent;

  public constructor(props: Props) {
    super(props);
    this.state = {
      hasFilter: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public getFilterModalContainerComponent(): FilterModalContainerComponent {
    return this.filterModalContainerComponent;
  }

  public setFilterModalContainerComponent(filterModalContainerComponent: FilterModalContainerComponent) {
    this.filterModalContainerComponent = filterModalContainerComponent;
    this.setState({
      hasFilter: true
    });
  }

  public componentDidMount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.addEventListener('hardwareBackPress', leftAction);
    }
  }

  public componentWillUnmount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.removeEventListener('hardwareBackPress', leftAction);
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { hasFilter } = this.state;
    const {
      title,
      subTitle,
      leftAction,
      leftActionIcon,
      leftActionIconType,
      rightAction,
      rightActionIcon,
      rightActionIconType,
      hideHomeAction,
      tenantLogo,
      displayMap,
      displayMapAction,
      mapIsDisplayed,
      navigation,
      displayTenantLogo
    } = this.props;
    return (
      <Header style={style.header}>
        <Left style={style.leftHeader}>
          {leftAction ? (
            <View style={style.leftHeader}>
              <Icon type={leftActionIconType} name={leftActionIcon} style={style.iconLeftHeader} onPress={leftAction} />
              {!hideHomeAction && (
                <Icon type="MaterialIcons" name="home" style={style.iconLeftHeader} onPress={() => navigation.navigate('HomeNavigator')} />
              )}
            </View>
          ) : (
            displayTenantLogo && (
              <Image source={tenantLogo ? { uri: tenantLogo } : defaultTenantLogo} style={style.logoHeader as ImageStyle} />
            )
          )}
        </Left>
        <Body style={style.bodyHeader}>
          <Title style={[style.titleHeader, subTitle ? style.titleHeaderWithSubTitle : null]}>{title}</Title>
          {subTitle && <Subtitle style={style.subTitleHeader}>{subTitle}</Subtitle>}
        </Body>
        <Right style={style.rightHeader}>
          {hasFilter && (
            <TouchableOpacity
              onPress={() => {
                // Show Filter Search
                if (this.filterModalContainerComponent) {
                  this.filterModalContainerComponent.setVisible(true);
                }
              }}>
              <Icon
                type={'MaterialCommunityIcons'}
                name={
                  this.filterModalContainerComponent && this.filterModalContainerComponent.getNumberOfFilters() > 0
                    ? 'filter'
                    : 'filter-outline'
                }
                style={style.iconRightHeader}
              />
            </TouchableOpacity>
          )}
          {displayMap && (
            <Icon
              type="FontAwesome5"
              name={mapIsDisplayed ? 'list' : 'map-marked-alt'}
              style={style.mapListIcon}
              onPress={displayMapAction}
            />
          )}
          {rightAction ? (
            <Icon type={rightActionIconType} name={rightActionIcon} style={style.iconRightHeader} onPress={rightAction} />
          ) : (
            displayTenantLogo && (
              <Image source={tenantLogo ? { uri: tenantLogo } : defaultTenantLogo} style={style.logoHeader as ImageStyle} />
            )
          )}
        </Right>
      </Header>
    );
  };
}
