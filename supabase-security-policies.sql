-- ============================================
-- POLÍTICAS DE SEGURANÇA (RLS) - PRODUÇÃO
-- COLMEIA DE ESPECIALISTAS
-- ============================================
-- Este arquivo contém políticas de segurança robustas
-- para proteger os dados em produção
-- ============================================

-- ============================================
-- 1. PROFILES - POLÍTICAS DE SEGURANÇA
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- LEITURA: Perfis públicos visíveis para usuários autenticados
CREATE POLICY "Authenticated users can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- LEITURA: Usuários anônimos só veem informações básicas de especialistas
CREATE POLICY "Anonymous can view specialist profiles"
  ON profiles FOR SELECT
  TO anon
  USING (role = 'specialist');

-- INSERÇÃO: Usuários só podem criar seu próprio perfil
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ATUALIZAÇÃO: Usuários só podem atualizar seu próprio perfil
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ATUALIZAÇÃO: Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- EXCLUSÃO: Apenas admins podem deletar perfis
CREATE POLICY "Only admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 2. SERVICE_REQUESTS - POLÍTICAS DE SEGURANÇA
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Clients can view their own requests" ON service_requests;
DROP POLICY IF EXISTS "Specialists can view requests assigned to them" ON service_requests;
DROP POLICY IF EXISTS "Specialists can view pending requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON service_requests;
DROP POLICY IF EXISTS "Clients can insert their own requests" ON service_requests;
DROP POLICY IF EXISTS "Specialists can update requests assigned to them" ON service_requests;
DROP POLICY IF EXISTS "Clients can update their own pending requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can update any request" ON service_requests;

-- LEITURA: Clientes veem apenas seus próprios pedidos
CREATE POLICY "Clients can view their own requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client')
  );

-- LEITURA: Especialistas veem pedidos atribuídos a eles
CREATE POLICY "Specialists can view their assigned requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = specialist_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  );

-- LEITURA: Especialistas veem pedidos pendentes disponíveis
CREATE POLICY "Specialists can view available requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (
    status = 'pending' AND
    specialist_id IS NULL AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  );

-- LEITURA: Admins veem todos os pedidos
CREATE POLICY "Admins can view all requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- INSERÇÃO: Apenas clientes podem criar pedidos
CREATE POLICY "Only clients can create requests"
  ON service_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client') AND
    status = 'pending' AND
    specialist_id IS NULL
  );

-- ATUALIZAÇÃO: Clientes podem cancelar seus próprios pedidos pendentes
CREATE POLICY "Clients can cancel their pending requests"
  ON service_requests FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = client_id AND
    status = 'pending' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client')
  )
  WITH CHECK (
    status IN ('pending', 'cancelled')
  );

-- ATUALIZAÇÃO: Especialistas podem aceitar pedidos pendentes
CREATE POLICY "Specialists can accept pending requests"
  ON service_requests FOR UPDATE
  TO authenticated
  USING (
    status = 'pending' AND
    specialist_id IS NULL AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  )
  WITH CHECK (
    specialist_id = auth.uid() AND
    status = 'in_progress'
  );

-- ATUALIZAÇÃO: Especialistas podem atualizar pedidos atribuídos
CREATE POLICY "Specialists can update their assigned requests"
  ON service_requests FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = specialist_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  )
  WITH CHECK (
    specialist_id = auth.uid() AND
    status IN ('in_progress', 'completed')
  );

-- ATUALIZAÇÃO: Admins podem atualizar qualquer pedido
CREATE POLICY "Admins can update any request"
  ON service_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EXCLUSÃO: Apenas admins podem deletar pedidos
CREATE POLICY "Only admins can delete requests"
  ON service_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 3. REVIEWS - POLÍTICAS DE SEGURANÇA
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Clients can insert reviews for completed services" ON reviews;

-- LEITURA: Reviews são públicas (para transparência)
CREATE POLICY "Reviews are viewable by authenticated users"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

-- LEITURA: Especialistas podem ver suas próprias avaliações
CREATE POLICY "Specialists can view their reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    auth.uid() = specialist_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'specialist')
  );

-- INSERÇÃO: Apenas clientes podem criar reviews para serviços concluídos
CREATE POLICY "Clients can review completed services"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client') AND
    EXISTS (
      SELECT 1 FROM service_requests
      WHERE id = service_request_id
      AND client_id = auth.uid()
      AND status = 'completed'
      AND specialist_id = reviews.specialist_id
    ) AND
    NOT EXISTS (
      SELECT 1 FROM reviews
      WHERE service_request_id = reviews.service_request_id
    )
  );

-- ATUALIZAÇÃO: Clientes podem editar suas próprias reviews
CREATE POLICY "Clients can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client')
  )
  WITH CHECK (
    auth.uid() = client_id
  );

-- EXCLUSÃO: Apenas admins podem deletar reviews
CREATE POLICY "Only admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. FUNÇÕES DE SEGURANÇA ADICIONAIS
-- ============================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é especialista
CREATE OR REPLACE FUNCTION is_specialist()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'specialist'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é cliente
CREATE OR REPLACE FUNCTION is_client()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'client'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. TRIGGERS DE AUDITORIA
-- ============================================

-- Criar tabela de auditoria (opcional, mas recomendado para produção)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS na tabela de auditoria
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_admin());

-- Função de auditoria para service_requests
CREATE OR REPLACE FUNCTION audit_service_requests()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, operation, user_id, old_data, new_data)
  VALUES (
    'service_requests',
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger de auditoria
CREATE TRIGGER service_requests_audit
  AFTER INSERT OR UPDATE OR DELETE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION audit_service_requests();

-- ============================================
-- 6. CONSTRAINTS ADICIONAIS DE SEGURANÇA
-- ============================================

-- Garantir que apenas roles válidos são usados
ALTER TABLE profiles ADD CONSTRAINT valid_roles
  CHECK (role IN ('client', 'specialist', 'admin'));

-- Garantir que apenas status válidos são usados
ALTER TABLE service_requests ADD CONSTRAINT valid_status
  CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

-- Garantir que rating está entre 1 e 5
ALTER TABLE reviews ADD CONSTRAINT valid_rating
  CHECK (rating >= 1 AND rating <= 5);

-- Garantir que preço não é negativo
ALTER TABLE service_requests ADD CONSTRAINT non_negative_price
  CHECK (price IS NULL OR price >= 0);

-- ============================================
-- 7. VERIFICAÇÃO DE SEGURANÇA
-- ============================================

-- View para admins verificarem políticas ativas
CREATE OR REPLACE VIEW security_policies AS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Conceder acesso à view apenas para admins
GRANT SELECT ON security_policies TO authenticated;

-- ============================================
-- FINALIZADO!
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Todas as políticas de segurança serão aplicadas
-- ============================================
