-- Script para adicionar coluna status à tabela groups
-- Execute este script no SQL Editor do Supabase

-- 1. Criar o tipo group_status se não existir
DO $$ BEGIN
    CREATE TYPE group_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar coluna status à tabela groups se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.groups ADD COLUMN status group_status DEFAULT 'pending';
    END IF;
END $$;

-- 3. Atualizar grupos existentes para terem status 'approved' por padrão
UPDATE public.groups 
SET status = 'approved' 
WHERE status IS NULL;

-- 4. Remover todas as políticas existentes da tabela groups
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'groups' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.groups';
    END LOOP;
END $$;

-- 5. Criar novas políticas com status
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

-- 6. Verificar se a coluna foi criada
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND table_schema = 'public'
AND column_name = 'status';
