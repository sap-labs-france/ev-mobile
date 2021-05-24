import { DrawerActions } from '@react-navigation/native';
import { CardFieldInput, useConfirmSetupIntent, CardField, initStripe } from '@stripe/stripe-react-native';
import I18n from 'i18n-js';
import { Button, Spinner, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import HeaderComponent from '../../../components/header/HeaderComponent';
import CentralServerProvider from '../../../provider/CentralServerProvider';
import ProviderFactory from '../../../provider/ProviderFactory';
import { BillingOperationResponse } from '../../../types/ActionResponse';
import BaseProps from '../../../types/BaseProps';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';

import computeStyleSheet from './StripePaymentMethodCreationFormStyles';
import { BillingSettings } from '../../../types/Setting';

interface Props extends BaseProps {}

export default function StripePaymentMethodCreationForm(props: Props) {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [provider, setProvider] = useState<CentralServerProvider>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const style = computeStyleSheet();
  const commonColor = Utils.getCurrentCommonColor();

  useEffect(() => {
    setUp().catch((error) => {
      console.error(I18n.t('paymentMethods.paymentMethodUnexpectedError'), error);
    });
  });

  async function setUp(): Promise<void> {
    const csProvider = await ProviderFactory.getProvider();
    setProvider(csProvider);
    // Billing
    const billingSettings: BillingSettings = await csProvider.getBillingSettings();
    await initStripe({ publishableKey: billingSettings?.stripe?.publicKey });
  }

  async function addPaymentMethod(): Promise<void> {
    if (cardDetails?.complete) {
      try {
        setLoading(true);
        // STEP 1 - Call Back-End to create intent
        const response: BillingOperationResponse = await provider.setUpPaymentMethod({ userID: provider.getUserInfo().id });
        if (response?.succeeded) {
          const internalData: Record<string, unknown> = response?.internalData;
          const clientSecret: string = internalData?.client_secret as string;

          // We continue only if we have a client secret
          if (!clientSecret) {
            console.log('Unexpected situation - client secret is null - check the billing settings!!!');
          } else {
            console.log('Client secret is properly set!');

            // STEP 2 - Call Stripe API to confirm intent
            const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
              type: 'Card'
            });
            if (error) {
              console.log('Setup intent confirmation error', error.code, error.message);
              // We continue only if we have a setUpIntent
            } else if (setupIntent) {
              console.log(`Success: Setup intent created. Intent status: ${setupIntent.status}`);

              // STEP 3 - Call Back-End to flag the payment method as default
              const attachResponse: BillingOperationResponse = await provider.attachPaymentMethod({
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
        Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'paymentMethods.paymentMethodUnexpectedError',
          this.props.navigation
        );
      }
    }
  }

  function onBack() {
    // Back mobile button: Force navigation
    props.navigation.goBack();
    // Do not bubble up
    return true;
  }

  function buildCardFieldStyle() {
    const commonColors = Utils.getCurrentCommonColor();
    return {
      backgroundColor: commonColors.buttonBg,
      textColor: commonColors.textColor,
      placeholderColor: commonColors.brandDisabledDark,
      cursorColor: commonColors.textColor
    };
  }

  return (
    <View style={style.container}>
      <HeaderComponent
        title={I18n.t('paymentMethods.addPaymentMethod')}
        navigation={props.navigation}
        leftAction={onBack}
        leftActionIcon={'navigate-before'}
        rightAction={() => {
          props.navigation.dispatch(DrawerActions.openDrawer());
          return true;
        }}
        rightActionIcon={'menu'}
      />
      <CardField
        cardStyle={buildCardFieldStyle()}
        onCardChange={(details: CardFieldInput.Details) => setCardDetails(details)}
        postalCodeEnabled={false}
        style={style.cardFieldContainer}
      />
      <View style={style.buttonContainer}>
        {loading ? (
          <Button style={style.button} light block onPress={async () => addPaymentMethod()}>
            <Spinner color={commonColor.brandDisabledDark} />
          </Button>
        ) : (
          <Button
            disabled={!cardDetails?.complete}
            style={[style.button, cardDetails?.complete ? style.buttonEnabled : style.buttonDisabled]}
            light
            block
            onPress={async () => addPaymentMethod()}>
            <Text style={style.buttonText}>{I18n.t('general.save')}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
