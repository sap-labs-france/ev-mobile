import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import { BillingOperationResponse } from '../../types/ActionResponse';
import { CardField, CardFieldInput, useConfirmSetupIntent } from '@stripe/stripe-react-native';

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
    async function getProvider() {
      setProvider(await ProviderFactory.getProvider());
    }
    getProvider();
  }, []);

  const addPaymentMethod = async (): Promise<void> => {
    const response: BillingOperationResponse = await provider.setUpPaymentMethod(provider.getUserInfo().id);
    const setUpIntent: any = response?.internalData;

    console.log('###########################################\n');
    console.log(setUpIntent);

   const result = await confirmSetupIntent(
      setUpIntent?.clientSecret,
      {
        type: 'Card',
        billingDetails: {
          email: 'alixhumbert@gmail.com'
        }
      }
      // TODO: put email and address
      // billing_details: {
      //   name: this.centralServerService.getCurrentUserSubject().value.email + new Date(),
      // },
    );

   console.log(result);

  };

  return (
    <View>
      <CardField
        onCardChange={(cardDetailsChanged) => setCardDetails(cardDetailsChanged)}
        postalCodeEnabled={false}
        style={{ height: 50, marginTop: 100 }}
      />
      <TouchableOpacity onPress={async () => addPaymentMethod()}>
        <Text>Add payment method</Text>
      </TouchableOpacity>
    </View>
  );
}
