#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Blog CRM/CMS...\n');

// Verificar se o arquivo .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env.local criado a partir do .env.example');
    console.log('⚠️  Lembre-se de configurar suas credenciais do Supabase no arquivo .env.local\n');
  } else {
    console.log('❌ Arquivo .env.example não encontrado');
  }
} else {
  console.log('✅ Arquivo .env.local já existe\n');
}

// Verificar se o schema SQL existe
const schemaPath = path.join(process.cwd(), 'supabase-schema.sql');
if (fs.existsSync(schemaPath)) {
  console.log('✅ Schema SQL encontrado em supabase-schema.sql');
  console.log('📋 Execute este arquivo no SQL Editor do Supabase para configurar o banco de dados\n');
} else {
  console.log('❌ Arquivo supabase-schema.sql não encontrado\n');
}

console.log('📝 Próximos passos:');
console.log('1. Configure suas credenciais do Supabase no arquivo .env.local');
console.log('2. Execute o arquivo supabase-schema.sql no SQL Editor do Supabase');
console.log('3. Execute "npm run dev" para iniciar o servidor de desenvolvimento');
console.log('4. Acesse http://localhost:3000 para ver o blog\n');

console.log('🎉 Setup concluído!');
