export interface PayTRStatusResponse {
  status: 'success' | 'error';
  payment_amount?: string;
  payment_total?: string;
  payment_date?: string;
  currency?: string;
  taksit?: string;
  kart_marka?: string;
  masked_pan?: string;
  odeme_tipi?: string;
  test_mode?: string;
  returns?: string;
  reference_no?: string;
  err_no?: string;
  err_msg?: string;
  submerchant_payments?: any;
}