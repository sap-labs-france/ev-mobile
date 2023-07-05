import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import { ImageBackground, ImageStyle, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { scale } from 'react-native-size-matters';
import noSite from '../../../../assets/no-site.png';
import I18nManager from '../../../I18n/I18nManager';
import HeaderComponent from '../../../components/header/HeaderComponent';
import UserAvatar from '../../../components/user/avatar/UserAvatar';
import BaseProps from '../../../types/BaseProps';
import Reservation, { ReservationStatus } from '../../../types/Reservation';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './ReservationDetailsStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RestResponse } from '../../../types/ActionResponse';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import User from '../../../types/User';
import DialogModal from '../../../components/modal/DialogModal';
import computeModalCommonStyle from '../../../components/modal/ModalCommonStyle';
import computeFabStyles from '../../../components/fab/FabComponentStyles';
import BaseAutoRefreshScreen from '../../../screens/base-screen/BaseAutoRefreshScreen';
import SiteArea from '../../../types/SiteArea';
import Site from '../../../types/Site';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  reservation?: Reservation;
  siteAreaImage?: string;
  isSmartChargingActive?: boolean;
  isCarActive?: boolean;
  buttonDisabled?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  isSiteAdmin?: boolean;
  canCancelReservation?: boolean;
  showCancelReservationDialog: boolean;
  canDeleteReservation?: boolean;
  showDeleteReservationDialog: boolean;
}

