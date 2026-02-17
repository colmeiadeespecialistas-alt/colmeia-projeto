# 🔐 Configuração do Supabase - Passo a Passo

## 📍 Agora preciso das suas credenciais do Supabase!

Siga estes passos para configurar o banco de dados:

---

## 1️⃣ Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login ou crie uma conta gratuita
3. Clique em **"New Project"**
4. Preencha:
   - **Name:** `colmeia-mvp`
   - **Database Password:** Crie uma senha forte (guarde bem!)
   - **Region:** `South America (São Paulo)` ou a mais próxima
5. Clique em **"Create new project"**
6. Aguarde ~2 minutos até o projeto ser criado

---

## 2️⃣ Copiar Credenciais

Após o projeto ser criado:

1. No dashboard, vá em: **Settings** (⚙️) > **API**
2. Você verá duas seções importantes:

### **Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
👆 Copie esta URL completa

### **API Keys - anon/public:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```
👆 Copie esta chave (é bem longa!)

---

## 3️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=cole-sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=cole-sua-chave-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ⚠️ IMPORTANTE:
- Cole as credenciais **sem aspas**
- Não compartilhe essas credenciais
- Não faça commit do arquivo `.env.local` (já está no .gitignore)

### Exemplo completo:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNzg0MDAsImV4cCI6MjAxNjg1NDQwMH0.abcdef123456
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4️⃣ Criar Tabelas no Banco de Dados

1. No dashboard do Supabase, vá em: **SQL Editor** (ícone de código)
2. Clique em **"New Query"**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. **Copie TODO o conteúdo** do arquivo (são ~200 linhas)
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** ou pressione `Ctrl + Enter`

### ✅ Resultado esperado:
```
Success. No rows returned
```

### Verificar tabelas criadas:
1. Vá em **Table Editor** (ícone de tabela)
2. Você deve ver 3 tabelas:
   - ✅ `profiles`
   - ✅ `service_requests`
   - ✅ `reviews`

---

## 5️⃣ Configurar Google OAuth (Autenticação)

### Parte 1: Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** (se solicitado)
4. Vá em: **APIs & Services** > **Credentials**
5. Clique em **"Create Credentials"** > **"OAuth 2.0 Client ID"**
6. Se aparecer o "OAuth consent screen":
   - Escolha **External**
   - Preencha apenas os campos obrigatórios
   - Em "Scopes", adicione: `email`, `profile`, `openid`
   - Salve e continue

7. Agora crie o OAuth Client ID:
   - Application type: **Web application**
   - Name: `Colmeia OAuth Client`

8. Configure as URLs:

   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```

   **Authorized redirect URIs:**
   ```
   https://SEU_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   ⚠️ Substitua `SEU_PROJECT_ID` pelo ID real do seu projeto Supabase

   **Exemplo:**
   ```
   https://abcdefghijk.supabase.co/auth/v1/callback
   ```

9. Clique em **Create**
10. Copie o **Client ID** e **Client Secret**

### Parte 2: Configurar no Supabase

1. No dashboard do Supabase, vá em: **Authentication** > **Providers**
2. Encontre **Google** na lista
3. Clique em **Edit** (ícone de lápis)
4. Habilite o toggle **"Enable Sign in with Google"**
5. Cole:
   - **Client ID** (do Google Cloud Console)
   - **Client Secret** (do Google Cloud Console)
6. Clique em **Save**

---

## 6️⃣ Testar a Aplicação

### Iniciar o servidor:
```bash
npm run dev
```

### Acessar:
```
http://localhost:3000
```

### Testar fluxos:

1. **Landing Page:** Deve carregar normalmente
2. **Cadastro:** Clique em "Cadastrar"
   - Teste o cadastro com email/senha
   - Teste o login com Google
3. **Login:** Teste fazer login
4. **Dashboard:** Após login, você deve ver o dashboard apropriado

---

## 🎯 Criar Usuário Admin (Opcional)

Para acessar o Dashboard Admin, você precisa alterar o role de um usuário:

1. Cadastre um usuário normalmente
2. No Supabase, vá em **Table Editor** > **profiles**
3. Encontre o seu usuário
4. Clique em **Edit** (ícone de lápis)
5. Altere o campo `role` de `client` para `admin`
6. Salve
7. Faça logout e login novamente
8. Você será redirecionado para `/dashboard/admin`

---

## ✅ Checklist Final

Antes de continuar, verifique:

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env.local` criado com as credenciais
- [ ] Script SQL executado (3 tabelas criadas)
- [ ] Google OAuth configurado
- [ ] Aplicação rodando em http://localhost:3000
- [ ] Conseguiu fazer cadastro/login
- [ ] Dashboard carregando corretamente

---

## 🆘 Problemas Comuns

### "Invalid API key"
**Solução:** Verifique se copiou a `anon key` correta, não a `service_role key`

### "Failed to fetch" no login
**Solução:** Confirme que a URL do Supabase está correta no `.env.local`

### Google OAuth não funciona
**Solução:**
- Verifique se a URL de callback está correta
- Certifique-se de que o provider está habilitado no Supabase
- Limpe o cache do navegador

### Tabelas não aparecem
**Solução:** Execute o script SQL novamente, verificando se não há erros

### "User not found" após login
**Solução:** O trigger para criar o profile pode não ter funcionado. Crie manualmente:
```sql
INSERT INTO profiles (id, full_name, role)
VALUES ('seu-user-id', 'Seu Nome', 'client');
```

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do navegador (F12 > Console)
2. Verifique os logs do terminal onde o Next.js está rodando
3. Consulte a [documentação do Supabase](https://supabase.com/docs)

---

**Pronto! Agora é só me informar as credenciais quando solicitado.** 🚀
