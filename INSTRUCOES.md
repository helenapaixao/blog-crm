# 📋 Instruções de Uso - Blog CRM/CMS

## 🚀 Início Rápido

### 1. Configuração do Supabase

1. **Crie um projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma nova conta ou faça login
   - Clique em "New Project"
   - Escolha um nome e senha para o banco
   - Aguarde a configuração (2-3 minutos)

2. **Configure as variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env.local`
   - No painel do Supabase, vá em "Settings" > "API"
   - Copie a URL do projeto e a chave anônima
   - Cole no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seuprojeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui
```

3. **Execute o schema SQL:**
   - No painel do Supabase, vá em "SQL Editor"
   - Clique em "New Query"
   - Copie todo o conteúdo do arquivo `supabase-schema.sql`
   - Cole no editor e clique em "Run"

### 2. Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

## 👤 Primeiro Usuário Administrador

1. **Registre-se normalmente:**
   - Acesse `/auth/register`
   - Crie sua conta

2. **Torne-se administrador:**
   - No painel do Supabase, vá em "Table Editor"
   - Selecione a tabela `users`
   - Encontre seu usuário pelo email
   - Altere o campo `role` de `user` para `admin`
   - Salve as alterações

3. **Acesse o painel admin:**
   - Faça login novamente
   - Agora você verá o botão "Admin" no header

## 📝 Como Usar o Sistema

### Para Usuários Comuns

1. **Criar uma conta:**
   - Clique em "Cadastrar" no header
   - Preencha os dados e confirme o email

2. **Criar uma postagem:**
   - Faça login e vá para "Dashboard"
   - Clique em "Nova Postagem"
   - Preencha título, conteúdo e selecione um grupo
   - Salve como rascunho ou envie para aprovação

3. **Gerenciar postagens:**
   - No dashboard, veja todas suas postagens
   - Use as abas para filtrar por status
   - Edite postagens clicando no ícone de edição

4. **Interagir com conteúdo:**
   - Curta postagens clicando no coração
   - Comente nas postagens publicadas
   - Navegue por grupos temáticos

### Para Administradores

1. **Aprovar postagens:**
   - Acesse o painel "Admin"
   - Veja postagens aguardando aprovação
   - Clique em "Aprovar" ou "Rejeitar"

2. **Gerenciar grupos:**
   - Vá em "Admin" > "Gerenciar Grupos"
   - Crie novos grupos temáticos
   - Edite ou exclua grupos existentes

3. **Ver estatísticas:**
   - Dashboard admin mostra métricas importantes
   - Número de postagens por status
   - Total de grupos e usuários

## 🎨 Personalização

### Adicionar Novos Grupos

1. Como admin, vá em "Gerenciar Grupos"
2. Clique em "Criar Novo Grupo"
3. Preencha nome, descrição e slug
4. O slug será usado na URL (ex: `/group/tecnologia`)

### Configurar Imagens

- **Avatar:** Cole a URL da imagem no perfil
- **Capa de postagem:** Cole a URL no editor de postagens
- **Imagens no conteúdo:** Use o botão de imagem no editor

### Editor de Texto

O editor suporta:
- **Formatação:** Negrito, itálico, títulos
- **Listas:** Com marcadores e numeradas
- **Links:** Clique no botão de link
- **Imagens:** Clique no botão de imagem
- **Citações:** Use o botão de aspas

## 🔧 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Teste a conexão no painel do Supabase

### Postagens não aparecem
- Verifique se o status é "published"
- Confirme se o usuário tem permissão de admin
- Verifique as políticas RLS no Supabase

### Erro de autenticação
- Limpe o cache do navegador
- Verifique se o email foi confirmado
- Tente fazer logout e login novamente

### Imagens não carregam
- Use URLs válidas e acessíveis
- Verifique se a imagem está online
- Teste a URL diretamente no navegador

## 📱 Recursos Mobile

O sistema é totalmente responsivo:
- **Navegação:** Menu hambúrguer em telas pequenas
- **Editor:** Funciona bem em tablets
- **Cards:** Se adaptam ao tamanho da tela
- **Formulários:** Otimizados para touch

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório:**
   - Faça push do código para GitHub
   - Conecte o repositório ao Vercel

2. **Configure variáveis:**
   - No painel do Vercel, vá em "Settings" > "Environment Variables"
   - Adicione todas as variáveis do `.env.local`

3. **Deploy:**
   - O deploy acontece automaticamente
   - Acesse a URL fornecida pelo Vercel

### Outras Plataformas

O projeto funciona em qualquer plataforma que suporte Next.js:
- **Netlify:** Conecte o repositório e configure as variáveis
- **Railway:** Deploy direto do GitHub
- **DigitalOcean:** Use o App Platform

## 📊 Monitoramento

### Logs do Supabase
- Acesse "Logs" no painel do Supabase
- Monitore erros de autenticação
- Verifique queries lentas

### Analytics
- Use o dashboard admin para métricas básicas
- Monitore postagens mais populares
- Acompanhe crescimento de usuários

## 🔒 Segurança

### Políticas RLS
- Todas as tabelas têm Row Level Security ativada
- Usuários só veem seus próprios dados
- Admins têm acesso total

### Autenticação
- Senhas são criptografadas pelo Supabase
- Sessões são gerenciadas automaticamente
- Logout limpa todas as sessões

### Validação
- Formulários têm validação client-side
- Dados são validados no servidor
- XSS é prevenido com sanitização

## 🆘 Suporte

Se precisar de ajuda:

1. **Verifique os logs:** Console do navegador e logs do Supabase
2. **Documentação:** README.md tem informações detalhadas
3. **Issues:** Abra uma issue no repositório
4. **Comunidade:** Use o Discord do Supabase para dúvidas

## 🎯 Próximos Passos

Após configurar o sistema básico, considere:

- [ ] Configurar domínio personalizado
- [ ] Implementar backup automático
- [ ] Adicionar analytics (Google Analytics)
- [ ] Configurar CDN para imagens
- [ ] Implementar cache Redis
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD
- [ ] Implementar monitoramento de performance

---

**🎉 Parabéns! Seu blog CRM/CMS está funcionando!**

Agora você tem um sistema completo de gerenciamento de conteúdo com todas as funcionalidades solicitadas.
