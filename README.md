# 🐝 Colmeia de Especialistas - MVP

Plataforma de conexão entre clientes e profissionais especializados em serviços residenciais e empresariais.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes UI:** Shadcn/ui
- **Backend:** Supabase (Auth + Database)
- **ORM:** Supabase Client
- **Autenticação:** Google OAuth via Supabase

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm
- Conta no Supabase (gratuita)
- Conta Google Cloud (para OAuth)

## 🛠️ Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Copie a **URL do projeto** e a **Anon Key**
3. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Criar Tabelas no Supabase

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script para criar todas as tabelas e políticas

### 4. Configurar Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou use um existente
3. Ative a **Google+ API**
4. Em **Credenciais**, crie um **OAuth 2.0 Client ID**
5. Configure as URLs autorizadas:
   - Origens JavaScript autorizadas: `http://localhost:3000`
   - URIs de redirecionamento: `https://SEU_PROJECT_ID.supabase.co/auth/v1/callback`

6. No Supabase Dashboard:
   - Vá em **Authentication** > **Providers**
   - Ative o **Google Provider**
   - Cole o **Client ID** e **Client Secret** do Google

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
colmeia-projeto/
├── app/
│   ├── (auth)/
│   │   ├── login/              # Página de login
│   │   └── cadastro/           # Página de cadastro
│   ├── auth/
│   │   └── callback/           # Callback do OAuth
│   ├── dashboard/
│   │   ├── client/             # Dashboard do Cliente
│   │   ├── specialist/         # Dashboard do Especialista
│   │   └── admin/              # Dashboard do Admin
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Landing Page
│   └── globals.css             # Estilos globais
├── components/
│   ├── dashboard/              # Componentes do dashboard
│   └── ui/                     # Componentes Shadcn/ui
├── lib/
│   ├── supabase/               # Configuração Supabase
│   └── utils.ts                # Utilitários
├── supabase-schema.sql         # Schema do banco de dados
└── middleware.ts               # Middleware de autenticação
```

## 👥 Tipos de Usuário

### 1. Cliente
- Solicitar novos serviços
- Acompanhar status dos pedidos
- Avaliar especialistas
- Gerenciar perfil

### 2. Especialista
- Visualizar chamados disponíveis
- Aceitar trabalhos
- Gerenciar serviços em andamento
- Acompanhar ganhos e avaliações

### 3. Master Admin
- Dashboard com métricas gerais
- Gerenciar usuários
- Visualizar todos os serviços
- Acompanhar receita da plataforma

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `profiles`
- `id`: UUID (FK para auth.users)
- `full_name`: Nome completo
- `role`: client | specialist | admin
- `phone`: Telefone (opcional)
- `avatar_url`: URL do avatar
- `bio`: Biografia
- `rating`: Avaliação média
- `completed_jobs`: Total de trabalhos concluídos

#### `service_requests`
- `id`: UUID
- `client_id`: UUID (FK para profiles)
- `specialist_id`: UUID (FK para profiles, nullable)
- `service_type`: Tipo de serviço
- `description`: Descrição detalhada
- `location`: Localização
- `price`: Preço estimado
- `preferred_date`: Data preferencial
- `status`: pending | in_progress | completed | cancelled

#### `reviews`
- `id`: UUID
- `service_request_id`: UUID (FK)
- `client_id`: UUID (FK)
- `specialist_id`: UUID (FK)
- `rating`: 1-5 estrelas
- `comment`: Comentário

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- Políticas de acesso baseadas em roles
- Middleware de autenticação protegendo rotas
- OAuth com Google para login seguro

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

### Outras Plataformas

- **Netlify:** Suporta Next.js
- **Railway:** Deploy com Docker
- **Render:** Suporte nativo para Next.js

## 📝 Próximos Passos

- [ ] Sistema de notificações em tempo real
- [ ] Chat entre cliente e especialista
- [ ] Pagamento integrado (Stripe/Mercado Pago)
- [ ] Sistema de geolocalização
- [ ] App mobile com React Native
- [ ] Sistema de vouchers e cupons
- [ ] Programa de fidelidade

## 🤝 Contribuindo

Contribuições são bem-vindas! Para mudanças importantes:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas e suporte, abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js 15 e Supabase
