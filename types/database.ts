export type UserRole = "client" | "specialist" | "admin";

export type ServiceStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  rating: number;
  completed_jobs: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  specialist_id?: string;
  service_type: string;
  description: string;
  location: string;
  price?: number;
  preferred_date?: string;
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Review {
  id: string;
  service_request_id: string;
  client_id: string;
  specialist_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at" | "rating" | "completed_jobs">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      service_requests: {
        Row: ServiceRequest;
        Insert: Omit<ServiceRequest, "id" | "created_at" | "updated_at" | "completed_at">;
        Update: Partial<Omit<ServiceRequest, "id" | "created_at" | "updated_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id" | "created_at">>;
      };
    };
  };
}
