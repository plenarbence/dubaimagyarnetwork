export interface UserResponse {
  id: number;
  email: string;
  is_verified: boolean;
  created_at: string | null;
  last_login: string | null;
}
