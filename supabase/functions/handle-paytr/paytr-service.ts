import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { PayTRPaymentData } from './types.ts';
import { corsHeaders } from './config.ts';

export async function generatePayTRToken(
  merchantId: string,
  merchantOid: string,
  amount: number,
  okUrl: string,
  failUrl: string,
  email: string,
  merchantSalt: string
): Promise<string> {
  const hashStr = `${merchantId}${merchantOid}${amount}${okUrl}${failUrl}${email}${merchantSalt}`;
  const hash = new TextEncoder().encode(hashStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', hash);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function makePayTRRequest(params: URLSearchParams): Promise<Response> {
  const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!paytrResponse.ok) {
    console.error('PayTR API error:', {
      status: paytrResponse.status,
      statusText: paytrResponse.statusText
    });
    throw new Error(`PayTR API error: ${paytrResponse.status}`);
  }

  return paytrResponse;
}

export async function getUserData(supabaseAdmin: any, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user data:', error);
    throw new Error('User not found');
  }

  return data;
}