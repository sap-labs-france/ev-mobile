import { CardField, CardFieldInput, initStripe, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import I18n from 'i18n-js';
import {Icon} from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';

import HeaderComponent from '../../../components/header/HeaderComponent';
import CentralServerProvider from '../../../provider/CentralServerProvider';
import ProviderFactory from '../../../provider/ProviderFactory';
import { BillingOperationResult } from '../../../types/ActionResponse';
import BaseProps from '../../../types/BaseProps';
import { BillingSettings } from '../../../types/Setting';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './StripePaymentMethodCreationFormStyles';
import computeFormStyles from '../../../FormStyles';
import {Button, CheckBox} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface Props extends BaseProps {}

export default function StripePaymentMethodCreationForm(props: Props) {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [provider, setProvider] = useState<CentralServerProvider>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [eulaChecked, setEulaChecked] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const [isBillingSetUp, setIsBillingSetUp] = useState<boolean>(undefined);
  const style = computeStyleSheet();
  const formStyle = computeFormStyles();
  const commonColors = Utils.getCurrentCommonColor();
  const canOpenDrawer = props?.route?.params?.canOpenDrawer ?? true;

  useEffect(() => {
    setUp().catch((error) => {
      console.error(I18n.t('paymentMethods.paymentMethodUnexpectedError'), error);
    });
    // This screen does not extend from BaseScreen (functional component) so we need to add the logic
    props.navigation.getParent()?.setOptions({
      swipeEnabled: canOpenDrawer
    });
  });

  useFocusEffect(React.useCallback(() => {
    // This screen does not extend from BaseScreen (functional component) so we need to add the logic
    props.navigation.getParent()?.setOptions({
      swipeEnabled: canOpenDrawer
    });
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => onBack());
    return () => backHandler.remove();
  }, [])
  );

  function onBack(): boolean {
    props.navigation.goBack();
    return true;
  }

  async function setUp(): Promise<void> {
    const csProvider = await ProviderFactory.getProvider();
    setProvider(csProvider);
    // Billing
    let billingSettings: BillingSettings = Utils.getParamFromNavigation(props.route, 'billingSettings', null) as unknown as BillingSettings;
    if (!billingSettings?.stripe?.publicKey) {
      billingSettings = await csProvider.getBillingSettings();
    }
    if (billingSettings?.stripe?.publicKey) {
      await initStripe({ publishableKey: billingSettings?.stripe?.publicKey });
      setIsBillingSetUp(true);
    } else {
      setIsBillingSetUp(false);
    }
  }

  async function addPaymentMethod(): Promise<void> {
    if (cardDetails?.complete && eulaChecked && isBillingSetUp === true) {
      try {
        setLoading(true);
        // STEP 1 - Call Back-End to create intent
        const response: BillingOperationResult = await provider.setUpPaymentMethod({ userID: provider.getUserInfo().id });
        if (response?.succeeded) {
          const internalData: Record<string, unknown> = response?.internalData as Record<string, unknown>;
          const clientSecret = internalData?.client_secret as string;
          // We continue only if we have a client secret
          if (clientSecret) {
            // STEP 2 - Call Stripe API to confirm intent
            const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
              paymentMethodType: 'Card'
            });
            if (error) {
              // TODO: Display the error
              console.log('Setup intent confirmation error', error.code, error.message);
              // We continue only if we have a setUpIntent
            } else if (setupIntent) {
              // STEP 3 - Call Back-End to flag the payment method as default
              const attachResponse = await provider.attachPaymentMethod({
                paymentMethodId: setupIntent.paymentMethodId,
                userID: provider.getUserInfo().id
              });
              if (attachResponse?.succeeded) {
                setLoading(false);
                const routes = props.navigation.getState().routes;
                props.navigation.navigate(routes[Math.max(0, routes.length-2)]?.name, {refresh: true});
                Message.showSuccess(I18n.t('paymentMethods.addPaymentMethodSuccess'));
                // Return to prevent showError from triggering
                return;
              }
            }
          }
        }
        // Every failure other than HTTP is handled here
        Message.showError(I18n.t('paymentMethods.addPaymentMethodError'));
        setLoading(false);
        // Handle HTTP errors
      } catch (error) {
        await Utils.handleHttpUnexpectedError(
          provider,
          error,
          'paymentMethods.paymentMethodUnexpectedError',
          props.navigation
        );
      }
    }
  }

  function renderBillingErrorMessage() {
    return (
      <View>
        <Text>Payment service is unavailable</Text>
      </View>
    );
  }

  function buildCardFieldStyle() {
    return {
      backgroundColor: commonColors.listItemBackground,
      textColor: commonColors.textColor,
      placeholderColor: commonColors.disabledDark,
      fontSize: Math.round(scale(15)),
      borderRadius: scale(18)
    };
  }

  return (
    <KeyboardAwareScrollView
      bounces={false}
      persistentScrollbar={true}
      contentContainerStyle={formStyle.scrollViewContentContainer}
      style={style.container}
      keyboardShouldPersistTaps={'handled'}
    >
      <HeaderComponent
        title={I18n.t('paymentMethods.addPaymentMethod')}
        navigation={props.navigation}
        containerStyle={style.headerContainer}
      />
      {isBillingSetUp === false && renderBillingErrorMessage()}
      <CardField
        cardStyle={buildCardFieldStyle()}
        onCardChange={(details: CardFieldInput.Details) => setCardDetails(details)}
        postalCodeEnabled={false}
        style={style.cardFieldContainer}
      />
      <View style={style.eulaContainer}>
        <Text style={[style.text, style.eulaText]}>{I18n.t('paymentMethods.paymentMethodCreationRules')}</Text>
        <CheckBox
          containerStyle={[formStyle.checkboxContainer, style.checkboxContainer]}
          checked={eulaChecked}
          onPress={() => setEulaChecked(!eulaChecked)}
          title={I18n.t('paymentMethods.paymentMethodsCreationCheckboxText')}
          textStyle={formStyle.checkboxText}
          uncheckedIcon={<Icon size={scale(25)} name="checkbox-blank-outline" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
          checkedIcon={<Icon size={scale(25)} name="checkbox-outline" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
        />
      </View>
      <Button
        title={I18n.t('general.save')}
        titleStyle={formStyle.buttonText}
        disabled={!(cardDetails?.complete && eulaChecked && isBillingSetUp === true)}
        disabledStyle={formStyle.buttonDisabled}
        disabledTitleStyle={formStyle.buttonTextDisabled}
        containerStyle={formStyle.buttonContainer}
        buttonStyle={formStyle.button}
        loading={loading}
        loadingProps={{color: commonColors.light}}
        onPress={() => void addPaymentMethod()}
      />
    </KeyboardAwareScrollView>
  );
}
