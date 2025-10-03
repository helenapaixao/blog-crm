# 🔧 Solução para Erro da Coluna Status

## ❌ **Erro atual:**
```
{code: "PGRST204", details: null, hint: null, message: "Could not find the 'status' column of 'groups' in the schema cache"}
```

## ✅ **Solução:**

### **Passo 1: Execute o Script SQL**

1. **Acesse o Supabase:**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login e selecione seu projeto

2. **Abra o SQL Editor:**
   - Clique em "SQL Editor" no menu lateral
   - Clique em "New Query"

3. **Execute o script:**
   - Copie todo o conteúdo do arquivo `add-status-column.sql`
   - Cole no editor SQL
   - Clique em "Run"

### **Passo 2: Verifique se funcionou**

Após executar o script, você deve ver:
- ✅ Tipo `group_status` criado
- ✅ Coluna `status` adicionada à tabela `groups`
- ✅ Políticas RLS atualizadas
- ✅ Grupos existentes com status 'approved'

### **Passo 3: Teste a criação de grupo**

1. Volte para a aplicação
2. Tente criar um grupo novamente
3. Deve funcionar sem erros

## 🔍 **Verificação manual:**

Se quiser verificar se a coluna foi criada:

```sql
-- Execute este comando no SQL Editor
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND table_schema = 'public'
AND column_name = 'status';
```

**Resultado esperado:**
```
column_name | data_type | column_default
status      | USER-DEFINED | 'pending'::group_status
```

## 🚨 **Se ainda der erro:**

1. **Limpe o cache do Supabase:**
   - Vá em "Settings" → "API"
   - Clique em "Regenerate API keys"
   - Atualize o arquivo `.env.local`

2. **Verifique as políticas RLS:**
   - Vá em "Authentication" → "Policies"
   - Confirme que as políticas foram criadas

3. **Execute o schema completo:**
   - Execute o arquivo `supabase-schema.sql` completo
   - Isso vai recriar tudo do zero

## 📋 **O que o script faz:**

1. ✅ Cria o tipo `group_status` (pending, approved, rejected)
2. ✅ Adiciona coluna `status` à tabela `groups`
3. ✅ Define valor padrão 'pending' para novos grupos
4. ✅ Atualiza grupos existentes para 'approved'
5. ✅ Remove políticas antigas
6. ✅ Cria novas políticas com controle de status
7. ✅ Verifica se tudo foi criado corretamente

**🎉 Após executar o script, o sistema de aprovação de grupos funcionará perfeitamente!**
