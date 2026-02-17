# 🔒 Guia de Segurança - Colmeia de Especialistas

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Políticas Implementadas](#políticas-implementadas)
3. [Como Executar](#como-executar)
4. [Testes de Segurança](#testes-de-segurança)
5. [Verificações](#verificações)

---

## 🛡️ Visão Geral

Este sistema implementa **Row Level Security (RLS)** completo no Supabase para garantir que:

- ✅ Usuários só acessam seus próprios dados
- ✅ Especialistas só veem chamados relevantes
- ✅ Clientes não podem modificar dados de outros
- ✅ Admins têm acesso total (auditável)
- ✅ Logs de auditoria registram alterações críticas

---

## 🔐 Políticas Implementadas

### **1. PROFILES (Perfis de Usuário)**

| Operação | Quem Pode | Restrições |
|----------|-----------|------------|
| **SELECT** | Todos autenticados | Visualizar perfis públicos |
| **SELECT** | Anônimos | Apenas especialistas (dados básicos) |
| **INSERT** | Usuário próprio | Criar apenas seu perfil |
| **UPDATE** | Usuário próprio | Editar apenas seu perfil |
| **UPDATE** | Admins | Editar qualquer perfil |
| **DELETE** | Admins | Deletar qualquer perfil |

**Proteções:**
- ✅ Usuário não pode mudar seu próprio `role`
- ✅ Usuário não pode criar perfil para outra pessoa
- ✅ Ratings são calculados automaticamente

---

### **2. SERVICE_REQUESTS (Pedidos de Serviço)**

#### **LEITURA (SELECT)**

| Quem | O que pode ver |
|------|----------------|
| **Clientes** | Apenas seus próprios pedidos |
| **Especialistas** | Pedidos atribuídos a eles + pendentes disponíveis |
| **Admins** | Todos os pedidos |

#### **CRIAÇÃO (INSERT)**

| Quem | Pode criar |
|------|------------|
| **Clientes** | Pedidos em seu nome (status: pending) |
| **Especialistas** | ❌ Não podem criar pedidos |

**Proteções:**
- ✅ Cliente não pode criar pedido em nome de outro
- ✅ Pedido sempre começa como "pending"
- ✅ Não pode atribuir especialista na criação

#### **ATUALIZAÇÃO (UPDATE)**

| Quem | Pode atualizar | Condições |
|------|----------------|-----------|
| **Clientes** | Seus pedidos pendentes | Apenas para cancelar |
| **Especialistas** | Pedidos pendentes | Para aceitar (status → in_progress) |
| **Especialistas** | Pedidos atribuídos | Para marcar como concluído |
| **Admins** | Qualquer pedido | Sem restrições |

**Proteções:**
- ✅ Cliente não pode atribuir especialista manualmente
- ✅ Especialista não pode roubar pedido de outro
- ✅ Status segue fluxo: pending → in_progress → completed

#### **EXCLUSÃO (DELETE)**

| Quem | Pode deletar |
|------|--------------|
| **Admins** | Qualquer pedido |
| **Outros** | ❌ Ninguém pode deletar |

---

### **3. REVIEWS (Avaliações)**

| Operação | Quem Pode | Restrições |
|----------|-----------|------------|
| **SELECT** | Todos autenticados | Ver todas as reviews |
| **INSERT** | Clientes | Apenas para serviços concluídos |
| **INSERT** | Validações | 1 review por serviço |
| **UPDATE** | Cliente autor | Editar própria review |
| **DELETE** | Admins | Deletar qualquer review |

**Proteções:**
- ✅ Cliente não pode avaliar serviço de outro
- ✅ Não pode avaliar serviço não concluído
- ✅ Não pode criar múltiplas reviews para mesmo serviço
- ✅ Rating deve estar entre 1-5

---

## 🚀 Como Executar as Políticas

### **Passo 1: Executar Script Principal**

Se ainda não executou o `supabase-schema.sql`:

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Copie e cole **TODO** o conteúdo de `supabase-schema.sql`
5. Clique em **Run**

### **Passo 2: Executar Políticas de Segurança**

1. No **SQL Editor** do Supabase
2. Clique em **"New Query"**
3. Copie **TODO** o conteúdo de `supabase-security-policies.sql`
4. Clique em **Run**

### **✅ Resultado Esperado:**

Você deve ver várias mensagens de sucesso:
```
DROP POLICY
CREATE POLICY
CREATE POLICY
...
```

**Se aparecer erro "policy already exists":** Isso é normal! O script já remove políticas antigas.

---

## 🧪 Testes de Segurança

### **Teste 1: Cliente não pode ver pedidos de outros**

```sql
-- Como cliente A
SELECT * FROM service_requests WHERE client_id != auth.uid();
-- Resultado: 0 linhas (correto!)
```

### **Teste 2: Especialista não pode aceitar pedido já atribuído**

```sql
-- Como especialista B tentando aceitar pedido do especialista A
UPDATE service_requests
SET specialist_id = auth.uid()
WHERE specialist_id = 'outro-especialista-id';
-- Resultado: Erro (correto!)
```

### **Teste 3: Cliente não pode criar review para serviço não concluído**

```sql
-- Como cliente tentando avaliar serviço pendente
INSERT INTO reviews (service_request_id, client_id, specialist_id, rating)
VALUES ('service-id', auth.uid(), 'specialist-id', 5);
-- Resultado: Erro (correto!)
```

### **Teste 4: Especialista só vê pedidos relevantes**

```sql
-- Como especialista
SELECT * FROM service_requests;
-- Resultado: Apenas pedidos pendentes + atribuídos a ele
```

---

## ✅ Verificações de Segurança

### **No Supabase Dashboard:**

#### 1. **Verificar RLS Ativo**

1. Vá em **Table Editor**
2. Selecione uma tabela (ex: `service_requests`)
3. Clique no ícone de escudo 🛡️
4. Confirme: **"RLS enabled"**

#### 2. **Ver Políticas Ativas**

Execute no SQL Editor:
```sql
SELECT * FROM security_policies;
```

Você deve ver todas as políticas listadas.

#### 3. **Testar Acesso Anônimo**

No SQL Editor:
```sql
-- Desabilitar JWT temporariamente
SET request.jwt.claim.sub = NULL;

-- Tentar acessar dados
SELECT * FROM service_requests;
-- Resultado: 0 linhas (correto!)
```

---

## 🔍 Auditoria

### **Ver Logs de Auditoria (Admin)**

```sql
SELECT
  table_name,
  operation,
  user_id,
  created_at,
  new_data->>'status' as new_status
FROM audit_logs
WHERE table_name = 'service_requests'
ORDER BY created_at DESC
LIMIT 10;
```

### **Ver Alterações de Status**

```sql
SELECT
  user_id,
  old_data->>'status' as old_status,
  new_data->>'status' as new_status,
  created_at
FROM audit_logs
WHERE table_name = 'service_requests'
  AND operation = 'UPDATE'
  AND old_data->>'status' != new_data->>'status';
```

---

## 🚨 Alertas de Segurança

### **Monitorar:**

1. **Tentativas de acesso não autorizado**
2. **Mudanças em roles de usuários**
3. **Criação massiva de pedidos**
4. **Reviews suspeitas (todas 5 estrelas)**

### **Script de Monitoramento:**

```sql
-- Usuários que mudaram de role recentemente
SELECT
  id,
  full_name,
  role,
  updated_at
FROM profiles
WHERE updated_at > NOW() - INTERVAL '24 hours'
  AND role = 'admin';
```

---

## 📝 Checklist de Produção

Antes de fazer deploy:

- [ ] ✅ RLS habilitado em todas as tabelas
- [ ] ✅ Políticas de segurança executadas
- [ ] ✅ Testes de segurança passando
- [ ] ✅ Logs de auditoria funcionando
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Google OAuth configurado
- [ ] ✅ SSL/HTTPS habilitado
- [ ] ✅ Backup automático configurado

---

## 🔒 Boas Práticas

### **DO (Faça):**

✅ Sempre use RLS em produção
✅ Teste políticas antes do deploy
✅ Monitore logs de auditoria
✅ Use roles específicos para cada tipo de usuário
✅ Valide dados no backend E no banco
✅ Mantenha logs de ações críticas

### **DON'T (Não Faça):**

❌ Nunca desabilite RLS em produção
❌ Não use `service_role` key no frontend
❌ Não confie apenas em validação do frontend
❌ Não exponha IDs de usuários em URLs públicas
❌ Não permita criação de admins via API pública

---

## 🆘 Troubleshooting

### **Erro: "new row violates row-level security policy"**

**Causa:** Usuário tentando fazer algo não permitido

**Solução:** Verifique se:
1. Usuário está autenticado
2. Role está correto
3. Dados estão válidos

### **Políticas não aplicadas**

**Causa:** RLS pode não estar habilitado

**Solução:**
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

---

## 📚 Recursos Adicionais

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Segurança implementada! Sistema pronto para produção! 🔒**
