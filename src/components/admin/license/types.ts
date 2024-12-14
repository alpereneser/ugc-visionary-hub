export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string;
}

export interface PaymentReceipt {
  id: string;
  user_id: string | null;
  profile_id: string;
  file_path: string;
  status: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile; // Burayı profiles olarak değiştirdik
}