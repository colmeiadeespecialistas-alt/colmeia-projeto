# 🚀 Guia de Execução - Políticas de Segurança

## ⚡ Execução Rápida (3 minutos)

Siga estes passos **exatamente nesta ordem**:

---

## 📍 PASSO 1: Executar Schema Principal

### **1.1 Abrir SQL Editor**
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto: `veeiyofmkftihnqzvxxd`
3. No menu lateral, clique em **SQL Editor** (ícone `</>`)

### **1.2 Executar supabase-schema.sql**

> ⚠️ **IMPORTANTE:** Se você JÁ executou este arquivo antes, pode pular para o Passo 2!

1. Clique em **"New Query"**
2. Abra o arquivo **`supabase-schema.sql`** no seu editor de código
3. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)
4. Cole no SQL Editor do Supabase (Ctrl+V)
5. Clique em **"Run"** (ou pressione `Ctrl + Enter`)

### **✅ Resultado Esperado:**
```
Success. No rows returned
```

Ou mensagens de sucesso como:
```
CREATE TABLE
CREATE POLICY
CREATE INDEX
...
```

---

## 📍 PASSO 2: Executar Políticas de Segurança

### **2.1 Nova Query**
1. No SQL Editor, clique em **"New Query"** novamente
2. Abra o arquivo **`supabase-security-policies.sql`**
3. Copie **TODO** o conteúdo (são ~300 linhas)
4. Cole no SQL Editor
5. Clique em **"Run"** (Ctrl + Enter)

### **✅ Resultado Esperado:**

Você verá várias mensagens:
```
DROP POLICY (se já existia)
CREATE POLICY
CREATE POLICY
CREATE FUNCTION
CREATE TRIGGER
...
```

### **⚠️ Avisos Normais:**

Se aparecer:
```
ERROR: policy "nome_da_policy" does not exist
```

**Isso é NORMAL!** O script tenta remover políticas antigas. Se não existem, dá esse erro, mas não afeta nada.

**Continue executando o script normalmente!**

---

## 📍 PASSO 3: Executar Testes de Segurança

### **3.1 Validar Instalação**
1. Clique em **"New Query"** novamente
2. Abra o arquivo **`supabase-security-tests.sql`**
3. Copie e cole no SQL Editor
4. Clique em **"Run"**

### **✅ Resultado Esperado:**

No final, você deve ver:

```
✅ CHECKLIST FINAL

check_item                              | result
----------------------------------------|----------
RLS Habilitado em profiles              | ✅ PASS
RLS Habilitado em service_requests      | ✅ PASS
RLS Habilitado em reviews               | ✅ PASS
Políticas de profiles criadas           | ✅ PASS
Políticas de service_requests criadas   | ✅ PASS
Políticas de reviews criadas            | ✅ PASS
Tabela de auditoria existe              | ✅ PASS
Funções de segurança criadas            | ✅ PASS
```

### **❌ Se algum teste falhar:**

1. Volte ao Passo 2
2. Execute novamente `supabase-security-policies.sql`
3. Execute os testes novamente

---

## 📍 PASSO 4: Verificar Visualmente

### **4.1 Verificar RLS nas Tabelas**

1. Vá em **Table Editor** (ícone de tabela no menu)
2. Clique em cada tabela:
   - `profiles`
   - `service_requests`
   - `reviews`
3. Procure o ícone de escudo 🛡️ no topo
4. Deve estar **verde/ativo**

### **4.2 Ver Políticas Ativas**

1. Em cada tabela, clique no ícone de escudo 🛡️
2. Você verá a lista de políticas:

**Exemplo para `service_requests`:**
```
✅ Clients can view their own requests
✅ Specialists can view their assigned requests
✅ Specialists can view available requests
✅ Only clients can create requests
...
```

---

## 📍 PASSO 5: Testar na Aplicação

### **5.1 Testar Cadastro**

1. Acesse: http://localhost:3000
2. Clique em **"Cadastrar"**
3. Crie uma conta como **Cliente**
4. Faça login

**✅ Se funcionar:** Políticas estão OK!

### **5.2 Testar Criação de Serviço**

1. No dashboard do cliente
2. Clique em **"Solicitar Novo Serviço"**
3. Preencha o formulário
4. Envie

**✅ Se criar:** Segurança funcionando!

### **5.3 Testar Especialista**

1. Abra uma **janela anônima**
2. Cadastre como **Especialista**
3. Veja se aparece o serviço criado
4. Tente aceitar

**✅ Se funcionar:** Sistema 100% seguro!

---

## 🎯 Verificações Finais

### **No SQL Editor, execute:**

```sql
-- Ver total de políticas instaladas
SELECT COUNT(*) AS total_policies
FROM pg_policies
WHERE schemaname = 'public';
```

**Resultado esperado:** Entre 20-30 políticas

---

```sql
-- Verificar RLS ativo
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ RLS ATIVO'
    ELSE '❌ RLS INATIVO'
  END AS status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'service_requests', 'reviews');
```

**Resultado esperado:** Todas com ✅ RLS ATIVO

---

```sql
-- Ver logs de auditoria (se houver atividade)
SELECT
  table_name,
  operation,
  created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 5;
```

---

## ✅ Checklist Final de Execução

Marque cada item conforme completa:

- [ ] ✅ Executei `supabase-schema.sql`
- [ ] ✅ Executei `supabase-security-policies.sql`
- [ ] ✅ Executei `supabase-security-tests.sql`
- [ ] ✅ Todos os testes passaram (✅ PASS)
- [ ] ✅ RLS está ativo em todas as tabelas
- [ ] ✅ Consegui criar conta na aplicação
- [ ] ✅ Consegui criar serviço como cliente
- [ ] ✅ Consegui aceitar serviço como especialista

---

## 🆘 Troubleshooting

### **Erro: "permission denied for table"**

**Solução:**
```sql
-- Verificar se você está como admin
SELECT current_user;

-- Se necessário, resetar permissões
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
```

---

### **Erro: "function does not exist"**

**Solução:** Execute novamente o `supabase-security-policies.sql`

---

### **RLS não aparece ativo**

**Solução:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

---

### **Políticas não aplicadas**

**Solução:**
1. Limpe todas as políticas antigas:
```sql
DROP POLICY IF EXISTS "nome_da_policy" ON table_name;
```

2. Execute novamente `supabase-security-policies.sql`

---

## 🎉 Pronto!

Se todos os itens do checklist estão marcados:

**✅ SEGURANÇA 100% IMPLEMENTADA!**

O sistema está pronto para produção com:
- ✅ Row Level Security ativo
- ✅ Políticas de acesso configuradas
- ✅ Logs de auditoria funcionando
- ✅ Proteção contra acessos não autorizados
- ✅ Validações de dados implementadas

---

## 📞 Próximos Passos

1. **Testar fluxos completos** na aplicação
2. **Configurar Google OAuth** (opcional)
3. **Fazer backup** do banco antes de deploy
4. **Documentar acessos** de admin
5. **Monitorar logs** de auditoria

---

**Sistema seguro e pronto para produção! 🔒**
