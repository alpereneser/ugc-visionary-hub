import { WisePaymentData } from './types.ts';

export async function createWiseQuote(amount: number): Promise<any> {
  console.log('Creating Wise quote with amount:', amount);
  
  const wiseApiKey = Deno.env.get('WISE_API_KEY');
  const wiseProfileId = Deno.env.get('WISE_PROFILE_ID');
  
  try {
    const response = await fetch('https://api.wise.com/v3/quotes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sourceCurrency: 'USD',
        targetCurrency: 'USD',
        sourceAmount: amount,
        profile: wiseProfileId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wise quote error:', errorText);
      throw new Error(`Failed to create Wise quote: ${errorText}`);
    }

    const quote = await response.json();
    console.log('Wise quote created successfully:', quote);
    return quote;
  } catch (error) {
    console.error('Error creating Wise quote:', error);
    throw error;
  }
}

export async function createWisePaymentLink(quoteId: string, userId: string): Promise<string> {
  console.log('Creating Wise payment link for quote:', quoteId);
  
  const wiseApiKey = Deno.env.get('WISE_API_KEY');
  const wiseProfileId = Deno.env.get('WISE_PROFILE_ID');
  const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:8080';
  
  try {
    const response = await fetch(`https://api.wise.com/v3/profiles/${wiseProfileId}/payment-urls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quote: quoteId,
        redirectUrl: `${publicSiteUrl}/payment-success`,
        sourceUrl: publicSiteUrl,
        customerEmail: userId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wise payment link error:', errorText);
      throw new Error(`Failed to create Wise payment link: ${errorText}`);
    }

    const data = await response.json();
    console.log('Wise payment link created successfully:', data);
    return data.paymentUrl;
  } catch (error) {
    console.error('Error creating Wise payment link:', error);
    throw error;
  }
}