export default class ReservationDetails extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      siteAreaImage: null,
      isAdmin: false,
      isSiteAdmin: false,
      isSmartChargingActive: false,
      isCarActive: false,
      buttonDisabled: true,
      refreshing: false,
      canCancelReservation: false,
      showCancelReservationDialog: false,
      canDeleteReservation: false,
      showDeleteReservationDialog: false
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
    let siteAreaImage: string = null;
    let siteArea: SiteArea = null;
    let site: Site = null;
    const reservationID = Utils.getParamFromNavigation(this.props.route, 'reservationID', null) as number;
    const reservation = await this.getReservation(reservationID);
    if (reservation && reservation.chargingStation.siteAreaID && this.isMounted()) {
      siteAreaImage = await this.getSiteAreaImage(reservation.chargingStation.siteAreaID);
    }
    siteArea = reservation.chargingStation.siteArea ?? null;
    site = reservation.chargingStation.site ?? null;
    const connector = Utils.getConnectorFromID(reservation.chargingStation, reservation.connectorID);
    this.setState({
      reservation,
      loading: false,
      siteAreaImage,
      isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
      isSiteAdmin: this.securityProvider && reservation && siteArea ? this.securityProvider.isSiteAdmin(site.id as string) : false,
      isCarActive: this.securityProvider.isComponentCarActive(),
      isSmartChargingActive: this.securityProvider.isComponentSmartCharging(),
      canCancelReservation: reservation ? this.securityProvider.canCancelReservation(connector, siteArea) : false,
      canDeleteReservation: reservation ? this.securityProvider.canDeleteReservation(reservation, siteArea) : false
    });
  }

  public getReservation = async (reservationID: number): Promise<Reservation> => {
    try {
      const reservation = await this.centralServerProvider.getReservation(reservationID, {
        WithChargingStation: true,
        WithTag: true,
        WithUser: true,
        WithSiteArea: true,
        WithSite: true,
        WithCar: true
      });
      return reservation;
    } catch (error) {
      switch (error.request.status) {
        case StatusCodes.NOT_FOUND:
          Message.showError(I18n.t('reservations.reservationDoesNotExist'));
          break;
        default:
          await Utils.handleHttpUnexpectedError(
            this.centralServerProvider,
            error,
            'reservations.reservationUnexpectedError',
            this.props.navigation
          );
      }
    }
  };

  public getSiteAreaImage = async (siteAreaID: string): Promise<string> => {
    try {
      const siteAreaImage = await this.centralServerProvider.getSiteAreaImage(siteAreaID);
      return siteAreaImage;
    } catch (error) {
      if (error.request.status !== StatusCodes.NOT_FOUND) {
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'sites.siteAreaUnexpectedError', this.props.navigation);
      }
    }
    return null;
  };

  public renderUserInfo = (style: any) => {
    const { reservation } = this.state;
    return reservation.tag?.user ? (
      <View style={style.columnContainer}>
        <UserAvatar size={44} user={reservation.tag.user} navigation={this.props.navigation} />
        <Text numberOfLines={1} style={[style.label, style.labelUser, style.info]}>
          {Utils.buildUserName(reservation.tag.user)}
        </Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <UserAvatar user={null} navigation={this.props.navigation} />
        <Text style={[style.label, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderReservationStatus = (style: any) => {
    const { reservation } = this.state;
    return (
      <View style={style.columnContainer}>
        {Utils.buildReservationStatusIcon(reservation.status, style)}
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {Utils.translateReservationStatus(reservation.status)}
        </Text>
      </View>
    );
  };

  public renderReservationType = (style: any) => {
    const { reservation } = this.state;
    return (
      <View style={style.columnContainer}>
        {Utils.buildReservationTypeIcon(reservation.type, style)}
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {Utils.translateReservationType(reservation.type)}
        </Text>
      </View>
    );
  };

  public renderChargingStation = (style: any) => {
    const { reservation } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialCommunityIcons} name="ev-station" style={[style.icon, style.info]} />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {reservation.chargingStationID}
        </Text>
      </View>
    );
  };

  public renderChargingStationConnector = (style: any) => {
    const { reservation } = this.state;
    const chargingStation = reservation?.chargingStation;
    const connector = Utils.getConnectorFromID(chargingStation, reservation.connectorID);
    return (
      <View style={style.columnContainer}>
        <View style={style.connectorDetail}>
          {Utils.buildConnectorTypeSVG(connector?.type, null, 30)}
          <Text numberOfLines={1} style={[style.label, style.labelUser, style.info]}>
            {Utils.translateConnectorType(connector.type)}
          </Text>
        </View>
      </View>
    );
  };

  public renderCar = (style: any) => {
    const { reservation } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="directions-car" style={[style.icon, style.info]} />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {Utils.buildCarCatalogName(reservation?.car?.carCatalog)}
        </Text>
      </View>
    );
  };

  public renderReservedSlot = (style: any) => {
    const { reservation } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialCommunityIcons} name="book-clock" style={[style.icon, style.info]} />
        <Text numberOfLines={2} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {I18nManager.formatDateTime(reservation.arrivalTime, { timeStyle: 'short' })} -{'\n'}
          {I18nManager.formatDateTime(reservation.departureTime, { timeStyle: 'short' })}
        </Text>
      </View>
    );
  };

  public render() {
    const style = computeStyleSheet();
    const {
      reservation,
      loading,
      siteAreaImage,
      isSmartChargingActive,
      isCarActive,
      showCancelReservationDialog,
      showDeleteReservationDialog
    } = this.state;
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(reservation ? reservation.connectorID : null);
    return loading ? (
      <Spinner size={scale(30)} style={style.spinner} color="grey" />
    ) : (
      <View style={style.container}>
        {showCancelReservationDialog && this.renderCancelReservationDialog()}
        {showDeleteReservationDialog && this.renderDeleteReservationDialog()}
        <HeaderComponent
          navigation={this.props.navigation}
          title={reservation ? I18n.t('reservations.title') : I18n.t('reservations.types.unknown')}
          subTitle={`(${reservation.chargingStationID}, ${connectorLetter})`}
          containerStyle={style.headerContainer}
        />
        {/* Site Area Image */}
        <ImageBackground
          source={siteAreaImage ? { uri: siteAreaImage } : noSite}
          imageStyle={style.backgroundImage}
          style={style.backgroundImageContainer as ImageStyle}>
          <View style={style.imageInnerContainer}>
            {/* Provide better icon alignment */}
            <View style={[style.justifyContentContainer]} />
            {this.renderCancelReservationButton(style)}
            {this.renderDeleteReservationButton(style)}
          </View>
        </ImageBackground>
        <View style={style.headerContent}>
          <View style={style.headerRowContainer}>
            <Text style={style.headerName}>
              {reservation
                ? I18nManager.formatDateTime(reservation.fromDate, {
                    dateStyle: 'medium'
                  })
                : ''}{' '}
              -{' '}
              {reservation
                ? I18nManager.formatDateTime(reservation.toDate, {
                    dateStyle: 'medium'
                  })
                : ''}
            </Text>
            {reservation?.createdBy.id !== reservation?.tag?.userID && (
              <Text style={style.subHeaderName}>
                ({I18n.t('general.createdBy')}{' '}
                {Utils.buildUserName({ name: reservation.createdBy.name, firstName: reservation.createdBy.firstName } as User)})
              </Text>
            )}
          </View>
        </View>
        {/* Edit Button */}
        {reservation.canUpdate && this.renderEditReservationButton()}
        <ScrollView style={style.scrollViewContainer} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {this.renderUserInfo(style)}
          {this.renderReservationStatus(style)}
          {this.renderReservationType(style)}
          {this.renderChargingStation(style)}
          {this.renderChargingStationConnector(style)}
          {this.renderReservedSlot(style)}
          {isCarActive && this.renderCar(style)}
        </ScrollView>
      </View>
    );
  }

  public renderCancelReservationButton = (style: any) => {
    const isDisabled = this.isButtonDisabled();
    const { canCancelReservation } = this.state;
    if (canCancelReservation) {
      return (
        <View style={style.reservationContainer}>
          <TouchableOpacity disabled={isDisabled} onPress={() => this.cancelReservationConfirm()}>
            <View
              style={
                isDisabled
                  ? [style.buttonReservation, style.cancelReservation, style.buttonReservationDisabled]
                  : [style.buttonReservation, style.cancelReservation]
              }>
              <Icon
                style={
                  isDisabled
                    ? [style.reservationIcon, style.cancelReservationIcon, style.reservationDisabledIcon]
                    : [style.reservationIcon, style.cancelReservationIcon]
                }
                as={MaterialCommunityIcons}
                size={scale(75)}
                name="key-remove"
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      <View style={style.noButtonCancelReservation} />;
    }
  };

  public renderDeleteReservationButton = (style: any) => {
    const { canDeleteReservation } = this.state;
    if (canDeleteReservation) {
      return (
        <TouchableOpacity style={style.deleteReservationContainer} onPress={() => this.deleteReservationConfirm()}>
          <View style={style.deleteReservationButton}>
            <Icon size={scale(25)} style={style.deleteReservationIcon} as={MaterialIcons} name="delete-outline" />
          </View>
        </TouchableOpacity>
      );
    } else {
      return <View style={[style.justifyContentContainer]} />;
    }
  };

  public cancelReservationConfirm = () => {
    this.setState({ showCancelReservationDialog: true });
  };

  public deleteReservationConfirm = () => {
    this.setState({ showDeleteReservationDialog: true });
  };

  public async refresh(showSpinner = false, callback: () => void = () => {}): Promise<void> {
    const newState = showSpinner ? { refreshing: true } : this.state;
    this.setState(newState, async () => {
      let siteAreaImage = this.state.siteAreaImage;
      const reservationID = Utils.getParamFromNavigation(this.props.route, 'reservationID', null) as number;
      const reservation = await this.getReservation(reservationID, {
        WithChargingStation: true,
        WithTag: true,
        WithUser: true,
        WithSiteArea: true,
        WithSite: true,
        WithCar: true
      });
      if (!siteAreaImage && reservation.chargingStation?.siteAreaID) {
        siteAreaImage = await this.getSiteAreaImage(reservation?.chargingStation?.siteAreaID);
      }
      const siteArea = reservation.chargingStation.siteArea ?? null;
      const site = reservation.chargingStation.site ?? null;
      this.setState(
        {
          reservation,
          loading: false,
          refreshing: false,
          siteAreaImage,
          isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
          isSiteAdmin: this.securityProvider && reservation && siteArea ? this.securityProvider.isSiteAdmin(site.id) : false,
          isCarActive: this.securityProvider.isComponentCarActive(),
          isSmartChargingActive: this.securityProvider.isComponentSmartCharging(),
          canCancelReservation: reservation ? this.securityProvider.canCancelReservation(reservation, siteArea) : false,
          canDeleteReservation: reservation ? this.securityProvider.canDeleteReservation(reservation, siteArea) : false
        },
        () => callback?.()
      );
    });
  }

  private isButtonDisabled(): boolean {
    const { canCancelReservation, reservation } = this.state;
    return !canCancelReservation || ![ReservationStatus.IN_PROGRESS, ReservationStatus.SCHEDULED].includes(reservation.status);
  }

  private renderCancelReservationDialog() {
    const { reservation } = this.state;
    const chargingStation = reservation.chargingStation;
    const connector = Utils.getConnectorFromID(chargingStation, reservation.connectorID);
    const modalCommonStyle = computeModalCommonStyle();
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector.connectorId);
    return (
      <DialogModal
        withCloseButton={true}
        close={() => this.setState({ showCancelReservationDialog: false })}
        title={I18n.t('reservations.cancel_reservation.title')}
        description={I18n.t('reservations.cancel_reservation.confirm', {
          chargingStationID: chargingStation.id,
          connectorID: connectorLetter
        })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => {
              this.cancelReservation();
              this.setState({ showCancelReservationDialog: false });
            },
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          },
          {
            text: I18n.t('general.no'),
            action: () => this.setState({ showCancelReservationDialog: false }),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          }
        ]}
      />
    );
  }

  private renderDeleteReservationDialog() {
    const { reservation } = this.state;
    const modalCommonStyle = computeModalCommonStyle();
    return (
      <DialogModal
        withCloseButton={true}
        close={() => this.setState({ showCancelReservationDialog: false })}
        title={I18n.t('reservations.delete.title')}
        description={I18n.t('reservations.delete.confirm', {
          reservationID: reservation.id
        })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => {
              this.deleteReservation();
              this.setState({ showDeleteReservationDialog: false });
            },
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          },
          {
            text: I18n.t('general.no'),
            action: () => this.setState({ showDeleteReservationDialog: false }),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          }
        ]}
      />
    );
  }

  private async cancelReservation() {
    const { reservation } = this.state;
    if (reservation) {
      try {
        // Disable button
        this.setState({ buttonDisabled: true });
        // Cancel Reservation
        const response = await this.centralServerProvider.cancelReservation(reservation);
        if (response?.status === RestResponse.SUCCESS) {
          Message.showSuccess(
            I18n.t('reservations.cancel_reservation.success', {
              chargingStationID: reservation.chargingStationID
            })
          );
          const routes = this.props.navigation.getState().routes;
          this.props.navigation.navigate(routes[Math.max(0, routes.length - 2)].name, { refresh: true });
          return;
        } else {
          // Show message
          Message.showError(I18n.t('reservations.cancel_reservation.error', { chargingStationID: reservation.chargingStationID }));
        }
      } catch (error) {
        // Enable the button
        this.setState({ buttonDisabled: false });
        // Other common Error
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'general.unexpectedErrorBackend', this.props.navigation);
      }
    }
  }

  private async deleteReservation() {
    const { reservation } = this.state;
    if (reservation) {
      try {
        // Disable button
        this.setState({ buttonDisabled: true });
        // Delete Reservation
        const response = await this.centralServerProvider.deleteReservation(reservation);
        if (response?.status === RestResponse.SUCCESS) {
          Message.showSuccess(
            I18n.t('reservations.delete.success', {
              chargingStationID: reservation.chargingStationID,
              connectorID: Utils.getConnectorLetterFromConnectorID(reservation.connectorID)
            })
          );
          this.props.navigation.navigate('Reservations', { refresh: true });
          return;
        } else {
          // Show message
          Message.showError(I18n.t('reservations.delete.error'));
        }
      } catch (error) {
        // Enable the button
        this.setState({ buttonDisabled: false });
        // Other common Error
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'general.unexpectedErrorBackend', this.props.navigation);
      }
    }
  }

  private renderEditReservationButton() {
    const { reservation } = this.state;
    const { navigation } = this.props;
    const fabStyles = computeFabStyles();
    if (![ReservationStatus.IN_PROGRESS, ReservationStatus.SCHEDULED].includes(reservation.status)) {
      return;
    }
    return (
      <SafeAreaView style={fabStyles.fabContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditReservation', {
              params: { reservation },
              key: `${Utils.randomNumber()}`
            })
          }
          style={fabStyles.fab}>
          <Icon style={fabStyles.fabIcon} size={scale(18)} as={MaterialCommunityIcons} name={'book-edit'} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
