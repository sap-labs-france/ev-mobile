import { DrawerActions } from '@react-navigation/native';
import { CardField, CardFieldInput, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import I18n from 'i18n-js';
import { Button, Spinner, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import HeaderComponent from '../../components/header/HeaderComponent';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import { BillingOperationResponse } from '../../types/ActionResponse';
import BaseProps from '../../types/BaseProps';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';

import computeStyleSheet from './CreatePaymentMethodStyles';

interface Props extends BaseProps {
  close: () => void;
}

/**
 * @param props
 */
export default function CreatePaymentMethod(props: Props) {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [provider, setProvider] = useState<CentralServerProvider>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const style = computeStyleSheet();

  /**
   *
   */
  async function getProvider() {
    return ProviderFactory.getProvider();
  }

  useEffect(() => {
    /**
     *
     */
    async function setUp() {
      const csProvider = await getProvider();
      setProvider(csProvider);
    }
    setUp();
  }, []);

  /**
   *
   */
  async function addPaymentMethod(): Promise<void> {
    if (cardDetails?.complete) {
      try {
        setLoading(true);
        // Step 1 - call Back-End to create intent
        const response: BillingOperationResponse = await provider.setUpPaymentMethod({ userID: provider.getUserInfo().id });
        if (response?.succeeded) {
          const internalData: any = response?.internalData;
          const clientSecret = internalData?.client_secret;

          if (!clientSecret) {
            console.log('Unexpected situation - client secret is null - check the billing settings!!!');
          } else {
            console.log('Client secret is properly set!');

            // Step 2 - call Stripe API to confirm intent
            const { error, setupIntent } = await confirmSetupIntent(clientSecret, {
              type: 'Card'
            });
            if (error) {
              console.log('Setup intent confirmation error', error.code, error.message);
            } else if (setupIntent) {
              console.log(`Success: Setup intent created. Intent status: ${setupIntent.status}`);

              // Step 3 - Call Back-End to flag the payment method as default
              const attachResponse: BillingOperationResponse = await provider.attachPaymentMethod({
                setupIntentId: setupIntent?.id,
                paymentMethodId: setupIntent?.paymentMethodId,
                userID: provider.getUserInfo().id
              });
              if (attachResponse?.succeeded) {
                setLoading(false);
                props.navigation.goBack();
                Message.showSuccess(I18n.t('paymentMethods.addPaymentMethodSuccess'));
                return;
              }
            }
          }
        }
        showError();
        setLoading(false);
      } catch ( error ) {
        Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'paymentMethods.paymentMethodUnexpectedError',
          this.props.navigation
        );
      }
    }
  }

  /**
   *
   */
  function onBack() {
    // Back mobile button: Force navigation
    props.navigation.goBack();
    // Do not bubble up
    return true;
  }

  function showError() {
    Message.showError(I18n.t('paymentMethods.addPaymentMethodError'));
  }

  function buildCardFieldStyle() {
    const commonColors = Utils.getCurrentCommonColor();
    return {
      placeholderColor: commonColors.brandDisabledDark,
      cursorColor: commonColors.textColor,
      textColor: commonColors.textColor
    };
  }

  // Render
  return (
    <View style={style.container}>
      <HeaderComponent
        title={'Ajouter une méthode de paiement'}
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
            <Spinner color={'grey'} />
          </Button>
        ) : (
          <Button
            disabled={!cardDetails?.complete}
            style={[style.button, cardDetails?.complete ? style.buttonEnabled : style.buttonDisabled]}
            light
            block
            onPress={async () => addPaymentMethod()}>
            <Text style={[style.buttonText, !cardDetails?.complete && style.buttonTextDisabled]}>Sauvegarder</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
