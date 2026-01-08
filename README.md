# Vite + React + TypeScript + Supabase

Projeto pronto para deploy no **Easypanel** via **App Service** conectado ao GitHub.

## 🚀 Rodar Local (Desenvolvimento)

1. **Clone o repositório**
   ```bash
   git clone <seu-repo>
   cd <seu-repo>
   ```

2. **Crie o arquivo `.env.local`** (não versionado!)
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   ```

3. **Instale as dependências e rode**
   ```bash
   npm install
   npm run dev
   ```

4. Acesse `http://localhost:5173`

---

## 📦 Subir no GitHub

1. **Confirme que `.env.local` está no `.gitignore`** (já está configurado)
2. **NÃO suba arquivos `.env` com chaves reais**
3. Faça commit e push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

---

## ☁️ Deploy no Easypanel

### 1. Criar App Service
- No Easypanel, crie um novo **App Service**
- Conecte ao seu repositório GitHub
- **Build**: Selecione `Dockerfile` (caminho: `Dockerfile` na raiz)

### 2. Configurar Variáveis de Ambiente
No painel do Easypanel, vá em **Environment** e adicione:

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sua-anon-key-aqui` |

### 3. Configurar Domínio/Porta
- Em **Domains/Proxy**, configure a porta do app como `80`
- Configure seu domínio personalizado se desejar

### 4. Deploy
- Clique em **Deploy**
- O Easypanel vai:
  1. Clonar o repositório
  2. Buildar com o Dockerfile
  3. Injetar as variáveis em runtime via `/env.js`
  4. Servir o app com nginx em HTTPS

---

## 🔧 Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      PRODUÇÃO                            │
├─────────────────────────────────────────────────────────┤
│  Easypanel Environment                                   │
│  ├─ VITE_SUPABASE_URL                                   │
│  └─ VITE_SUPABASE_ANON_KEY                              │
│           │                                              │
│           ▼                                              │
│  Docker Container                                        │
│  ├─ 99-env.sh → gera /env.js em runtime                 │
│  ├─ nginx serve SPA                                      │
│  └─ App lê window.__ENV__                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DESENVOLVIMENTO                        │
├─────────────────────────────────────────────────────────┤
│  .env.local (não versionado)                            │
│  ├─ VITE_SUPABASE_URL                                   │
│  └─ VITE_SUPABASE_ANON_KEY                              │
│           │                                              │
│           ▼                                              │
│  Vite Dev Server                                         │
│  └─ App lê import.meta.env                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
/
├── Dockerfile          # Multi-stage build + runtime env
├── nginx.conf          # SPA fallback + cache config
├── .env.example        # Modelo das variáveis
├── public/
│   └── env.js          # Sobrescrito em runtime (prod)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── lib/
│       └── supabaseClient.ts  # Cliente com fallback runtime/vite
└── README.md
```

---

## 🔒 Segurança

- ✅ Chaves **nunca** são commitadas no repositório
- ✅ Em produção, variáveis são injetadas em runtime
- ✅ O `env.js` gerado não é cacheado pelo nginx
- ✅ A interface nunca mostra a key completa

---

## 🛠️ Tecnologias

- **Vite** - Build tool
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Nginx** - Production server
- **Docker** - Containerization
