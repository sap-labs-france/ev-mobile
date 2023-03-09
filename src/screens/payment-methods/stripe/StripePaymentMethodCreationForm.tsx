import { CardField, CardFieldInput, initStripe, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import I18n from 'i18n-js';
import { Button, Checkbox, Spinner } from 'native-base';
import React, { useEffect, useState } from 'react';
import { BackHandler, Text, TouchableOpacity, View } from 'react-native';
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

interface Props extends BaseProps {}

export default function StripePaymentMethodCreationForm(props: Props) {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [provider, setProvider] = useState<CentralServerProvider>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [eulaChecked, setEulaChecked] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const [isBillingSetUp, setIsBillingSetUp] = useState<boolean>(undefined);
  const style = computeStyleSheet();
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
                props.navigation.goBack();
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
          this.centralServerProvider,
          error,
          'paymentMethods.paymentMethodUnexpectedError',
          this.props.navigation
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
      backgroundColor: commonColors.buttonBg,
      textColor: commonColors.textColor,
      placeholderColor: commonColors.disabledDark,
      cursorColor: commonColors.textColor,
      fontSize: Math.round(scale(15))
    };
  }

  return (
    <View style={style.container}>
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
        <TouchableOpacity onPress={() => setEulaChecked(!eulaChecked)} style={style.checkboxContainer}>
          <Checkbox value={'checkbox'} onChange={() => setEulaChecked(!eulaChecked)} _icon={{color: commonColors.textColor}} style={style.checkbox} isChecked={eulaChecked} />
          <Text style={[style.text, style.checkboxText]}>{I18n.t('paymentMethods.paymentMethodsCreationCheckboxText')}</Text>
        </TouchableOpacity>
      </View>
      <View style={style.buttonContainer}>
        {loading ? (
          <View style={style.spinner}>
            <Spinner color={commonColors.disabledDark} />
          </View>
        ) : (
          <Button
            disabled={!(cardDetails?.complete && eulaChecked && isBillingSetUp === true)}
            style={[
              style.button,
              cardDetails?.complete && eulaChecked && isBillingSetUp === true ? style.buttonEnabled : style.buttonDisabled
            ]}
            onPress={async () => addPaymentMethod()}>
            <Text style={style.buttonText}>{I18n.t('general.save')}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
