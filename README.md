# BlogCRM - Reddit-like CMS

Sistema completo de gerenciamento de conteúdo inspirado no Reddit, construído com Next.js e Supabase. Uma plataforma moderna para criação de comunidades temáticas com sistema de aprovação e engajamento.

## 🚀 Funcionalidades

### Para Usuários Comuns
- ✅ Criação de conta e login
- ✅ Criação, edição e envio de postagens
- ✅ Sistema de rascunhos
- ✅ Perfil pessoal com avatar e biografia
- ✅ Interação com posts (curtir, comentar)
- ✅ Navegação por grupos temáticos

### Para Administradores
- ✅ Painel administrativo protegido
- ✅ Aprovação/reprovação de postagens
- ✅ Gerenciamento de grupos temáticos
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de usuários

### Sistema de Conteúdo
- ✅ Editor rich text com TipTap
- ✅ Sistema de tags
- ✅ Imagens de capa
- ✅ Grupos temáticos
- ✅ Status de publicação (rascunho, aguardando, publicado, rejeitado)
- ✅ Sistema de curtidas e comentários

## 🎯 Conceito Reddit-like

Este projeto é inspirado no Reddit, mas com foco no mercado brasileiro e funcionalidades modernas:

### 🌟 **Principais Características:**
- **Grupos Temáticos** (subreddits) para organizar conteúdo
- **Sistema de Aprovação** para manter qualidade
- **Interface Moderna** e responsiva
- **Performance Otimizada** com Next.js 15
- **Design Brasileiro** focado no mercado local

### 🚀 **Vantagens sobre Reddit:**
- ✅ Interface mais limpa e moderna
- ✅ Melhor performance e velocidade
- ✅ Sistema de aprovação para qualidade
- ✅ Upload de imagens nativo
- ✅ Editor rico integrado
- ✅ Foco no mercado brasileiro

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Editor**: TipTap (rich text editor)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL com Row Level Security
- **Animações**: Framer Motion, CSS Transitions

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd blog-crm-cms
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Aguarde a configuração do banco de dados

#### 3.2 Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3.3 Execute o schema SQL
1. No painel do Supabase, vá para "SQL Editor"
2. Copie o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script para criar as tabelas e políticas

### 4. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Perfis de usuários (estende auth.users)
- **groups**: Grupos temáticos
- **posts**: Postagens do blog
- **comments**: Comentários nas postagens
- **likes**: Curtidas nas postagens

### Políticas de Segurança (RLS)

- Usuários podem ver todos os perfis
- Usuários podem editar apenas seu próprio perfil
- Admins podem editar qualquer perfil
- Postagens publicadas são visíveis para todos
- Usuários podem ver apenas suas próprias postagens
- Admins podem ver todas as postagens
- Comentários são visíveis para todos
- Usuários autenticados podem criar comentários
- Usuários podem curtir postagens

## 👥 Sistema de Roles

### Usuário Comum
- Criar e editar suas próprias postagens
- Enviar postagens para aprovação
- Comentar e curtir postagens
- Gerenciar seu perfil

### Administrador
- Aprovar/rejeitar postagens
- Criar e gerenciar grupos temáticos
- Ver todas as postagens
- Acessar dashboard administrativo

## 🎨 Interface

### Páginas Principais
- **Home** (`/`): Lista de postagens publicadas
- **Login** (`/auth/login`): Página de login
- **Registro** (`/auth/register`): Página de cadastro
- **Dashboard** (`/dashboard`): Painel do usuário
- **Admin** (`/admin`): Painel administrativo
- **Perfil** (`/profile`): Perfil do usuário
- **Post** (`/post/[id]`): Visualização de postagem
- **Grupo** (`/group/[slug]`): Postagens por grupo

### Componentes
- Editor rich text com toolbar
- Sistema de comentários
- Sistema de curtidas
- Cards responsivos
- Navegação por abas
- Modais e diálogos

## 🔧 Configuração Adicional

### Storage (Imagens)
O Supabase está configurado com um bucket `images` para upload de imagens. Para usar:

1. No painel do Supabase, vá para "Storage"
2. Crie um bucket chamado `images`
3. Configure as políticas de acesso conforme o schema

### Primeiro Usuário Admin
Para criar o primeiro usuário administrador:

1. Registre-se normalmente
2. No painel do Supabase, vá para "Table Editor"
3. Na tabela `users`, encontre seu usuário
4. Altere o campo `role` de `user` para `admin`

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se o schema SQL foi executado corretamente
3. Verifique os logs do Supabase para erros
4. Abra uma issue no repositório

## 🔮 Próximas Funcionalidades

### 🎯 Funcionalidades Reddit-like (Prioridade Alta)
- [ ] **Sistema de votos** (upvote/downvote) para posts e comentários
- [ ] **Ranking de posts** por popularidade (score, hot, trending)
- [ ] **Flairs e tags personalizadas** para categorização visual
- [ ] **Busca avançada** por conteúdo, usuários e grupos
- [ ] **Notificações em tempo real** para interações

### 📱 Funcionalidades Mobile e UX
- [ ] **App mobile** (React Native) para iOS/Android
- [ ] **Chat/DM** entre usuários
- [ ] **Live discussions** (chat ao vivo em posts)
- [ ] **Polls e enquetes** interativas
- [ ] **Awards e badges** para usuários ativos

### 💰 Monetização e Analytics
- [ ] **Sistema de monetização** para criadores de conteúdo
- [ ] **Analytics avançados** de engajamento
- [ ] **Sistema de assinaturas** premium
- [ ] **Publicidade nativa** e sponsored content
- [ ] **Marketplace** integrado

### 🔧 Melhorias Técnicas
- [ ] **API REST completa** para integrações
- [ ] **PWA** (Progressive Web App)
- [ ] **Temas personalizáveis** por grupo
- [ ] **Moderação automática** com IA
- [ ] **Integração com redes sociais**
- [ ] **Sistema de backup** automático

## 🗺️ Roadmap de Desenvolvimento

### 📅 **Fase 1: Core Reddit Features (Q1 2024)**
- Sistema de votos (upvote/downvote)
- Ranking de posts por popularidade
- Flairs e tags personalizadas
- Busca avançada por conteúdo

### 📅 **Fase 2: Social Features (Q2 2024)**
- Notificações em tempo real
- Chat/DM entre usuários
- Live discussions
- Sistema de awards e badges

### 📅 **Fase 3: Mobile & Monetização (Q3 2024)**
- App mobile (React Native)
- Sistema de monetização
- Analytics avançados
- Publicidade nativa

### 📅 **Fase 4: Escala & Integrações (Q4 2024)**
- API REST completa
- PWA
- Integração com redes sociais
- Moderação automática com IA

## 🎯 Visão de Mercado

### 🇧🇷 **Oportunidade no Brasil**
- Reddit não é popular no Brasil
- Falta de plataformas de discussão em português
- Mercado de 200+ milhões de pessoas
- Comunidades brasileiras precisam de espaço

### 🌍 **Potencial Global**
- Interface superior ao Reddit atual
- Performance otimizada
- Tecnologia moderna
- Foco em qualidade de conteúdo