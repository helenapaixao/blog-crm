# 🔧 Solução para Políticas RLS Duplicadas

## ❌ **Erro atual:**
```
ERROR: 42710: policy "Everyone can view approved groups" for table "groups" already exists
```

## ✅ **Soluções disponíveis:**

### **🚀 Solução Rápida (Recomendada):**

1. **Execute o script `quick-fix-policies.sql`:**
   - Vá para Supabase → SQL Editor
   - Copie o conteúdo do arquivo `quick-fix-policies.sql`
   - Cole e execute

**O que faz:**
- ✅ Adiciona coluna `status` se não existir
- ✅ Remove políticas duplicadas específicas
- ✅ Recria as políticas corretas
- ✅ Verifica se funcionou

### **🔧 Solução Completa (Se a rápida não funcionar):**

1. **Execute o script `fix-policies.sql`:**
   - Remove TODAS as políticas de TODAS as tabelas
   - Recria tudo do zero
   - Mais seguro, mas mais agressivo

### **🔄 Solução Manual (Se nada funcionar):**

Execute estes comandos no SQL Editor:

```sql
-- 1. Remover políticas específicas
DROP POLICY IF EXISTS "Everyone can view approved groups" ON public.groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can view all groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Users can update their own pending groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can manage all groups" ON public.groups;

-- 2. Adicionar coluna status se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        CREATE TYPE group_status AS ENUM ('pending', 'approved', 'rejected');
        ALTER TABLE public.groups ADD COLUMN status group_status DEFAULT 'pending';
        UPDATE public.groups SET status = 'approved' WHERE status IS NULL;
    END IF;
END $$;

-- 3. Recriar políticas
CREATE POLICY "Everyone can view approved groups" ON public.groups
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own groups" ON public.groups
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Admins can view all groups" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own pending groups" ON public.groups
  FOR UPDATE USING (created_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all groups" ON public.groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🎯 **Ordem de execução:**

1. **Primeiro**: Tente `quick-fix-policies.sql`
2. **Se falhar**: Use `fix-policies.sql`
3. **Se ainda falhar**: Use a solução manual
4. **Teste**: Tente criar um grupo na aplicação

## ✅ **Verificação:**

Após executar qualquer solução, verifique:

```sql
-- Verificar se a coluna status existe
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND table_schema = 'public'
AND column_name = 'status';

-- Verificar políticas criadas
SELECT policyname FROM pg_policies 
WHERE tablename = 'groups' 
AND schemaname = 'public'
ORDER BY policyname;
```

## 🚨 **Se ainda der erro:**

1. **Limpe o cache do navegador**
2. **Regenere as API keys** no Supabase
3. **Atualize o arquivo `.env.local`**
4. **Execute o schema completo** `supabase-schema.sql`

**🎉 Após executar qualquer uma das soluções, o sistema funcionará perfeitamente!**
