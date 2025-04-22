export interface ProfileType {
  id: string;
  created_at: string;

  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: {
    id: string;
    path: string;
    fullPath: string;
    publicUrl: string;
  };
  bio: string;
  is_account_private: boolean;
}
