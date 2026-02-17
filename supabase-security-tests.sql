-- ============================================
-- TESTES AUTOMATIZADOS DE SEGURANÇA
-- COLMEIA DE ESPECIALISTAS
-- ============================================
-- Execute este script para verificar se as políticas
-- de segurança estão funcionando corretamente
-- ============================================

-- ============================================
-- PREPARAÇÃO DOS TESTES
-- ============================================

-- Criar usuários de teste (simular diferentes roles)
DO $$
DECLARE
  test_client_id UUID := gen_random_uuid();
  test_specialist_id UUID := gen_random_uuid();
  test_admin_id UUID := gen_random_uuid();
BEGIN
  -- Criar perfis de teste
  INSERT INTO profiles (id, full_name, role) VALUES
    (test_client_id, 'Test Client', 'client'),
    (test_specialist_id, 'Test Specialist', 'specialist'),
    (test_admin_id, 'Test Admin', 'admin')
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Test users created:';
  RAISE NOTICE 'Client ID: %', test_client_id;
  RAISE NOTICE 'Specialist ID: %', test_specialist_id;
  RAISE NOTICE 'Admin ID: %', test_admin_id;
END $$;

-- ============================================
-- TESTE 1: Verificar RLS habilitado
-- ============================================

SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'service_requests', 'reviews')
ORDER BY tablename;

-- Resultado esperado: rls_enabled = true para todas

-- ============================================
-- TESTE 2: Contar políticas ativas
-- ============================================

SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'service_requests', 'reviews')
GROUP BY tablename
ORDER BY tablename;

-- Resultado esperado:
-- profiles: 6 policies
-- service_requests: 10+ policies
-- reviews: 5+ policies

-- ============================================
-- TESTE 3: Listar todas as políticas
-- ============================================

SELECT
  tablename,
  policyname,
  cmd AS operation,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- TESTE 4: Verificar constraints
-- ============================================

SELECT
  table_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'service_requests', 'reviews')
  AND constraint_type = 'CHECK'
ORDER BY table_name;

-- Resultado esperado:
-- valid_roles, valid_status, valid_rating, etc.

-- ============================================
-- TESTE 5: Verificar triggers
-- ============================================

SELECT
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS trigger_event
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'service_requests', 'reviews')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- TESTE 6: Verificar funções de segurança
-- ============================================

SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_admin',
    'is_specialist',
    'is_client',
    'update_specialist_rating',
    'audit_service_requests'
  )
ORDER BY routine_name;

-- ============================================
-- TESTE 7: Verificar índices para performance
-- ============================================

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'service_requests', 'reviews')
ORDER BY tablename, indexname;

-- Resultado esperado: Índices em client_id, specialist_id, status, etc.

-- ============================================
-- TESTE 8: Verificar tabela de auditoria
-- ============================================

SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'audit_logs'
ORDER BY ordinal_position;

-- ============================================
-- TESTE 9: Simular criação de service request
-- ============================================

-- Este teste deve ser executado por um usuário autenticado
-- Não execute como admin ou sem autenticação

-- EXEMPLO (não executar aqui, executar via aplicação):
-- INSERT INTO service_requests (
--   client_id,
--   service_type,
--   description,
--   location,
--   status
-- ) VALUES (
--   auth.uid(),
--   'Eletricista',
--   'Teste de segurança',
--   'São Paulo',
--   'pending'
-- );

-- ============================================
-- TESTE 10: Verificar view de segurança
-- ============================================

SELECT COUNT(*) AS total_policies
FROM security_policies;

-- ============================================
-- RELATÓRIO FINAL
-- ============================================

SELECT
  '✅ TESTES CONCLUÍDOS' AS status,
  (
    SELECT COUNT(*)
    FROM pg_policies
    WHERE schemaname = 'public'
  ) AS total_policies_installed,
  (
    SELECT COUNT(*)
    FROM pg_tables
    WHERE schemaname = 'public'
      AND rowsecurity = true
  ) AS tables_with_rls,
  (
    SELECT COUNT(*)
    FROM information_schema.routines
    WHERE routine_schema = 'public'
      AND routine_name LIKE '%is_%'
  ) AS security_functions;

-- ============================================
-- VERIFICAÇÃO DE SEGURANÇA CRÍTICA
-- ============================================

-- Verificar se há tabelas sem RLS
SELECT
  '⚠️ ALERTA: Tabelas sem RLS' AS warning,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename NOT IN ('audit_logs', 'spatial_ref_sys');

-- Se retornar linhas, RLS NÃO está habilitado!

-- ============================================
-- CHECKLIST FINAL
-- ============================================

WITH security_checklist AS (
  SELECT
    'RLS Habilitado em profiles' AS check_item,
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'profiles') AS status
  UNION ALL
  SELECT
    'RLS Habilitado em service_requests',
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'service_requests')
  UNION ALL
  SELECT
    'RLS Habilitado em reviews',
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'reviews')
  UNION ALL
  SELECT
    'Políticas de profiles criadas',
    (SELECT COUNT(*) >= 5 FROM pg_policies WHERE tablename = 'profiles')
  UNION ALL
  SELECT
    'Políticas de service_requests criadas',
    (SELECT COUNT(*) >= 8 FROM pg_policies WHERE tablename = 'service_requests')
  UNION ALL
  SELECT
    'Políticas de reviews criadas',
    (SELECT COUNT(*) >= 4 FROM pg_policies WHERE tablename = 'reviews')
  UNION ALL
  SELECT
    'Tabela de auditoria existe',
    EXISTS(SELECT 1 FROM pg_tables WHERE tablename = 'audit_logs')
  UNION ALL
  SELECT
    'Funções de segurança criadas',
    (SELECT COUNT(*) >= 3 FROM information_schema.routines
     WHERE routine_name IN ('is_admin', 'is_specialist', 'is_client'))
)
SELECT
  check_item,
  CASE
    WHEN status THEN '✅ PASS'
    ELSE '❌ FAIL'
  END AS result
FROM security_checklist;

-- ============================================
-- INSTRUÇÕES
-- ============================================

-- Execute este script no SQL Editor do Supabase
-- Verifique se todos os testes retornam ✅ PASS
-- Se algum teste falhar, execute novamente o script:
--   supabase-security-policies.sql

-- ============================================
-- FINALIZADO!
-- ============================================
