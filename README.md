# Mercado X — Prudential

CRM de Mercado X para Life Planners da Prudential do Brasil.

## Stack

HTML + CSS + JavaScript puro. Zero dependências de build. Deploy instantâneo no Vercel ou GitHub Pages.

## Como rodar localmente

Abra o `index.html` diretamente no navegador. Não precisa de servidor.

## Deploy no Vercel

1. Faça push deste repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Framework Preset: **Other**
4. Build Command: *(deixe vazio)*
5. Output Directory: *(deixe vazio ou ponto `.`)*
6. Clique em **Deploy**

## Deploy no GitHub Pages

1. Vá em **Settings → Pages**
2. Source: `Deploy from a branch`
3. Branch: `main`, pasta: `/ (root)`
4. Salve e aguarde o deploy

## Funcionalidades

- **Mercado X** — lista de contatos com acordeão, busca e filtro por status
- **Dashboard** — métricas, top recomendantes e breakdown por status
- **Ranking** — melhores recomendantes com barra de desempenho
- **Relatórios** — exportação em CSV e XLS com filtros
- **Perfil** — nome, cargo/credencial e foto personalizáveis
- **Anotações** — timeline de anotações por contato
- **Indicações** — rede de conexões com autocomplete de recomendante
- **Responsivo** — mobile-first, funciona em celular e desktop

## Dados

Os dados ficam salvos no `localStorage` do navegador. Para uso em produção com múltiplos usuários, integre com um backend (Supabase, Firebase, etc.).
