import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { PayTRPaymentData } from './types.ts';

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
  const encoder = new TextEncoder();
  const data = encoder.encode(hashStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return btoa(String.fromCharCode.apply(null, hashArray));
}

export async function makePayTRRequest(params: URLSearchParams): Promise<Response> {
  console.log('Making PayTR request with params:', Object.fromEntries(params));
  
  const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    console.error('PayTR API error response:', {
      status: response.status,
      statusText: response.statusText
    });
    const errorText = await response.text();
    console.error('PayTR API error body:', errorText);
    throw new Error(`PayTR API error: ${response.status} - ${errorText}`);
  }

  return response;
}

export async function getUserData(supabaseAdmin: any, userId: string) {
  console.log('Fetching user data for ID:', userId);
  
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    throw new Error('User not found');
  }

  console.log('User data retrieved:', data);
  return data;
}