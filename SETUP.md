# 🚀 Guia de Configuração Rápida

## Passo 1: Instalar Dependências ✅

```bash
npm install
```

**Status:** ✅ Concluído!

---

## Passo 2: Configurar Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Escolha um nome para o projeto: `colmeia-mvp`
4. Defina uma senha forte para o banco de dados
5. Escolha a região mais próxima (ex: South America - São Paulo)
6. Aguarde a criação do projeto (~2 minutos)

### 2.2 Copiar Credenciais

No dashboard do Supabase:

1. Vá em **Settings** > **API**
2. Copie a **URL** do projeto
3. Copie a **anon/public** key

### 2.3 Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Cole as credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Passo 3: Criar Tabelas no Banco de Dados

### 3.1 Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie **TODO** o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor
5. Clique em **"Run"** (ou pressione Ctrl+Enter)

**Resultado esperado:** "Success. No rows returned"

### 3.2 Verificar Tabelas Criadas

Vá em **Table Editor** e verifique se existem:
- ✅ profiles
- ✅ service_requests
- ✅ reviews

---

## Passo 4: Configurar Google OAuth

### 4.1 Google Cloud Console

1. Acesse [https://console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **"Create Credentials"** > **"OAuth 2.0 Client ID"**
5. Escolha **"Web application"**
6. Configure:
   - Nome: `Colmeia OAuth`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `https://seu-projeto.supabase.co/auth/v1/callback`
7. Copie o **Client ID** e **Client Secret**

### 4.2 Configurar no Supabase

1. No Supabase Dashboard, vá em **Authentication** > **Providers**
2. Encontre **Google** e clique em **Edit**
3. Habilite o provider
4. Cole o **Client ID** e **Client Secret**
5. Salve as configurações

---

## Passo 5: Executar o Projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## ✅ Checklist de Verificação

Antes de continuar, verifique se:

- [ ] As dependências foram instaladas sem erros
- [ ] O arquivo `.env.local` foi criado com as credenciais corretas
- [ ] As tabelas foram criadas no Supabase (3 tabelas)
- [ ] O Google OAuth foi configurado
- [ ] O projeto está rodando em http://localhost:3000
- [ ] A Landing Page está carregando corretamente

---

## 🐛 Problemas Comuns

### "Invalid API key"
- Verifique se copiou a **anon key** correta do Supabase
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto

### "Failed to fetch"
- Confirme que a URL do Supabase está correta
- Verifique se o projeto do Supabase está ativo

### Google OAuth não funciona
- Certifique-se de que a URL de callback está correta
- Verifique se o Google Provider está habilitado no Supabase

### Tabelas não aparecem
- Execute o script SQL novamente
- Verifique se não há erros no SQL Editor

---

## 🎯 Próximos Passos

Após a configuração:

1. **Teste o cadastro:**
   - Clique em "Cadastrar"
   - Teste o login com Google
   - Crie um perfil de Cliente

2. **Teste o fluxo de Cliente:**
   - Acesse o Dashboard
   - Solicite um novo serviço
   - Visualize o status

3. **Teste o fluxo de Especialista:**
   - Cadastre uma segunda conta como Especialista
   - Veja os chamados disponíveis
   - Aceite um trabalho

4. **Teste o Admin:**
   - Via SQL Editor, altere um usuário para admin:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = 'seu-user-id';
   ```
   - Acesse o Dashboard Admin

---

## 📚 Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Precisa de ajuda?** Abra uma issue no GitHub!
