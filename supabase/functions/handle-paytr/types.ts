export interface PayTRRequestBody {
  user_id: string;
}

export interface PayTRPaymentData {
  merchant_id: string;
  merchant_oid: string;
  email: string;
  payment_amount: number;
  currency: string;
  user_name: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
  user_basket: string;
  user_ip: string;
  debug_on: number;
  test_mode: number;
  no_installment: number;
  max_installment: number;
  lang: string;
}