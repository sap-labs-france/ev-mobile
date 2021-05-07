import { CardField, CardFieldInput, PaymentMethodCreateParams, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import { BillingOperationResponse } from '../../types/ActionResponse';

/**
 *
 */
export default function Invoices() {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const [provider, setProvider] = useState<CentralServerProvider>(null);

  useEffect(() => {
    /**
     *
     */
    async function setProviderInstance() {
      setProvider(await ProviderFactory.getProvider());
    }
    setProviderInstance();
  }, []);

  const addPaymentMethod = async (): Promise<void> => {
    const response: BillingOperationResponse = await provider.setUpPaymentMethod(provider.getUserInfo().id);
    const setUpIntent: any = response?.internalData;

    console.log('###########################################\n');
    console.log(setUpIntent);

    const clientSecret = setUpIntent?.client_secret;
    if (!clientSecret) {
      console.log('Unexpected situation - client secret is null - check the billing settings!!!');
    } else {
      console.log('Client secret is propery set!');

      // This is useless
      const billingDetails: PaymentMethodCreateParams.BillingDetails = {
        email: 'claude.rossi@sap.com'
      };

      console.log('Now calling confirmSetupIntent!');
      const { error, setupIntent: setupIntentResult } = await confirmSetupIntent(clientSecret, {
        type: 'Card',
        billingDetails
      });

      if (error) {
        console.log('Setup intent confirmation error', error.message);
      } else if (setupIntentResult) {
        console.log(`Success: Setup intent created. Intent status: ${setupIntentResult.status}`);
        // TODO - call the backend to set the new payment method as the default one
      }
    }
  };

  return (

    <View style={{paddingTop: 200, alignSelf: 'center'}}>
      <Text>To be implemented...</Text>
    </View>
  );
}
