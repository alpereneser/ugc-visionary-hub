import { WisePaymentData } from './types.ts';

export async function createWiseQuote(amount: number): Promise<any> {
  console.log('Creating Wise quote with amount:', amount);
  const response = await fetch('https://api.wise.com/v3/quotes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('WISE_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'USD',
      sourceAmount: amount,
      profile: Deno.env.get('WISE_PROFILE_ID')
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
}

export async function createWisePaymentLink(quoteId: string, userId: string): Promise<string> {
  console.log('Creating Wise payment link for quote:', quoteId);
  
  // Wise API v3 için güncellenmiş endpoint ve request body
  const response = await fetch('https://api.wise.com/v3/profiles/' + Deno.env.get('WISE_PROFILE_ID') + '/payment-urls', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('WISE_API_KEY')}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: quoteId,
      redirectUrl: `${Deno.env.get('PUBLIC_SITE_URL')}/payment-success`,
      sourceUrl: `${Deno.env.get('PUBLIC_SITE_URL')}`,
      customerEmail: userId
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Wise payment link error:', errorText, 'Status:', response.status);
    console.error('Request details:', {
      quoteId,
      profileId: Deno.env.get('WISE_PROFILE_ID'),
      publicSiteUrl: Deno.env.get('PUBLIC_SITE_URL')
    });
    throw new Error(`Failed to create Wise payment link: ${errorText}`);
  }

  const data = await response.json();
  console.log('Wise payment link created successfully:', data);
  return data.paymentUrl;
}