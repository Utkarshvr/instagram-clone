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

export interface FollowType {
  id: string;
  followed_at: string;

  follower_id: string;
  following_id: string;
  status: "pending" | "accepted";
}

export interface NotificationType {
  id: string;
  created_at: string;

  user_id: string;
  sender_id: string;
  is_read: boolean;
  data: any;
  type: "follow_request";
}
