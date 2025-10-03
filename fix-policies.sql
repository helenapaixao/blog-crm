-- Script para corrigir políticas RLS duplicadas
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

-- 4. Remover TODAS as políticas existentes de todas as tabelas
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remover políticas da tabela groups
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'groups' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.groups';
    END LOOP;
    
    -- Remover políticas da tabela users
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.users';
    END LOOP;
    
    -- Remover políticas da tabela posts
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'posts' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.posts';
    END LOOP;
    
    -- Remover políticas da tabela comments
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.comments';
    END LOOP;
    
    -- Remover políticas da tabela likes
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'likes' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.likes';
    END LOOP;
    
    -- Remover políticas da tabela storage.objects
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- 5. Recriar todas as políticas RLS

-- Políticas para users table
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para groups table
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

-- Políticas para posts table
CREATE POLICY "Published posts are viewable by everyone" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own posts" ON public.posts
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Admins can view all posts" ON public.posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Admins can update any post" ON public.posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "Admins can delete any post" ON public.posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para comments table
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (author_id = auth.uid());

-- Políticas para likes table
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON public.likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE USING (user_id = auth.uid());

-- Políticas para storage
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. Verificar se tudo foi criado corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;
