-- ============================================
-- COLMEIA DE ESPECIALISTAS - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'specialist', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- SERVICE_REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  specialist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10,2),
  preferred_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policies for service_requests
CREATE POLICY "Clients can view their own requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Specialists can view requests assigned to them"
  ON service_requests FOR SELECT
  USING (auth.uid() = specialist_id);

CREATE POLICY "Specialists can view pending requests"
  ON service_requests FOR SELECT
  USING (
    status = 'pending' AND specialist_id IS NULL AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  );

CREATE POLICY "Admins can view all requests"
  ON service_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients can insert their own requests"
  ON service_requests FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client')
  );

CREATE POLICY "Specialists can update requests assigned to them"
  ON service_requests FOR UPDATE
  USING (auth.uid() = specialist_id OR specialist_id IS NULL);

CREATE POLICY "Clients can update their own pending requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = client_id AND status = 'pending');

CREATE POLICY "Admins can update any request"
  ON service_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  specialist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Clients can insert reviews for completed services"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM service_requests
      WHERE id = service_request_id
      AND client_id = auth.uid()
      AND status = 'completed'
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for service_requests
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update specialist rating
CREATE OR REPLACE FUNCTION update_specialist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM reviews
    WHERE specialist_id = NEW.specialist_id
  ),
  completed_jobs = (
    SELECT COUNT(*)
    FROM service_requests
    WHERE specialist_id = NEW.specialist_id AND status = 'completed'
  )
  WHERE id = NEW.specialist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating when review is created
CREATE TRIGGER update_rating_on_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_specialist_rating();

-- Function to set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for setting completed_at
CREATE TRIGGER set_service_completed_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX idx_service_requests_specialist_id ON service_requests(specialist_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_created_at ON service_requests(created_at DESC);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_reviews_specialist_id ON reviews(specialist_id);
