-- Script rápido para corrigir políticas duplicadas
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna status se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'groups' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        -- Criar tipo se não existir
        DO $$ BEGIN
            CREATE TYPE group_status AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        
        -- Adicionar coluna
        ALTER TABLE public.groups ADD COLUMN status group_status DEFAULT 'pending';
        
        -- Atualizar grupos existentes
        UPDATE public.groups SET status = 'approved' WHERE status IS NULL;
    END IF;
END $$;

-- 2. Remover políticas específicas que estão dando conflito
DROP POLICY IF EXISTS "Everyone can view approved groups" ON public.groups;
DROP POLICY IF EXISTS "Users can view their own groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can view all groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Users can update their own pending groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can manage all groups" ON public.groups;

-- 3. Recriar as políticas para groups
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

-- 4. Verificar se funcionou
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'groups' 
AND table_schema = 'public'
AND column_name = 'status';

SELECT policyname FROM pg_policies 
WHERE tablename = 'groups' 
AND schemaname = 'public'
ORDER BY policyname;
