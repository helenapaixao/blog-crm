# Blog CRM/CMS

Sistema completo de gerenciamento de conteúdo para blog construído com Next.js e Supabase.

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

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Editor**: TipTap (rich text editor)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL com Row Level Security

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

- [ ] Upload de imagens via interface
- [ ] Sistema de notificações
- [ ] Moderação de comentários
- [ ] Analytics de postagens
- [ ] Sistema de newsletter
- [ ] API REST para integrações
- [ ] PWA (Progressive Web App)
- [ ] Temas personalizáveis